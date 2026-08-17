/**
 * The pet's DOM layer: one fixed-position mount holding the Nezuko figure and
 * its fx spans. Artwork comes in two modes:
 *
 *   sprite — the user-supplied sheet (/pet/spritesheet.webp, 4×3 frames of
 *            384×624, row-major: chibi Nezuko working on her laptop). Probed
 *            at mount; when reachable it becomes the figure and a per-state
 *            ticker steps the frames (furious typing while agents run, drowsy
 *            crawl while idle). Frame order is an assumption — adjust
 *            FRAME_COUNT/FRAME_COLS here if the sheet changes.
 *   svg    — the hand-drawn fallback (nezuko.ts), used when the sheet 404s.
 *
 * The carrying box (her error/manual hideaway) is SVG in BOTH modes — the
 * sheet has no box pose. This layer owns pointer interaction (drag with
 * viewport clamping, click-to-pat, right-click box toggle) and localStorage
 * persistence; state DERIVATION lives in index.ts.
 */
import { nezukoSvg } from './nezuko.ts'

/** Pet states driven from the sessions feed + error watch + manual boxing. */
export type PetState = 'sleep' | 'run' | 'dance' | 'alert' | 'box'

const POSITION_KEY = 'dsh.ui-pet-nezuko.position'
const BOXED_KEY = 'dsh.ui-pet-nezuko.boxed'
const SIZE = { w: 120, h: 195 }
const MARGIN = 6

/** Sprite sheet geometry: 4×3 frames of 384×624, displayed at 120×195 each. */
const SPRITE_URL = '/pet/spritesheet.webp'
const FRAME_COUNT = 12
const FRAME_COLS = 4
/** ms per frame per state; 0 freezes on STATE_STILL_FRAME instead. */
const STATE_FRAME_MS: Record<PetState, number> = {
  sleep: 720,
  run: 130,
  dance: 190,
  alert: 0,
  box: 0,
}
const STATE_STILL_FRAME: Partial<Record<PetState, number>> = { alert: 4, box: 0 }

/** Default anchor: bottom-right, just above the composer bar. */
function defaultPosition(): { x: number; y: number } {
  return { x: window.innerWidth - SIZE.w - 28, y: window.innerHeight - SIZE.h - 96 }
}

function readPosition(): { x: number; y: number } {
  try {
    const raw = localStorage.getItem(POSITION_KEY)
    if (raw !== null) {
      const parsed = JSON.parse(raw) as { x?: unknown; y?: unknown }
      if (typeof parsed.x === 'number' && typeof parsed.y === 'number') return clamp(parsed.x, parsed.y)
    }
  } catch { /* storage failure falls back to the default anchor */ }
  return defaultPosition()
}

function writePosition(x: number, y: number): void {
  try { localStorage.setItem(POSITION_KEY, JSON.stringify({ x, y })) } catch { /* session-only position */ }
}

/** Keep the whole figure inside the viewport with a small margin. */
function clamp(x: number, y: number): { x: number; y: number } {
  return {
    x: Math.min(Math.max(MARGIN, x), Math.max(MARGIN, window.innerWidth - SIZE.w - MARGIN)),
    y: Math.min(Math.max(MARGIN, y), Math.max(MARGIN, window.innerHeight - SIZE.h - MARGIN)),
  }
}

/** Read the persisted manual-box flag. */
export function readBoxed(): boolean {
  try { return localStorage.getItem(BOXED_KEY) === '1' } catch { return false }
}

/** Persist the manual-box flag. Never throws. */
export function writeBoxed(boxed: boolean): void {
  try { localStorage.setItem(BOXED_KEY, boxed ? '1' : '0') } catch { /* session-only preference */ }
}

/** Probe the sprite sheet by preloading it; resolves true when it decodes. */
function probeSprite(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => { resolve(true) }
    img.onerror = () => { resolve(false) }
    img.src = url
  })
}

let uidCounter = 0

/**
 * Mount the pet into document.body.
 * @param onToggleBox - right-click handler (the engine flips the manual-box flag).
 * @returns the pet face plus a disposer removing every listener and the node.
 */
