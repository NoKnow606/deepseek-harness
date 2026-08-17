/** `settings.theme.kimetsu` namespace dictionaries (the Kimetsu appearance row's copy). */

/** Dictionary namespace owned by this plugin. */
export const NS = 'settings.theme.kimetsu'

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  'appearance.kimetsu': '鬼灭之刃',
  'appearance.kimetsu.dark': '鬼灭之刃（深色）',
  'appearance.kimetsu.light': '鬼灭之刃・和纸（浅色）',
} satisfies Record<string, string>

/** The settings.theme.kimetsu namespace key union. */
export type KimetsuThemeKey = keyof typeof zh

/** English dictionary, checked complete against the zh key set. */
export const en = {
  'appearance.kimetsu': 'Demon Slayer',
  'appearance.kimetsu.dark': 'Demon Slayer (Dark)',
  'appearance.kimetsu.light': 'Demon Slayer · Washi (Light)',
} satisfies Record<KimetsuThemeKey, string>

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** The Kimetsu appearance row's copy. */
    'settings.theme.kimetsu': KimetsuThemeKey
  }
}
