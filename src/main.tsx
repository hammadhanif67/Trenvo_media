import { ViteReactSSG } from 'vite-react-ssg';
import { routes } from './app/router';
import { reconcileServerRenderMarker, watchForDuplicateRender } from './lib/mountGuard';
import './styles/globals.css';

/* ---------------------------------------------------------------------------
   CLIENT ENTRY — mounted exactly once.

   ORDER IS LOAD-BEARING. `reconcileServerRenderMarker()` must run before
   ViteReactSSG() so the library reads a DOM whose SSR marker matches its actual
   contents. The library's own mount is async (it awaits documentReady()), so a
   synchronous call here is guaranteed to land first. See src/lib/mountGuard.ts
   for the failure it prevents — React 19's createRoot appending a second,
   inert copy of the whole page on top of the pre-rendered one.

   `ViteReactSSG` is called ONCE, at module scope, and this module is referenced
   by exactly one <script type="module"> in index.html. There is no second
   entry, no second router and no second provider: RootLayout owns the single
   <main>, and every page renders exactly one <h1> (enforced by the Heading
   component's `level` prop and by scripts/audit-build.mjs).
--------------------------------------------------------------------------- */

reconcileServerRenderMarker();

export const createRoot = ViteReactSSG({ routes });

// Dev-only tripwire. Stripped from the production bundle by the DEV constant.
if (import.meta.env.DEV) {
  watchForDuplicateRender();
}
