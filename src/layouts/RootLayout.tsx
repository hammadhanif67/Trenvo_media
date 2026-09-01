import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Navbar } from '../components/navigation/Navbar';
import { Footer } from '../components/navigation/Footer';
import { MobileActionBar } from '../components/navigation/MobileActionBar';
import { useRouteTransition } from '../hooks/useRouteTransition';
import { track } from '../lib/analytics';

/**
 * ROOT LAYOUT — master.md §28.2: "Navbar + Outlet + Footer + skip link".
 *
 * §30.1 landmarks: <header>, <nav>, <main>, <footer>. Navbar supplies the first
 * two, Footer the last; <main> is here and carries the skip-link target.
 *
 * §30.1: "Skip-to-content link, first in tab order, visible on focus." It is
 * therefore the first element in the DOM, visually hidden until focused, and
 * never removed from the accessibility tree.
 *
 * `useRouteTransition` owns scroll and focus on navigation — without it a click
 * from the footer opened the next page at the footer's offset.
 */
export function RootLayout() {
  const mainRef = useRef<HTMLElement>(null);
  const { pathname } = useLocation();
  useRouteTransition(mainRef);

  /*
    One `page_view` per route, including client-side navigations — which a
    server log cannot see, because they never reach the server. Keyed on
    pathname only: the search string can carry an email address from a mail
    client's click-through, and that must not reach a collector.

    A no-op unless VITE_ANALYTICS_ENDPOINT is configured. See lib/analytics.ts.
  */
  useEffect(() => {
    track('page_view');
  }, [pathname]);

  return (
    <>
      {/*
        §27.2 #3's reveals are Framer Motion, and this site is statically
        pre-rendered (§31.2), so `opacity: 0` is written into the shipped HTML.
        Without JavaScript those sections would never un-hide. This forces every
        [data-reveal] visible when scripts do not run, so the pre-rendered page
        reads completely with no JavaScript — which is the reason it is
        pre-rendered in the first place.
      */}
      <noscript>
        <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
      </noscript>

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:inline-flex focus:items-center focus:bg-blue-600 focus:px-6 focus:text-paper focus:[min-height:var(--touch-min)] focus:outline-2 focus:outline-offset-2 focus:outline-blue-600"
      >
        Skip to content
      </a>

      <Navbar />

      {/* tabIndex -1 makes this focusable programmatically — for the skip link
          and for the route transition — without adding it to the tab order. */}
      <main id="main" ref={mainRef} tabIndex={-1} className="focus:outline-none">
        <Outlet />
      </main>

      <Footer />

      {/*
        The sticky mobile conversion bar. LAST in the DOM on purpose: `sticky
        bottom-0` on the final element pins it to the viewport while there is
        page left below, and lets it come to rest naturally at the end rather
        than floating over the footer. It hides itself on desktop and on the
        two pages it would be redundant on.
      */}
      <MobileActionBar />
    </>
  );
}
