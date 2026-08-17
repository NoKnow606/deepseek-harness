/**
 * Kimetsu appearance row slot store: mirrors the persisted theme preference
 * out of the theme snapshot so the cube row can mark its own themes selected.
 * The plugin's apply-world change listener is the only writer; the row
 * component reads via props.useStore.
 */
import { defineStore, type EngineStoreHandle } from '@deepseek-ai/dsh-client-runtime/client'

/** Store state mirrored from the theme snapshot. */
export interface KimetsuRowState {
  /** Persisted preference (selection state reads this, never the resolved active theme). */
  preference: string
  /** Service revision; -1 until first sync so revision 0 lands as a change. */
  revision: number
}

/** Declared action shape giving the exported factory a stable return type. */
type KimetsuRowActions = {
  sync: (draft: KimetsuRowState, preference: string, revision: number) => void
}

/**
 * Declares the Kimetsu row state and write surface.
 * @returns the store handle.
 */
export function createKimetsuRowStore(): EngineStoreHandle<KimetsuRowState, KimetsuRowActions> {
  return defineStore({
    init: (): KimetsuRowState => ({ preference: 'system', revision: -1 }),
    actions: {
      sync: (d, preference: string, revision: number) => {
        if (revision <= d.revision) return
        d.preference = preference
        d.revision = revision
      },
    },
  })
}