export function mountPet(onToggleBox: () => void): { setState(state: PetState): void; dispose(): void } {
  uidCounter += 1
  let state: PetState = 'sleep'
  let art: 'svg' | 'sprite' = 'svg'
  let frame = 0
  let frameTimer: number | undefined

  const root = document.createElement('div')
  root.setAttribute('data-nezuko-pet', '')
  root.dataset.state = state
  root.style.setProperty('--nz-sheet', `url("${SPRITE_URL}")`)

  const figure = document.createElement('div')
  figure.className = 'nz-figure'
  figure.setAttribute('role', 'img')
  figure.setAttribute('aria-label', '灶门祢豆子')
  figure.title = '祢豆子（左键摸头，右键收回箱子）'
  figure.innerHTML = nezukoSvg(`nz${uidCounter}`)
    + '<div class="nz-fx nz-fx-zzz"><span>z</span><span>z</span><span>z</span></div>'
    + '<div class="nz-fx nz-fx-notes"><span>♪</span><span>♫</span></div>'
    + '<div class="nz-fx nz-fx-bang"><span>!</span></div>'
  const svg = figure.querySelector('svg')
  if (svg !== null) {
    // Bottom-anchor the fallback figure in the taller sprite-sized mount.
    svg.setAttribute('width', String(SIZE.w))
    svg.setAttribute('height', String(SIZE.h))
    svg.setAttribute('preserveAspectRatio', 'xMidYMax meet')
  }
  const sprite = document.createElement('div')
  sprite.className = 'nz-sprite'
  figure.append(sprite)
  root.append(figure)

  const pos = readPosition()
  root.style.left = `${pos.x}px`
  root.style.top = `${pos.y}px`

  /** Paint the current sprite frame (no-op in svg mode). */
  const paintFrame = (): void => {
    const x = -(frame % FRAME_COLS) * SIZE.w
    const y = -Math.floor(frame / FRAME_COLS) * SIZE.h
    sprite.style.backgroundPosition = `${x}px ${y}px`
  }

  /** (Re)arm the frame ticker for the current state; frozen states pin a still. */
  const armTicker = (): void => {
    window.clearInterval(frameTimer)
    frameTimer = undefined
    if (art !== 'sprite') return
    const ms = STATE_FRAME_MS[state]
    if (ms === 0) {
      frame = STATE_STILL_FRAME[state] ?? 0
      paintFrame()
      return
    }
    frameTimer = window.setInterval(() => {
      frame = (frame + 1) % FRAME_COUNT
      paintFrame()
    }, ms)
  }

  /* Sprite probe: upgrade to sheet art when it decodes; svg stays otherwise. */
  void probeSprite(SPRITE_URL).then((ok) => {
    if (!ok || !root.isConnected) return
    art = 'sprite'
    root.dataset.art = 'sprite'
    frame = 0
    paintFrame()
    armTicker()
  })

  /* ── drag + click ── */
  let dragStart: { px: number; py: number; x: number; y: number } | undefined
  let dragging = false

  const onPointerDown = (event: PointerEvent): void => {
    if (event.button !== 0) return
    figure.setPointerCapture(event.pointerId)
    dragStart = { px: event.clientX, py: event.clientY, x: root.offsetLeft, y: root.offsetTop }
    dragging = false
    event.preventDefault()
  }
  const onPointerMove = (event: PointerEvent): void => {
    if (dragStart === undefined || !figure.hasPointerCapture(event.pointerId)) return
    const dx = event.clientX - dragStart.px
    const dy = event.clientY - dragStart.py
    if (!dragging && Math.hypot(dx, dy) < 6) return
    dragging = true
    root.setAttribute('data-dragging', '')
    const next = clamp(dragStart.x + dx, dragStart.y + dy)
    root.style.left = `${next.x}px`
    root.style.top = `${next.y}px`
  }
  const onPointerUp = (event: PointerEvent): void => {
    if (dragStart === undefined) return
    if (figure.hasPointerCapture(event.pointerId)) figure.releasePointerCapture(event.pointerId)
    if (dragging) {
      writePosition(root.offsetLeft, root.offsetTop)
    } else {
      pat()
    }
    dragging = false
    dragStart = undefined
    root.removeAttribute('data-dragging')
  }
  const onContextMenu = (event: MouseEvent): void => {
    event.preventDefault()
    onToggleBox()
  }
  const onResize = (): void => {
    const next = clamp(root.offsetLeft, root.offsetTop)
    root.style.left = `${next.x}px`
    root.style.top = `${next.y}px`
  }

  figure.addEventListener('pointerdown', onPointerDown)
  figure.addEventListener('pointermove', onPointerMove)
  figure.addEventListener('pointerup', onPointerUp)
  figure.addEventListener('contextmenu', onContextMenu)
  window.addEventListener('resize', onResize)

  /* ── click reaction: bounce + a small heart burst ── */
  let reactTimer: number | undefined
  function pat(): void {
    root.setAttribute('data-react', '')
    window.clearTimeout(reactTimer)
    reactTimer = window.setTimeout(() => { root.removeAttribute('data-react') }, 680)
    for (let i = 0; i < 3; i += 1) {
      const heart = document.createElement('span')
      heart.className = 'nz-heart'
      heart.textContent = '♥'
      heart.style.setProperty('--hx', `${(i - 1) * 18}px`)
      heart.style.animationDelay = `${i * 90}ms`
      heart.addEventListener('animationend', () => { heart.remove() }, { once: true })
      figure.append(heart)
    }
  }

  document.body.append(root)

  return {
    setState(next: PetState): void {
      if (next === state) return
      state = next
      root.dataset.state = state
      armTicker()
    },
    dispose(): void {
      window.clearTimeout(reactTimer)
      window.clearInterval(frameTimer)
      figure.removeEventListener('pointerdown', onPointerDown)
      figure.removeEventListener('pointermove', onPointerMove)
      figure.removeEventListener('pointerup', onPointerUp)
      figure.removeEventListener('contextmenu', onContextMenu)
      window.removeEventListener('resize', onResize)
      root.remove()
    },
  }
}
