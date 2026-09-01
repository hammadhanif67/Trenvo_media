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
 *
 * ---------------------------------------------------------------------------
 * ⚠ THE FIRST-LOAD HASH BUG
 *
 * Rule 1 above worked for in-app navigation and did NOTHING on a cold load of
 * a URL that already carried a hash — which is the case that matters most,
 * because that is what an inbound link, a shared URL and the /specialists ->
 * /about#specialists redirect all are.
 *
 * Measured on a fresh load of /about#specialists: the layout effect ran,
 * scrollIntoView() fired, and the page still sat at scrollY 0 with the target
 * 1682px below the fold. Two things were undoing it:
 *
 *   1. The browser's own scroll restoration, which runs after `load` and puts
 *      a fresh navigation back at the top — after our effect, so it wins.
 *   2. Late layout. Fonts swap and hero imagery decodes after hydration, both
 *      of which move everything below them. Even when the early scroll
 *      survived, it landed at an offset that was correct for a page that had
 *      not finished laying out.
 *
 * The fix is both halves: take scroll restoration off automatic so nothing
 * fights us, and re-apply the hash scroll after `load` and after the fonts
 * settle, which are the two events that move the target.
 */

// useLayoutEffect warns during pre-render; every route here is pre-rendered.
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const key = (k: string) => `trenvo:scroll:${k}`;

/**
 * Scroll an element into view, honouring its scroll-margin-top.
 *
 * ⚠ `behavior: 'instant'` IS LOAD-BEARING, and it is not a preference.
 *
 * globals.css sets `html { scroll-behavior: smooth }` so that clicking an
 * in-page anchor glides rather than teleports. That declaration also applies to
 * every PROGRAMMATIC scroll, including this one — and a smooth scroll started
 * during hydration is animating while the page is still laying out. Fonts swap,
 * images decode, the target moves, and the animation is interrupted and
 * abandoned: measured on a cold load of /about#specialists, the page finished
 * at scrollY 0 with the target 1682px below the fold.
 *
 * An explicit `instant` overrides the CSS for navigation-driven jumps only. A
 * user clicking an anchor still gets the smooth scroll, because that path goes
 * through the browser rather than through here — which is the right split: a
 * page arriving at a position should be instantaneous, and a user moving within
 * a page they can already see should be animated.
 */
function jumpTo(hash: string): boolean {
  const id = hash.slice(1);
  if (!id) return false;
  // decodeURIComponent: a hash can legitimately be percent-encoded.
  const target =
    document.getElementById(id) ?? document.getElementById(decodeURIComponent(id));
  if (!target) return false;
  target.scrollIntoView({ behavior: 'instant', block: 'start' });
  return true;
}

export function useRouteTransition(mainRef: RefObject<HTMLElement | null>): void {
  const location = useLocation();
  const navigationType = useNavigationType();
  const entryKey = location.key;

  /*
    Take scroll restoration off automatic ONCE, as early as possible.

    This hook already restores position on POP from sessionStorage, keyed by
    React Router's stable history-entry key, so the browser's version is
    redundant — and on a hashed first load it actively fights us by resetting
    to the top after our jump. 'manual' makes this hook the only thing deciding
    where the page sits.
  */
  useIsomorphicLayoutEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  }, []);

  /*
    THE FIRST-LOAD HASH. Runs once, and re-applies the jump after the two
    events that move the target: the load event (images decoded) and the fonts
    settling (text reflowed). Without this a cold load of /about#specialists
    sits at the top of the page.

    Guarded on the hash still matching, so a visitor who has already scrolled
    or navigated away is never yanked back.
  */
  useEffect(() => {
    const initialHash = window.location.hash;
    if (!initialHash) return;

    const reapply = () => {
      if (window.location.hash !== initialHash) return;
      jumpTo(initialHash);
    };

    reapply();

    if (document.readyState !== 'complete') {
      window.addEventListener('load', reapply, { once: true });
    }
    // `document.fonts` is absent in some older browsers; the jump above still
    // happened, so this is an improvement rather than a requirement.
    void document.fonts?.ready.then(reapply).catch(() => {});

    return () => window.removeEventListener('load', reapply);
    // Deliberately once, on mount: this is the COLD-LOAD path. Hash changes
    // during the session are handled by the layout effect below, which is
    // keyed on location.hash.
  }, []);

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
    if (location.hash && jumpTo(location.hash)) return;

    if (navigationType === 'POP') {
      try {
        const saved = sessionStorage.getItem(key(entryKey));
        if (saved !== null) {
          // 'instant' for the same reason as jumpTo above.
          window.scrollTo({ top: Number(saved), behavior: 'instant' });
          return;
        }
      } catch {
        // Fall through to the top.
      }
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [entryKey, location.hash, navigationType]);

  useEffect(() => {
    if (navigationType === 'POP' || location.hash) return;
    mainRef.current?.focus({ preventScroll: true });
  }, [entryKey, location.hash, navigationType, mainRef]);
}
