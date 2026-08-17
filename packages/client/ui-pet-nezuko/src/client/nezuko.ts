/**
 * Chibi Kamado Nezuko, one inline SVG with per-state sub-groups. The pet
 * container's `data-state` attribute (pet.module.css) decides which eyes,
 * brows, flame and box paint: the markup itself never changes, so state
 * swaps are pure CSS visibility/animation transitions.
 *
 * Anatomy (viewBox 0 0 120 140, ground ≈ y130): hair mass behind, pink
 * asanoha kimono with checkered obijime, big head with her fringe and side
 * locks, pink eyes, bamboo muzzle on its red string. `.box` is her carrying
 * box with a peeking gap; `.flame` is the Blood Demon Art flare.
 */

/** The full SVG markup for one pet instance (ids are per-instance suffixed). */
export function nezukoSvg(uid: string): string {
  return `
<svg viewBox="0 0 120 140" width="120" height="140" aria-hidden="true">
  <defs>
    <linearGradient id="${uid}-hair" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2e2320"/>
      <stop offset="0.68" stop-color="#2e2320"/>
      <stop offset="1" stop-color="#b5462e"/>
    </linearGradient>
    <linearGradient id="${uid}-flame" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="#e0487c"/>
      <stop offset="0.55" stop-color="#ff7aa8"/>
      <stop offset="1" stop-color="#ffd3e0"/>
    </linearGradient>
  </defs>

  <ellipse class="nz-shadow" cx="60" cy="131" rx="26" ry="5.5"/>

  <!-- ══ Nezuko ══ -->
  <g class="nz-nez">
    <path class="nz-hairback" d="M32,50 C26,84 28,112 36,124 C42,130 50,132 60,132 C70,132 78,130 84,124 C92,112 94,84 88,50 Z" fill="url(#${uid}-hair)"/>

    <g class="nz-feet">
      <ellipse cx="51" cy="126" rx="4" ry="2.4"/>
      <ellipse cx="69" cy="126" rx="4" ry="2.4"/>
    </g>

    <g class="nz-body">
      <path d="M44,84 C39,96 37,110 39,124 L81,124 C83,110 81,96 76,84 C69,79 51,79 44,84 Z" fill="#f4a6ba"/>
      <path d="M45,95 L77,89 M43,107 L79,101 M44,119 L78,113" stroke="rgba(255,255,255,0.38)" stroke-width="1.4" fill="none"/>
      <path d="M52,82 L60,93 L68,82" fill="none" stroke="#fdeef2" stroke-width="3.4" stroke-linecap="round"/>
      <rect x="41" y="100" width="38" height="9" rx="2" fill="#3a2b30"/>
      <rect x="41" y="103.6" width="38" height="2.6" fill="#c8434f"/>
      <path d="M47,103.6 v2.6 M56,103.6 v2.6 M65,103.6 v2.6 M74,103.6 v2.6" stroke="#f6e8e6" stroke-width="2.4"/>
    </g>

    <g class="nz-arm-l">
      <path d="M44,86 C38,90 35,97 37,103 L45,101 C44,96 45,91 47,88 Z" fill="#f4a6ba"/>
      <circle cx="40" cy="103" r="2.8" fill="#ffe9de"/>
    </g>
    <g class="nz-arm-r">
      <path d="M76,86 C82,90 85,97 83,103 L75,101 C76,96 75,91 73,88 Z" fill="#f4a6ba"/>
      <circle cx="80" cy="103" r="2.8" fill="#ffe9de"/>
    </g>

    <g class="nz-flame">
      <path d="M84,78 C92,72 96,62 94,52 C99,60 104,68 102,78 C106,74 108,68 108,64 C112,74 108,86 100,92 C94,97 86,96 82,90 C86,88 88,84 84,78 Z" fill="url(#${uid}-flame)" opacity="0.9"/>
      <path d="M92,80 C96,76 98,70 97,64 C101,70 102,78 98,84 C95,88 90,87 88,84 C90,83 91,82 92,80 Z" fill="#fff0f5" opacity="0.85"/>
    </g>

    <g class="nz-head">
      <circle cx="60" cy="52" r="25" fill="#ffe9de"/>
      <path d="M35,50 C36,36 46,26 60,26 C74,26 84,36 85,50 C82,45 79,43 77,44 C76,38 71,35 68,37 C66,32 62,31 60,32 C58,31 54,32 52,37 C49,35 44,38 43,44 C41,43 38,45 35,50 Z" fill="#2e2320"/>
      <path d="M36,48 C32,62 33,78 38,88 C40,90 43,89 43,86 C40,74 40,60 42,50 Z" fill="url(#${uid}-hair)"/>
      <path d="M84,48 C88,62 87,78 82,88 C80,90 77,89 77,86 C80,74 80,60 78,50 Z" fill="url(#${uid}-hair)"/>

      <path class="nz-brow-open" d="M44,43 Q50,41 55,43 M65,43 Q70,41 76,43" fill="none"/>
      <path class="nz-brow-det" d="M43,42 L55,45 M77,42 L65,45" fill="none"/>

      <g class="nz-eyes-open">
        <ellipse cx="50" cy="55" rx="4.6" ry="6.2" fill="#d6336c"/>
        <ellipse cx="70" cy="55" rx="4.6" ry="6.2" fill="#d6336c"/>
        <ellipse cx="50" cy="56.8" rx="2.6" ry="3.4" fill="#a02150"/>
        <ellipse cx="70" cy="56.8" rx="2.6" ry="3.4" fill="#a02150"/>
        <circle cx="48.4" cy="52.6" r="1.7" fill="#ffffff"/>
        <circle cx="68.4" cy="52.6" r="1.7" fill="#ffffff"/>
      </g>
      <path class="nz-eyes-closed" d="M45,55 Q50,59 55,55 M65,55 Q70,59 75,55" fill="none"/>
      <path class="nz-eyes-happy" d="M45,53 Q50,58 55,53 M65,53 Q70,58 75,53" fill="none"/>

      <ellipse class="nz-blush" cx="42" cy="63" rx="4.4" ry="2.3"/>
      <ellipse class="nz-blush" cx="78" cy="63" rx="4.4" ry="2.3"/>

      <g class="nz-bamboo">
        <path d="M47,68 C39,65 34,60 32,53 M73,68 C81,65 86,60 88,53" fill="none"/>
        <rect x="47" y="64" width="26" height="7.5" rx="3.75" fill="#7fae62"/>
        <path d="M54,64.4 v6.7 M66,64.4 v6.7" fill="none"/>
      </g>
    </g>
  </g>

  <!-- ══ her carrying box (boxed state) ══ -->
  <g class="nz-box">
    <path d="M48,80 Q60,72 72,80" fill="none"/>
    <rect x="30" y="88" width="60" height="40" rx="4" fill="#8a5a3c"/>
    <rect x="30" y="88" width="60" height="40" rx="4" fill="none"/>
    <rect x="42" y="88" width="6" height="40" fill="#6b422a" opacity="0.55"/>
    <rect x="72" y="88" width="6" height="40" fill="#6b422a" opacity="0.55"/>
    <rect x="34" y="90" width="52" height="7" rx="3" fill="#241a17"/>
    <g class="nz-box-eyes">
      <ellipse cx="52" cy="93.5" rx="3.2" ry="3.8" fill="#d6336c"/>
      <ellipse cx="68" cy="93.5" rx="3.2" ry="3.8" fill="#d6336c"/>
      <circle cx="51" cy="92" r="1" fill="#ffffff"/>
      <circle cx="67" cy="92" r="1" fill="#ffffff"/>
    </g>
    <rect x="26" y="80" width="68" height="10" rx="4" fill="#9c6a48"/>
    <rect x="26" y="80" width="68" height="10" rx="4" fill="none"/>
  </g>
</svg>`
}
