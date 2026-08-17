/**
 * Kimetsu (Demon Slayer) theme plugin, browser half: registers the two
 * Kimetsu palettes into the ui-theme runtime and contributes its own
 * Appearance cube row into the General settings section (the built-in
 * Appearance row only carries the built-in light/dark/system preferences).
 * Registering a theme id makes `ctx.theme.setTheme(id)` accept it; the
 * in-process preference then survives until the plugin reloads — the
 * durable-settings schema stays limited to built-in preferences, a boundary
 * owned by ui-theme.
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type { BoundActions } from '@deepseek-ai/dsh-client-ui-slots'
// Type-only: pulls the theme service's Context merge (`ctx.theme`).
import type {} from '@deepseek-ai/dsh-client-ui-theme/client'
// Type-only: the settings slot map rows (`settings.general.item`).
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
// Type-only: pulls the locale plugin's Context merge (ctx.locale).
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type { ThemeSnapshot } from '@deepseek-ai/dsh-client-ui-theme/client'
import { KIMETSU_LIGHT_THEME_ID, KIMETSU_THEME_ID, KIMETSU_THEMES } from '../theme.ts'
import { en, NS, zh } from './locales.ts'
import { KimetsuRow, type KimetsuRowInjected } from './KimetsuRow.tsx'
import { createKimetsuRowStore } from './settings-store.ts'
import { mountAmbientMedia } from './media.ts'
import './decorations.module.css'

export type { KimetsuRowComponentProps, KimetsuRowInjected } from './KimetsuRow.tsx'
export type { KimetsuRowState } from './settings-store.ts'
export { KIMETSU_THEME_ID, KIMETSU_LIGHT_THEME_ID, KIMETSU_THEMES } from '../theme.ts'

/**
 * Required services: the theme runtime this plugin registers into, slots for
 * the settings row, and locale for the row's copy.
 */
export const inject = ['theme', 'slots', 'locale']

/**
 * localStorage key carrying the Kimetsu preference across page loads. The
 * durable settings schema accepts only built-in preferences (a ui-theme-owned
 * boundary), so a third-party theme persists browser-side instead.
 */
const STORAGE_KEY = 'dsh.ui-theme-kimetsu.preference'

/** Read the persisted Kimetsu theme id, or undefined. Never throws. */
function readSaved(): string | undefined {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === KIMETSU_THEME_ID || value === KIMETSU_LIGHT_THEME_ID ? value : undefined
  } catch { return undefined }
}

/** Persist or clear the Kimetsu preference. Never throws. */
function writeSaved(id: string | undefined): void {
  try {
    if (id === undefined) localStorage.removeItem(STORAGE_KEY)
    else localStorage.setItem(STORAGE_KEY, id)
  } catch { /* private-mode storage failure leaves the session-only preference */ }
}

/**
 * Client plugin body: register the Kimetsu themes, then mount the feature's
 * Appearance row (order 11 — directly under the built-in Appearance row at
 * order 10).
 * @param ctx - client cordis context.
 */
