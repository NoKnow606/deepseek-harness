/**
 * Ambient media mount: user-supplied artwork living in apps/web/public/kimetsu/
 * (served as /kimetsu/* after `pnpm run build:web`). While a Kimetsu palette
 * is active, the first reachable candidate is mounted as a fullscreen
 * legibility-tuned layer covering the whole conversation column (artwork
 * focal right, chat floats over it). Nothing is bundled: the plugin probes
 * URLs at runtime and mounts only what actually serves with a media
 * content-type (the SPA fallback answers unknown paths with index.html and
 * a 200, so the content-type check is the real existence test).
 *
 * Supported files (first match wins, per palette mode):
 *   video: /kimetsu/ambient-dark.mp4, /kimetsu/ambient.mp4   (muted loop)
 *   image: /kimetsu/hero-dark.png|jpg, /kimetsu/hero.png|jpg (still frame)
 */

/** Media candidates per palette mode, in probe order. */
const VIDEO_CANDIDATES: Record<'dark' | 'light', readonly string[]> = {
  dark: ['/kimetsu/ambient-dark.mp4', '/kimetsu/ambient.mp4'],
  light: ['/kimetsu/ambient-light.mp4', '/kimetsu/ambient.mp4'],
}

const IMAGE_CANDIDATES: Record<'dark' | 'light', readonly string[]> = {
  // Wide scene art (focal character at the artwork's LEFT) fills the whole
  // app window; the sidebar region is covered by the scene's own dark
  // background so it blends. bg-*-fullscreen files are the user's current
  // hero art (1672×941); hero-* are fallbacks.
  dark: ['/kimetsu/bg-dark-fullscreen.png', '/kimetsu/hero-dark.png', '/kimetsu/hero-dark.jpg', '/kimetsu/hero.png', '/kimetsu/hero.jpg'],
  light: ['/kimetsu/bg-light-fullscreen.png', '/kimetsu/hero-light.png', '/kimetsu/hero-light.jpg', '/kimetsu/hero.png', '/kimetsu/hero.jpg'],
}

/**
 * The whole app viewport: the layout's root column (a direct <body> child
 * containing both sidebar and conversation). Falls back to the conversation
 * column, then <body>, so the scene always lands somewhere sane.
 */
const COLUMN_SELECTOR = 'div:has(> [data-slot="conversation"])'

/**
 * The stage the scene fills: the layout frame that wraps BOTH the sidebar
 * column and the conversation column (the `…_frame` div spanning the whole
 * viewport). Walk ancestors and pick the nearest one that contains both
 * slots AND spans the full window width — position:static ancestors count
 * too (we set the position ourselves when mounting). Falls back to the
 * conversation column itself.
 */
function resolveStage(column: HTMLElement): HTMLElement {
  let n: HTMLElement | null = column.parentElement
  while (n && n !== document.body) {
    const r = n.getBoundingClientRect()
    const spansWindow = r.left <= 1 && r.width >= window.innerWidth - 2
    const hasBoth = n.querySelector('[data-slot="sidebar"]') !== null
      && n.querySelector('[data-slot="conversation"]') !== null
    if (spansWindow && hasBoth) return n
    n = n.parentElement
  }
  return column
}

/**
 * Wait for the conversation column to enter the DOM (the theme plugin's
 * apply runs before the layout paints). Resolves undefined after timeout.
 * @param timeoutMs - observation cap.
 * @returns the column element once present.
 */
function waitForColumn(timeoutMs = 8000): Promise<HTMLElement | undefined> {
  const existing = document.querySelector(COLUMN_SELECTOR)
  if (existing instanceof HTMLElement) return Promise.resolve(existing)
  return new Promise((resolve) => {
    const timer = setTimeout(() => { observer.disconnect(); resolve(undefined) }, timeoutMs)
    const observer = new MutationObserver(() => {
      const el = document.querySelector(COLUMN_SELECTOR)
      if (el instanceof HTMLElement) {
        clearTimeout(timer)
        observer.disconnect()
        resolve(el)
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })
  })
}

/**
 * Full-window visual treatment: fill the whole app viewport (sidebar +
 * conversation) so the artwork is the entire scene. The character lives at
 * the artwork's LEFT (Tanjiro / Nezuko), so `objectPosition: '12% center'`
 * keeps the focal visible even on wide windows; the right side is the
 * quieter dialogue zone. The chat + sidebar scroll above it (z-index raised
 * by decorations.module.css). Slightly softened per-mode so text stays
 * legible.
 */
const LAYER_STYLE: Record<'dark' | 'light', Partial<CSSStyleDeclaration>> = {
  dark: {
    position: 'absolute',
    inset: '0',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'left center',
    opacity: '0.9',
    pointerEvents: 'none',
    zIndex: '0',
  },
  light: {
    position: 'absolute',
    inset: '0',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'left center',
    opacity: '0.82',
    pointerEvents: 'none',
    zIndex: '0',
  },
}

/**
 * Probe one URL; reachable means the SPA fallback did NOT answer (the
 * fallback 200s unknown paths with text/html, while the static file server
 * answers real files with application/octet-stream regardless of extension —
 * the candidate lists already split media kinds, so the element type comes
 * from the list, not the header).
 * @param url - candidate URL.
 * @returns the URL when it serves a real file.
 */
async function probe(url: string): Promise<string | undefined> {
  try {
    const res = await fetch(url, { method: 'HEAD' })
    const type = res.headers.get('content-type') ?? ''
    if (res.ok && !type.startsWith('text/html')) return url
  } catch { /* network absence reads as absence */ }
  return undefined
}

/** First candidate serving a real file, in order. */
async function firstReachable(urls: readonly string[]): Promise<string | undefined> {
  for (const url of urls) {
    const hit = await probe(url)
    if (hit !== undefined) return hit
  }
  return undefined
}

/**
 * Mount the ambient layer for one palette mode into the conversation column.
 * @param mode - active Kimetsu palette.
 * @returns disposer removing the layer and restoring the column's position.
 */
export async function mountAmbientMedia(mode: 'dark' | 'light'): Promise<() => void> {
  const column = await waitForColumn()
  if (column === undefined) return () => {}
  const stage = resolveStage(column)

  const videoUrl = await firstReachable(VIDEO_CANDIDATES[mode])
  const imageUrl = videoUrl === undefined
    ? await firstReachable(IMAGE_CANDIDATES[mode])
    : undefined
  if (videoUrl === undefined && imageUrl === undefined) return () => {}

  // The probe raced ahead of a possible theme switch; re-check the column is
  // still ours to decorate before touching the DOM.
  if (!document.body.hasAttribute('data-kimetsu')) return () => {}

  let el: HTMLElement
  if (videoUrl !== undefined) {
    const video = document.createElement('video')
    video.muted = true
    video.loop = true
    video.autoplay = true
    video.playsInline = true
    video.src = videoUrl
    el = video
  } else {
    const img = document.createElement('img')
    img.alt = ''
    img.src = imageUrl ?? ''
    el = img
  }
  el.dataset.kimetsuMedia = 'ambient'
  Object.assign(el.style, LAYER_STYLE[mode])

  // Fill the stage; stage must not clip nothing but should clip our layer.
  const previousPosition = stage.style.position
  const previousOverflow = stage.style.overflow
  if (getComputedStyle(stage).position === 'static') stage.style.position = 'relative'
  stage.style.overflow = 'hidden'
  // First child: the scene paints under all existing content even in a flat
  // stacking context (auto z-index elements stack by DOM order).
  stage.prepend(el)

  return () => {
    el.remove()
    stage.style.position = previousPosition
    stage.style.overflow = previousOverflow
  }
}
