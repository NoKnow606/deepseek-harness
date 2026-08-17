/**
 * Kimetsu appearance row registered into the General section item slot,
 * sitting under the built-in Appearance row: a title plus one cube per
 * registered Kimetsu theme. The built-in row only carries the three
 * built-in preferences, so the theme ships its own surface (a feature owns
 * its settings surface). Selection follows the persisted preference, never
 * the resolved active theme.
 */
import clsx from 'clsx'
import type { PropsLocale, PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import { KIMETSU_LIGHT_THEME_ID, KIMETSU_THEME_ID } from '../theme.ts'
import type { KimetsuThemeKey } from './locales.ts'
import type { createKimetsuRowStore } from './settings-store.ts'
import css from './KimetsuRow.module.css'

/** Injected business face: the preference write (t rides the standard locale seat). */
export interface KimetsuRowInjected {
  /** Switch the theme preference to one of the Kimetsu theme ids. */
  setTheme: (id: string) => void
}

/** Full component props: runtime share + store share + locale seat + injected face. */
export type KimetsuRowComponentProps =
  PropsRuntime<'settings.general.item'> & PropsStore<ReturnType<typeof createKimetsuRowStore>>
  & PropsLocale<'settings.theme.kimetsu'> & KimetsuRowInjected

/** Cube order, swatches, and label keys (swatch class names are static CSS module keys). */
const CUBES = [
  // css module classes are Record<string, string> under noUncheckedIndexedAccess;
  // the two swatch keys are static members of this package's stylesheet.
  { id: KIMETSU_THEME_ID, labelKey: 'appearance.kimetsu.dark', swatch: css.swatchDark ?? '' },
  { id: KIMETSU_LIGHT_THEME_ID, labelKey: 'appearance.kimetsu.light', swatch: css.swatchLight ?? '' },
] as const satisfies readonly { id: string; labelKey: KimetsuThemeKey; swatch: string }[]

/**
 * Render the Kimetsu theme row.
 * @param props - composed slot props.
 * @returns the row element tree.
 */
export function KimetsuRow({ t, setTheme, useStore }: KimetsuRowComponentProps) {
  const preference = useStore(s => s.preference)
  return (
    <div className={css.group}>
      <span className={css.crest} />
      <div className={css.title}>{t('appearance.kimetsu')}</div>
      <div className={css.cubeRow}>
        {CUBES.map(({ id, labelKey, swatch }) => (
          <button
            key={id}
            type="button"
            className={clsx(css.cube, preference === id && css.selected)}
            aria-pressed={preference === id}
            onClick={() => { setTheme(id) }}
          >
            <span className={clsx(css.swatch, swatch)} />
            {t(labelKey)}
          </button>
        ))}
      </div>
    </div>
  )
}
