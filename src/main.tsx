import { ViteReactSSG } from 'vite-react-ssg';
import { createBrowserRouter } from 'react-router';
import { routes } from './app/router';
import { reconcileServerRenderMarker, watchForDuplicateRender } from './lib/mountGuard';
import './styles/globals.css';

/* ---------------------------------------------------------------------------
   CLIENT ENTRY — mounted exactly once, and hydrated in one pass.

   ===========================================================================
   THE PRODUCTION DOUBLE-RENDER BUG
   ===========================================================================

   Production rendered every page TWICE: two <header>, two <main>, two <h1>,
   two <footer>, all inside a single #root, with this in the console:

       No `HydrateFallback` element provided to render during initial hydration

   The served HTML was always correct — one copy. The duplication happened
   during hydration, and the chain is entirely inside vite-react-ssg:

     1. `transformStaticLoaderRoute` injects an async `loader` into EVERY route
        whenever `[data-server-rendered=true]` is in the DOM — which is every
        prerendered page.

     2. That loader AWAITS A NETWORK FETCH of
        `static-loader-data-manifest-<hash>.json`.

     3. A data router whose matched routes have loaders and no corresponding
        hydration data reports `state.initialized === false`. It must resolve
        those loaders before it can render anything.

     4. `RouterProvider` therefore renders its `HydrateFallback` on the first
        pass. None is provided, so it renders NOTHING — which is exactly what
        the warning reports.

     5. `hydrateRoot(container, app)` is then asked to hydrate an empty tree
        against a container full of server markup. The trees do not match,
        React abandons hydration, and when the loaders finally resolve the
        client tree is inserted ALONGSIDE the server markup rather than
        replacing it. Two complete copies of the application.

   ⚠ WHY IT NEVER REPRODUCED ON LOCALHOST. It is a RACE. The manifest resolves
   in about a millisecond locally, usually before React commits, and the page
   renders once. Over real network latency it does not, and it renders twice.
   Localhost success proved nothing — it was reproduced by artificially
   delaying that one request, which is the only way to see it off-production.

   ===========================================================================
   THE FIX — REMOVE THE INJECTED LOADERS
   ===========================================================================

   Supplying `hydrationData` alone is NOT enough, and that was measured rather
   than assumed: with `loaderData: {}` React Router still sees loader-bearing
   matched routes with no data for them, computes `initialized: false`, and the
   duplication happens exactly as before.

   So the loaders are stripped instead, through the library's own
   `customCreateRouter` extension point. With no loaders to resolve the router
   is initialized synchronously, `RouterProvider` renders the real tree on the
   first pass, and hydration matches the server HTML exactly. One copy.

   ⚠ WHY THIS IS SAFE, AND NOT A WORKAROUND THAT LOSES DATA.

   Those loaders are not ours. app/router.tsx carries a standing architectural
   rule that no route may declare a `loader` — content is typed data in
   src/data/ and nothing fetches — and that rule is what makes vite-react-ssg's
   `json` incompatibility unreachable in the first place. Every loader on these
   routes was injected by the library, and the manifest they fetch is literally
   `{}`. Nothing in the application calls `useLoaderData`.

   So this removes a network request that returns an empty object, feeds no
   component, and breaks hydration. It also ends the duplicate
   `static-loader-data-manifest` request on every page load.

   IF A ROUTE EVER LEGITIMATELY NEEDS A LOADER, this must be revisited together
   with that standing rule — the dev-only assertion below is what will catch it.
--------------------------------------------------------------------------- */

/** The shape `customCreateRouter` receives: data routes, possibly nested. */
type RouteWithChildren = Parameters<typeof createBrowserRouter>[0][number] & {
  children?: RouteWithChildren[];
  loader?: unknown;
};

/**
 * Recursively drop `loader` so the router initializes synchronously.
 *
 * Returns new objects rather than mutating: the array the library hands over is
 * the same one it keeps a reference to, and mutating it in place would make the
 * behaviour depend on call order.
 */
function withoutLoaders<T extends RouteWithChildren>(routeObjects: T[]): T[] {
  return routeObjects.map((route) => {
    const { loader: _injected, ...rest } = route;
    void _injected;
    const next = rest as T;
    return route.children
      ? ({ ...next, children: withoutLoaders(route.children) } as T)
      : next;
  });
}

/**
 * The router the client hydrates with.
 *
 * Only ever called on the client — `createRoot(false)` during prerender does
 * not build a browser router at all, so nothing here runs at build time.
 */
const createHydratedRouter: typeof createBrowserRouter = (routeObjects, options) => {
  if (import.meta.env.DEV) {
    const declared = (routeObjects as RouteWithChildren[]).some(function check(
      route,
    ): boolean {
      return Boolean(route.loader) || (route.children ?? []).some(check);
    });
    if (declared) {
      console.warn(
        '[main] Route loaders were stripped to keep hydration single-pass. If a ' +
          'route now legitimately declares its own loader, revisit the standing ' +
          'rule in app/router.tsx and the note in src/main.tsx.',
      );
    }
  }

  return createBrowserRouter(withoutLoaders(routeObjects as RouteWithChildren[]), {
    ...options,
    // Belt and braces: with no loaders the router is already initialized, and
    // the server emits this into every page anyway.
    hydrationData:
      typeof window !== 'undefined' ? window.__staticRouterHydrationData : undefined,
  });
};

/*
  ORDER IS LOAD-BEARING. `reconcileServerRenderMarker()` must run before
  ViteReactSSG() so the library reads a DOM whose SSR marker matches its actual
  contents. The library's own mount is async (it awaits documentReady()), so a
  synchronous call here is guaranteed to land first.

  It guards a DIFFERENT failure from the one above: if the marker is missing
  while #root holds markup, the library picks `createRoot().render()` instead of
  hydrating, and React 19's createRoot APPENDS to a populated container. Same
  visible symptom, different cause. Both paths are now closed.

  `ViteReactSSG` is called ONCE, at module scope, and this module is referenced
  by exactly one <script type="module"> in index.html.
*/
reconcileServerRenderMarker();

export const createRoot = ViteReactSSG({
  routes,
  customCreateRouter: createHydratedRouter,
});

// Dev-only tripwire. Stripped from the production bundle by the DEV constant.
if (import.meta.env.DEV) {
  watchForDuplicateRender();
}
