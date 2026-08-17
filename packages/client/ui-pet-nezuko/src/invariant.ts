/**
 * Package-owned invariant companion for `@deepseek-ai/dsh-client-ui-pet-nezuko`.
 * @module @deepseek-ai/dsh-client-ui-pet-nezuko/invariant
 */

/* jscpd:ignore-start */
import type { Context } from '@deepseek-ai/cordis'
import type { InvariantInstaller } from '@deepseek-ai/dsh-invariants'

const PACKAGE_NAME = '@deepseek-ai/dsh-client-ui-pet-nezuko'

/** Cordis companion plugin name. */
export const name = 'client-ui-pet-nezuko-invariant'
/** Service required before the companion can reserve package ownership. */
export const inject = ['invariants']

/**
 * No runtime invariant: the pet layer is a self-owned DOM mount disposed with
 * the plugin effect; it emits no cordis events and owns no cross-plugin
 * mutable state (position/boxed preferences stay in localStorage).
 */
const install: InvariantInstaller = () => {}

/**
 * Register this package's invariant companion.
 * @param ctx - Cordis context carrying the invariant service.
 * @returns the installed registration's disposer after setup succeeds.
 */
export const apply = (ctx: Context): Promise<() => void> =>
  Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install))
/* jscpd:ignore-end */
