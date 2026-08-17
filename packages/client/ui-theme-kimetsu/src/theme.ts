/**
 * Kimetsu no Yaiba (Demon Slayer) theme definition, Tanjiro direction:
 * ichimatsu-checker deep green + lacquer black surfaces, with his haori's
 * crimson reserved for rare accents and Nezuko's kimono pink as the primary
 * interactive accent (the crimson stays clear of the error-state family so
 * diagnostics never read as decoration).
 *
 * Two palettes are registered as sibling themes:
 * - `kimetsu`      — dark theme: night-patrol blacks, bamboo-green tints.
 * - `kimetsu-light` — light theme: washi-paper whites, sumi-ink text.
 *
 * Both are ALIAS-LAYER overrides (`--dsw-alias-*` / `--dsw-specific-*`)
 * applied by ui-layout's theme presenter as inline variables over the base
 * palette; static color scales stay owned by ui-theme. The override set is
 * intentionally exhaustive for the alias families the base stylesheet
 * declares, so no built-in value leaks through the theme ("露底").
 */

import type { ThemeTokens } from '@deepseek-ai/dsh-client-ui-theme/client'

/** Theme id for the dark (primary) Kimetsu palette. */
export const KIMETSU_THEME_ID = 'kimetsu'
/** Theme id for the light Kimetsu palette. */
export const KIMETSU_LIGHT_THEME_ID = 'kimetsu-light'

/**
 * Dark alias overrides. The base palette behind them is
 * `colorScheme: 'dark'`; anything not listed here keeps the built-in dark
 * value, so state hues are re-grounded to bamboo green and every surface the
 * product surfaces use is re-floored.
 */
