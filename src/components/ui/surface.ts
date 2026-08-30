import { createContext, useContext } from 'react';

/**
 * SURFACE CONTEXT — the mechanism behind master.md §23.2's one fragile rule.
 *
 * §23.2: "--blue-600 is never placed on --ink (measured 3.86:1) — this is the
 * one rule that will be violated by accident if it is not enforced in the
 * component API."
 *
 * `Section` publishes the tone it painted; `Button` (and anything else that
 * needs a blue) reads it and picks the legal one. A developer therefore cannot
 * express the failing pair by forgetting a prop — the default is always correct
 * for the surface the component is actually sitting on.
 *
 * Planned in implementation.md §3.3; wired here now that `Section` exists.
 */
export type Surface = 'light' | 'dark';

export const SurfaceContext = createContext<Surface>('light');

export function useSurface(): Surface {
  return useContext(SurfaceContext);
}
