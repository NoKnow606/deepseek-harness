/**
 * Nezuko desktop pet, browser half: mounts the chibi figure and derives her
 * mood from the agent world. State derivation:
 *
 *   manual box (right-click)  → 'box'    (persists until right-click again)
 *   turn error (DOM watch)    → 'box'    (she hides, ~9s)
 *   any session running       → 'run'    (Blood Demon Art sprint)
 *   any session awaiting user → 'alert'  (beckons: a question/permission waits)
 *   a run just finished       → 'dance'  (~6s celebration)
 *   otherwise                 → 'sleep'  (idle breathing, Zzz)
 *
 * The running/pending facts come from ctx.sessions.list (the same feed the
 * sidebar reads); turn errors have no list-level field, so a MutationObserver
 * watches the conversation for `turnErrorRow` rows — a presentation-level
 * signal for a presentation-layer pet, no session internals touched.
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import { mountPet, readBoxed, writeBoxed, type PetState } from './pet.ts'
import './pet.module.css'

/** Required services: the sessions feed her mood mirrors. */
export const inject = ['sessions']

const DANCE_MS = 6000
const ERROR_BOX_MS = 9000

/**
 * Client plugin body: mount the pet, wire the sessions feed, the error
 * observer and the manual-box toggle, and dispose all of it with the effect.
 * @param ctx - client cordis context.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => {
    let manualBox = readBoxed()
    let anyRunning = false
    let anyPending = false
    let wasRunning = false
    let danceUntil = 0
    let errorUntil = 0
    let expiryTimer: number | undefined

    const pet = mountPet(() => {
      manualBox = !manualBox
      writeBoxed(manualBox)
      recompute()
    })

    /** Priority resolution; transient windows (dance/error) expire on a timer. */
    function recompute(): void {
      const now = Date.now()
      let state: PetState = 'sleep'
      if (manualBox || now < errorUntil) state = 'box'
      else if (anyRunning) state = 'run'
      else if (anyPending) state = 'alert'
      else if (now < danceUntil) state = 'dance'
      pet.setState(state)

      window.clearTimeout(expiryTimer)
      expiryTimer = undefined
      const expiry = state === 'dance' ? danceUntil : state === 'box' && !manualBox ? errorUntil : 0
      if (expiry > 0) {
        expiryTimer = window.setTimeout(recompute, Math.max(0, expiry - now) + 30)
      }
    }

    /* Sessions feed: running / pending / just-finished. */
    const derive = (): void => {
      const snapshot = ctx.sessions.list.getSnapshot()
      const running = snapshot.ids.some(id => snapshot.byId[id]?.running === true)
      const pending = snapshot.ids.some(id => snapshot.byId[id]?.pendingInteraction != null)
      if (wasRunning && !running) danceUntil = Date.now() + DANCE_MS
      wasRunning = running
      anyRunning = running
      anyPending = pending
      recompute()
    }
    derive()
    const unsubscribe = ctx.sessions.list.subscribe(derive)

    /* Turn errors: watch for freshly added error rows anywhere in the app. */
    const errorObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (!(node instanceof HTMLElement)) continue
          const hit = (typeof node.className === 'string' && node.className.includes('turnErrorRow'))
            || node.querySelector('[class*="turnErrorRow"]') !== null
          if (hit) {
            errorUntil = Date.now() + ERROR_BOX_MS
            recompute()
            return
          }
        }
      }
    })
    errorObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      unsubscribe()
      errorObserver.disconnect()
      window.clearTimeout(expiryTimer)
      pet.dispose()
    }
  }, 'ui-pet-nezuko: pet layer')
}