const KIMETSU_DARK_TOKENS: ThemeTokens = {
  /* ── surfaces: lacquer blacks with a green cast ── */
  '--dsw-alias-bg-base': 'rgb(9, 13, 11)',
  '--dsw-alias-bg-layer-1': 'rgb(16, 23, 19)',
  '--dsw-alias-bg-layer-2': 'rgb(20, 29, 24)',
  '--dsw-alias-bg-layer-3': 'rgb(26, 37, 31)',
  '--dsw-alias-bg-module-platform': 'rgb(23, 33, 28)',
  '--dsw-alias-bg-multi-select': 'rgb(26, 37, 31)',
  '--dsw-alias-bg-overlay': 'rgb(28, 40, 34)',
  '--dsw-alias-bg-skeleton': 'rgba(116, 169, 138, 0.10)',

  /* ── borders: bamboo green at low alpha ── */
  '--dsw-alias-border-inverted': 'rgba(116, 169, 138, 0.08)',
  '--dsw-alias-border-inverted2': 'rgba(116, 169, 138, 0.10)',
  '--dsw-alias-border-l1': 'rgba(116, 169, 138, 0.10)',
  '--dsw-alias-border-l2-darkmode-thin': 'rgba(116, 169, 138, 0.14)',
  '--dsw-alias-border-l2': 'rgba(116, 169, 138, 0.16)',
  '--dsw-alias-border-l3': 'rgba(116, 169, 138, 0.22)',
  '--dsw-alias-border-l4': 'rgba(116, 169, 138, 0.28)',

  /* ── brand: Nezuko kimono pink (crimson is reserved for rare accents) ── */
  '--dsw-alias-brand-primary': 'rgb(224, 122, 149)',
  '--dsw-alias-brand-primary-invert': 'rgb(12, 18, 15)',
  '--dsw-alias-brand-primary-new-colorprimary-new-color': 'rgb(224, 122, 149)',
  '--dsw-alias-brand-text': 'rgb(224, 122, 149)',

  /* ── buttons ── */
  '--dsw-alias-button-contrast-fill': 'rgb(34, 48, 41)',
  '--dsw-alias-button-elevated-fill': 'rgb(26, 37, 31)',
  '--dsw-alias-button-floating-fill': 'rgb(23, 33, 28)',
  '--dsw-alias-button-floating-hover': 'rgb(28, 40, 34)',
  '--dsw-alias-button-ghost-active-border': 'rgb(69, 122, 94)',
  '--dsw-alias-button-ghost-active-fill': 'rgb(28, 42, 35)',
  '--dsw-alias-button-ghost-active-hover': 'rgb(34, 48, 41)',
  '--dsw-alias-button-info-fill': 'rgb(200, 88, 118)',
  '--dsw-alias-button-info-hover': 'rgb(224, 122, 149)',
  '--dsw-alias-button-primary-dimmed': 'rgb(28, 42, 35)',
  '--dsw-alias-button-primary-fill': 'rgb(200, 88, 118)',
  '--dsw-alias-button-primary-hover': 'rgb(224, 122, 149)',

  /* ── interactive tints ── */
  '--dsw-alias-interactive-bg-active': 'rgba(116, 169, 138, 0.18)',
  '--dsw-alias-interactive-bg-hover-accent': 'rgba(116, 169, 138, 0.24)',
  '--dsw-alias-interactive-bg-hover-danger': 'rgba(242, 90, 90, 0.15)',
  '--dsw-alias-interactive-bg-hover-solid': 'rgb(26, 37, 31)',
  '--dsw-alias-interactive-bg-hover': 'rgba(116, 169, 138, 0.10)',

  /* ── text: parchment on lacquer ── */
  '--dsw-alias-label-caption': 'rgb(110, 130, 118)',
  '--dsw-alias-label-dimmed': 'rgb(69, 94, 79)',
  '--dsw-alias-label-primary-bluish': 'rgb(230, 234, 226)',
  '--dsw-alias-label-primary-dimmed': 'rgb(200, 209, 200)',
  '--dsw-alias-label-primary-foreground': 'rgb(12, 18, 15)',
  '--dsw-alias-label-primary-inverted': 'rgb(23, 33, 28)',
  '--dsw-alias-label-primary': 'rgb(230, 234, 226)',
  '--dsw-alias-label-secondary': 'rgb(171, 184, 172)',
  '--dsw-alias-label-tertiary': 'rgb(140, 156, 142)',

  /* ── markdown surfaces ── */
  '--dsw-alias-markdown-citation': 'rgb(26, 37, 31)',
  '--dsw-alias-markdown-code-block-banner': 'rgb(20, 29, 24)',
  '--dsw-alias-markdown-code-block': 'rgb(16, 23, 19)',
  '--dsw-alias-markdown-code-segment-selected': 'rgb(26, 37, 31)',
  '--dsw-alias-markdown-code-segment-unselected': 'rgb(16, 23, 19)',
  '--dsw-alias-markdown-inline-code': 'rgb(23, 33, 28)',
  '--dsw-alias-markdown-placeholder': 'rgb(23, 33, 28)',
  '--dsw-alias-markdown-tag': 'rgb(23, 33, 28)',

  /* ── scrollbars ── */
  '--dsw-alias-scrollbar-bg-l1': 'rgb(41, 58, 48)',
  '--dsw-alias-scrollbar-bg-l2': 'rgb(41, 58, 48)',
  '--dsw-alias-scrollbar-hover-l1': 'rgb(53, 74, 62)',
  '--dsw-alias-scrollbar-hover-l2': 'rgb(53, 74, 62)',

  /* ── state: success re-grounded to bamboo green; error stays diagnostic red ── */
  '--dsw-alias-state-business-primary': 'rgb(224, 122, 149)',
  '--dsw-alias-state-business-tertiary': 'rgb(52, 32, 40)',
  '--dsw-alias-state-error-primary': 'rgb(242, 90, 90)',
  '--dsw-alias-state-error-secondary': 'rgb(242, 90, 90)',
  '--dsw-alias-state-success-primary': 'rgb(82, 183, 136)',
  '--dsw-alias-state-success-secondary': 'rgb(116, 169, 138)',
  '--dsw-alias-state-success-tertiary': 'rgb(24, 43, 33)',
  '--dsw-alias-state-warn-label': 'rgb(221, 134, 41)',
  '--dsw-alias-state-warn-primary': 'rgb(245, 158, 11)',
  '--dsw-alias-state-warn-secondary': 'rgb(247, 173, 49)',
  '--dsw-alias-state-warn-tertiary': 'rgb(39, 36, 31)',

  /* ── floating surfaces ── */
  '--dsw-alias-toast-bg': 'rgb(28, 42, 35)',
  '--dsw-alias-tooltip-bg': 'rgb(28, 42, 35)',

  /* ── feature-specific seats ── */
  '--dsw-specific-bubble-highlight': 'rgb(32, 46, 39)',
  '--dsw-specific-bubble': 'rgb(20, 29, 24)',
  '--dsw-specific-input-major': 'rgb(16, 23, 19)',
  '--dsw-specific-login-input': 'rgb(16, 23, 19)',
  '--dsw-specific-menu': 'rgb(26, 37, 31)',
  '--dsw-specific-selector': 'rgb(23, 33, 28)',
  '--dsw-specific-sidebar-fill': 'rgb(11, 16, 13)',
  '--dsw-specific-sidebar-nav-item-active-accent': 'rgb(52, 32, 40)',
  '--dsw-specific-sidebar-nav-item-active': 'rgb(28, 42, 35)',
  '--dsw-specific-sidebar-nav-item-hover': 'rgb(20, 29, 24)',
  '--dsw-specific-tip': 'rgb(23, 33, 28)',
}

