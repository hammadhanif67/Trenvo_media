import { useEffect, useLayoutEffect, type RefObject } from 'react';
import { useLocation, useNavigationType } from 'react-router';

/**
 * ROUTE TRANSITION — scroll and focus behaviour on navigation.
 *
 * React Router does not reset scroll on navigation, so a click from the footer
 * opened the next page at the footer's scroll offset with the <h1> off-screen.
 * Measured before the fix: leaving `/` at 12042px landed on `/process` at
 * 4476px. Focus also stayed on <body>, so keyboard users carried on tabbing
 * from wherever they were and screen readers announced nothing.
 *
 * Three behaviours, in priority order:
 *
 *   1. A #hash wins — an in-page anchor must reach its target, not the top.
 *   2. Back/forward (POP) restores the position the user left, which is what
 *      makes the back button feel like the browser rather than a reset. React
 *      Router gives every history entry a stable `key`, so positions are stored
 *      per entry in sessionStorage.
 *   3. Everything else goes to the top.
 *
 * Focus moves to <main> on forward navigation only. §30.1 gives <main> the
 * skip-link target and `tabIndex={-1}`, so it is programmatically focusable
 * without joining the tab order. `preventScroll` stops focus fighting the
 * scroll above. On POP focus is left alone: the user is returning to a place
 * they know, and moving it would be the more disorienting choice.
 */

// useLayoutEffect warns during pre-render; every route here is pre-rendered.
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const key = (k: string) => `trenvo:scroll:${k}`;

export function useRouteTransition(mainRef: RefObject<HTMLElement | null>): void {
  const location = useLocation();
  const navigationType = useNavigationType();
  const entryKey = location.key;

  // Remember where this entry was left, so POP can return to it.
  useEffect(() => {
    const save = () => {
      try {
        sessionStorage.setItem(key(entryKey), String(window.scrollY));
      } catch {
        // Private mode can throw. Losing a scroll offset is not worth failing.
      }
    };
    window.addEventListener('pagehide', save);
    return () => {
      save();
      window.removeEventListener('pagehide', save);
    };
  }, [entryKey]);

  // Position before paint, so the new page is never seen at the old offset.
  useIsomorphicLayoutEffect(() => {
    if (location.hash) {
      const target = document.getElementById(location.hash.slice(1));
      if (target) {
        target.scrollIntoView();
        return;
      }
    }

    if (navigationType === 'POP') {
      try {
        const saved = sessionStorage.getItem(key(entryKey));
        if (saved !== null) {
          window.scrollTo(0, Number(saved));
          return;
        }
      } catch {
        // Fall through to the top.
      }
    }

    window.scrollTo(0, 0);
  }, [entryKey, location.hash, navigationType]);

  useEffect(() => {
    if (navigationType === 'POP' || location.hash) return;
    mainRef.current?.focus({ preventScroll: true });
  }, [entryKey, location.hash, navigationType, mainRef]);
}