export function apply(ctx: ClientContext): void {
  for (const definition of KIMETSU_THEMES) {
    ctx.effect(() => ctx.theme.register(definition), `ui-theme-kimetsu: register ${definition.id}`)
  }

  // Decoration gate: own a `data-kimetsu` body attribute mirroring whether a
  // Kimetsu palette is active (the layout presenter writes only its own
  // attributes and leaves foreign ones alone). decorations.css scopes every
  // rule under this attribute, so pattern work appears and disappears with
  // the theme. Values: 'dark' | 'light'; absent on built-in themes. While a
  // Kimetsu palette is active, also mount the user-supplied ambient media
  // layer (probes /kimetsu/* URLs; mounts nothing when the user placed no
  // files). A sequence guard drops stale mounts that race a theme switch.
  // Restore the persisted preference immediately after registration (the
  // just-registered ids are valid setTheme arguments by construction).
  const saved = readSaved()
  if (saved !== undefined) ctx.theme.setTheme(saved)

  ctx.effect(() => {
    let disposeMedia: (() => void) | undefined
    let mediaSeq = 0
    // ui-theme's settings adoption fires shortly after boot and resets the
    // preference to the persisted BUILT-IN value — indistinguishable from a
    // user picking a built-in cube except by timing. Inside the grace window
    // a non-Kimetsu preference is treated as that adoption and the saved
    // Kimetsu preference is re-asserted; afterwards it is a user gesture and
    // clears the persistence.
    const bootedAt = Date.now()
    const GRACE_MS = 2500
    const applyGate = (snapshot: ThemeSnapshot): void => {
      const id = snapshot.active.id
      const mode = id === KIMETSU_THEME_ID ? 'dark' as const
        : id === KIMETSU_LIGHT_THEME_ID ? 'light' as const
          : undefined
      // Persistence: mirror Kimetsu selections; re-assert or clear on others.
      if (id === KIMETSU_THEME_ID || id === KIMETSU_LIGHT_THEME_ID) {
        writeSaved(id)
      } else if (Date.now() - bootedAt < GRACE_MS && readSaved() !== undefined) {
        // Re-assert the saved Kimetsu preference — DEFERRED to a microtask.
        // Calling setTheme synchronously inside this theme/change listener
        // nests a fresh emit inside the adoption emit: listeners ordered
        // after this gate (ui-layout's presenter) then resume the OUTER emit
        // with the stale non-Kimetsu snapshot and retract the Kimetsu tokens
        // the nested emit just applied — observed as `data-kimetsu=dark`
        // with zero inline tokens (the built-in palette leaks through).
        // The microtask lets the outer emit finish; the re-check keeps the
        // re-assertion honest when the state has since settled on Kimetsu.
        const saved = readSaved() ?? KIMETSU_THEME_ID
        queueMicrotask(() => {
          const current = ctx.theme.getTheme().active.id
          if (current !== KIMETSU_THEME_ID && current !== KIMETSU_LIGHT_THEME_ID) {
            ctx.theme.setTheme(saved)
          }
        })
        return
      } else {
        writeSaved(undefined)
      }
      if (mode === undefined) {
        document.body.removeAttribute('data-kimetsu')
      } else {
        document.body.setAttribute('data-kimetsu', mode)
      }
      mediaSeq += 1
      disposeMedia?.()
      disposeMedia = undefined
      if (mode !== undefined) {
        const seq = mediaSeq
        void mountAmbientMedia(mode).then((dispose) => {
          if (seq !== mediaSeq) { dispose(); return }
          disposeMedia = dispose
        })
      }
    }
    applyGate(ctx.theme.getTheme())
    const off = ctx.on('theme/change', applyGate)
    return () => {
      off()
      mediaSeq += 1
      disposeMedia?.()
      document.body.removeAttribute('data-kimetsu')
    }
  }, 'ui-theme-kimetsu: decoration gate')

  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-theme-kimetsu: row dictionaries')

  const store = createKimetsuRowStore()
  let bound: BoundActions<typeof store> | undefined
  const sync = (snapshot: ThemeSnapshot): void => {
    bound?.sync(snapshot.preference, snapshot.revision)
  }
  ctx.on('theme/change', sync)
  const injected = (actions: BoundActions<typeof store>): KimetsuRowInjected => {
    bound = actions
    // Re-sync from the getter so no event is lost between registration and
    // first render (the store's revision guard drops stale duplicates).
    sync(ctx.theme.getTheme())
    return {
      setTheme: (id) => { ctx.theme.setTheme(id) },
    }
  }
  ctx.slots.inject('settings.general.item', () => ctx.slots.register({
    name: 'settings.general.item',
    id: 'appearance-kimetsu',
    order: 11,
    store,
    locale: NS,
    inject: injected,
  }, KimetsuRow))
}