/**
 * Light alias overrides over the `colorScheme: 'light'` base: washi-paper
 * surfaces, sumi-ink text, deep ichimatsu green structure, and the same
 * Nezuko pink accent deepened enough to stay legible on paper.
 */
const KIMETSU_LIGHT_TOKENS: ThemeTokens = {
  /* ── surfaces: washi paper ── */
  '--dsw-alias-bg-base': 'rgb(246, 243, 234)',
  '--dsw-alias-bg-layer-1': 'rgb(246, 243, 234)',
  '--dsw-alias-bg-layer-2': 'rgb(250, 248, 241)',
  '--dsw-alias-bg-layer-3': 'rgb(255, 255, 255)',
  '--dsw-alias-bg-module-platform': 'rgb(237, 235, 224)',
  '--dsw-alias-bg-multi-select': 'rgb(237, 235, 224)',
  '--dsw-alias-bg-overlay': 'rgb(228, 228, 216)',
  '--dsw-alias-bg-skeleton': 'rgba(26, 58, 46, 0.06)',

  /* ── borders: sumi ink at low alpha ── */
  '--dsw-alias-border-inverted': 'rgba(26, 26, 26, 0)',
  '--dsw-alias-border-inverted2': 'rgba(26, 26, 26, 0)',
  '--dsw-alias-border-l1': 'rgba(26, 58, 46, 0.08)',
  '--dsw-alias-border-l2-darkmode-thin': 'rgba(26, 58, 46, 0.14)',
  '--dsw-alias-border-l2': 'rgba(26, 58, 46, 0.14)',
  '--dsw-alias-border-l3': 'rgba(26, 58, 46, 0.18)',
  '--dsw-alias-border-l4': 'rgba(26, 58, 46, 0.24)',

  /* ── brand: deepened Nezuko pink, ink as its foreground ── */
  '--dsw-alias-brand-primary': 'rgb(178, 62, 92)',
  '--dsw-alias-brand-primary-invert': 'rgb(255, 255, 255)',
  '--dsw-alias-brand-primary-new-colorprimary-new-color': 'rgb(178, 62, 92)',
  '--dsw-alias-brand-text': 'rgb(178, 62, 92)',

  /* ── buttons ── */
  '--dsw-alias-button-contrast-fill': 'rgb(45, 74, 59)',
  '--dsw-alias-button-elevated-fill': 'rgb(255, 255, 255)',
  '--dsw-alias-button-floating-fill': 'rgb(255, 255, 255)',
  '--dsw-alias-button-floating-hover': 'rgb(240, 238, 228)',
  '--dsw-alias-button-ghost-active-border': 'rgb(69, 122, 94)',
  '--dsw-alias-button-ghost-active-fill': 'rgb(228, 237, 230)',
  '--dsw-alias-button-ghost-active-hover': 'rgb(218, 230, 222)',
  '--dsw-alias-button-info-fill': 'rgb(178, 62, 92)',
  '--dsw-alias-button-info-hover': 'rgb(158, 48, 78)',
  '--dsw-alias-button-primary-dimmed': 'rgb(228, 237, 230)',
  '--dsw-alias-button-primary-fill': 'rgb(178, 62, 92)',
  '--dsw-alias-button-primary-hover': 'rgb(158, 48, 78)',

  /* ── interactive tints ── */
  '--dsw-alias-interactive-bg-active': 'rgba(26, 58, 46, 0.10)',
  '--dsw-alias-interactive-bg-hover-accent': 'rgba(26, 58, 46, 0.14)',
  '--dsw-alias-interactive-bg-hover-danger': 'rgba(236, 19, 19, 0.05)',
  '--dsw-alias-interactive-bg-hover-solid': 'rgb(240, 238, 228)',
  '--dsw-alias-interactive-bg-hover': 'rgba(26, 58, 46, 0.06)',

  /* ── text: sumi ink on paper ── */
  '--dsw-alias-label-caption': 'rgb(140, 150, 140)',
  '--dsw-alias-label-dimmed': 'rgb(207, 211, 204)',
  '--dsw-alias-label-primary-bluish': 'rgb(24, 43, 35)',
  '--dsw-alias-label-primary-dimmed': 'rgb(41, 56, 48)',
  '--dsw-alias-label-primary-foreground': 'rgb(255, 255, 255)',
  '--dsw-alias-label-primary-inverted': 'rgb(255, 255, 255)',
  '--dsw-alias-label-primary': 'rgb(24, 28, 25)',
  '--dsw-alias-label-secondary': 'rgb(53, 66, 58)',
  '--dsw-alias-label-tertiary': 'rgb(97, 108, 99)',

  /* ── markdown surfaces ── */
  '--dsw-alias-markdown-citation': 'rgb(228, 237, 230)',
  '--dsw-alias-markdown-code-block-banner': 'rgb(240, 238, 228)',
  '--dsw-alias-markdown-code-block': 'rgb(240, 238, 228)',
  '--dsw-alias-markdown-code-segment-selected': 'rgb(255, 255, 255)',
  '--dsw-alias-markdown-code-segment-unselected': 'rgb(237, 235, 224)',
  '--dsw-alias-markdown-inline-code': 'rgb(228, 237, 230)',
  '--dsw-alias-markdown-placeholder': 'rgb(237, 235, 224)',
  '--dsw-alias-markdown-tag': 'rgb(237, 235, 224)',

  /* ── scrollbars ── */
  '--dsw-alias-scrollbar-bg-l1': 'rgb(200, 205, 196)',
  '--dsw-alias-scrollbar-bg-l2': 'rgb(200, 205, 196)',
  '--dsw-alias-scrollbar-hover-l1': 'rgb(171, 184, 172)',
  '--dsw-alias-scrollbar-hover-l2': 'rgb(171, 184, 172)',

  /* ── state ── */
  '--dsw-alias-state-business-primary': 'rgb(178, 62, 92)',
  '--dsw-alias-state-business-tertiary': 'rgb(245, 215, 224)',
  '--dsw-alias-state-error-primary': 'rgb(236, 19, 19)',
  '--dsw-alias-state-error-secondary': 'rgb(242, 90, 90)',
  '--dsw-alias-state-success-primary': 'rgb(34, 130, 90)',
  '--dsw-alias-state-success-secondary': 'rgb(69, 122, 94)',
  '--dsw-alias-state-success-tertiary': 'rgb(222, 240, 228)',
  '--dsw-alias-state-warn-label': 'rgb(221, 134, 41)',
  '--dsw-alias-state-warn-primary': 'rgb(245, 158, 11)',
  '--dsw-alias-state-warn-secondary': 'rgb(247, 173, 49)',
  '--dsw-alias-state-warn-tertiary': 'rgb(254, 245, 231)',

  /* ── floating surfaces ── */
  '--dsw-alias-toast-bg': 'rgb(45, 74, 59)',
  '--dsw-alias-tooltip-bg': 'rgb(45, 74, 59)',

  /* ── feature-specific seats ── */
  '--dsw-specific-bubble-highlight': 'rgb(222, 240, 228)',
  '--dsw-specific-bubble': 'rgb(237, 242, 236)',
  '--dsw-specific-input-major': 'rgb(255, 255, 255)',
  '--dsw-specific-login-input': 'rgb(250, 248, 241)',
  '--dsw-specific-menu': 'rgb(255, 255, 255)',
  '--dsw-specific-selector': 'rgb(237, 235, 224)',
  '--dsw-specific-sidebar-fill': 'rgb(240, 238, 228)',
  '--dsw-specific-sidebar-nav-item-active-accent': 'rgb(245, 215, 224)',
  '--dsw-specific-sidebar-nav-item-active': 'rgb(228, 237, 230)',
  '--dsw-specific-sidebar-nav-item-hover': 'rgb(234, 232, 222)',
  '--dsw-specific-tip': 'rgb(237, 235, 224)',
}

/** The two registered Kimetsu themes, dark first (the flagship). */
export const KIMETSU_THEMES = [
  { id: KIMETSU_THEME_ID, colorScheme: 'dark' as const, tokens: KIMETSU_DARK_TOKENS },
  { id: KIMETSU_LIGHT_THEME_ID, colorScheme: 'light' as const, tokens: KIMETSU_LIGHT_TOKENS },
]
