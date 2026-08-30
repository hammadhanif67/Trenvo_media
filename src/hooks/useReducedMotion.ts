import { useEffect, useState } from 'react';

/**
 * master.md §27.4 — "prefers-reduced-motion: reduce disables 1, 2, 3, 5, 6, 7, 8
 * entirely ... This is tested as a first-class state, not as a fallback."
 *
 * Returns false during pre-render, so the static HTML is the motion-enabled
 * markup and the reduced state is applied on the client once the media query
 * can be read. Nothing becomes invisible or unusable either way (§27.4).
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
