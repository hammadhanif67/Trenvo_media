/* ---------------------------------------------------------------------------
   MOUNT GUARD — makes the double-render failure mode unreachable.

   THE BUG THIS EXISTS FOR

   vite-react-ssg picks its mount strategy by sniffing the DOM:

     const isSSR = document.querySelector('[data-server-rendered=true]') !== null;
     isSSR ? hydrate(app, container) : render(app, container);

   `render()` resolves to React 19's `createRoot(container).render(app)`. React
   19's createRoot does NOT clear a container it is given — it appends its tree
   alongside whatever is already there. So if #root ever holds pre-rendered
   markup while the `data-server-rendered` marker is absent, the page mounts a
   SECOND copy of itself beneath the first:

     · two <main> elements, two <h1> elements
     · the first copy is inert HTML — no listeners, so menus, the theme toggle
       and the FAQ accordion all appear dead
     · the second copy is the live React tree, below the fold

   That marker can go missing for reasons outside this repo: an HTML minifier or
   CDN "optimiser" that strips unknown data-* attributes, a host that rewrites
   the shell, or a partial deploy that ships a stale index.html against fresh
   JS. The application code is correct in every one of those cases and the page
   still breaks.

   THE FIX

   Reconcile the two signals BEFORE the library reads them, so the branch it
   takes is always the one that matches the DOM it is actually looking at:

     · markup present + marker missing  ->  restore the marker, so it hydrates
       instead of appending a duplicate
     · container empty + marker present ->  drop the marker, so it client-renders
       instead of hydrating against nothing

   Either way exactly one copy of the application is mounted. This runs at
   module-evaluation time; the library's mount is async (it awaits
   documentReady()), so this is guaranteed to land first.

   See also assertSingleRender() below and the `single render` block in
   scripts/audit-build.mjs — the same invariant, checked at three layers.
--------------------------------------------------------------------------- */

const ROOT_ID = 'root';
const MARKER = 'data-server-rendered';

/**
 * Reconcile `#root`'s contents with the SSR marker vite-react-ssg branches on.
 * Idempotent, and a no-op on the server.
 */
export function reconcileServerRenderMarker(): void {
  if (typeof document === 'undefined') return;

  const root = document.getElementById(ROOT_ID);
  if (!root) return;

  // `childElementCount` and not `childNodes`: the shell ships whitespace text
  // nodes around the div, and those must not read as "server rendered".
  const hasMarkup = root.childElementCount > 0;
  const hasMarker = root.getAttribute(MARKER) === 'true';

  if (hasMarkup && !hasMarker) {
    root.setAttribute(MARKER, 'true');
    if (import.meta.env.DEV) {
      console.warn(
        `[mount-guard] #root held pre-rendered markup but no ${MARKER} marker. ` +
          'Restored it — without this the app would have client-rendered a ' +
          'second copy on top of the first.',
      );
    }
    return;
  }

  if (!hasMarkup && hasMarker) {
    root.removeAttribute(MARKER);
    if (import.meta.env.DEV) {
      console.warn(
        `[mount-guard] #root carried ${MARKER} but is empty. Removed it so the ` +
          'app client-renders rather than hydrating against nothing.',
      );
    }
  }
}

/**
 * DEV/E2E ASSERTION — the landmark invariants, checked against the live DOM
 * after the app has mounted.
 *
 * The static build audit checks the same counts in the shipped HTML, but only
 * the browser can catch a duplicate introduced by the MOUNT. This is that
 * layer. It reports rather than throws: a thrown error here would replace a
 * cosmetic duplicate with a blank page, which is strictly worse for whoever is
 * looking at it.
 *
 * `window.__TRENVO_RENDER_AUDIT__` is the machine-readable form, so a Playwright
 * or Puppeteer check can assert on it without scraping console text.
 */
export interface RenderAudit {
  roots: number;
  mains: number;
  h1s: number;
  ok: boolean;
  problems: string[];
}

export function assertSingleRender(): RenderAudit {
  const roots = document.querySelectorAll(`#${ROOT_ID}`).length;
  const mains = document.querySelectorAll('main').length;
  const h1s = document.querySelectorAll('h1').length;

  const problems: string[] = [];
  if (roots !== 1) problems.push(`${roots} #root elements (expected 1)`);
  if (mains !== 1) problems.push(`${mains} <main> elements (expected 1)`);
  if (h1s !== 1) problems.push(`${h1s} <h1> elements (expected 1)`);

  const audit: RenderAudit = { roots, mains, h1s, ok: problems.length === 0, problems };

  (window as unknown as { __TRENVO_RENDER_AUDIT__?: RenderAudit }).__TRENVO_RENDER_AUDIT__ =
    audit;

  if (!audit.ok) {
    console.error(
      '[mount-guard] DUPLICATE RENDER DETECTED — ' +
        problems.join('; ') +
        '. The page has mounted more than once; the first copy will not respond ' +
        'to clicks. See src/lib/mountGuard.ts.',
    );
  }

  return audit;
}

/**
 * Run the assertion once the app has had a chance to mount, on the first
 * navigation and on every subsequent one.
 *
 * Two frames of slack: one for the mount, one for React to commit it.
 */
export function watchForDuplicateRender(): void {
  if (typeof window === 'undefined') return;

  const check = () =>
    requestAnimationFrame(() => requestAnimationFrame(() => assertSingleRender()));

  check();
  window.addEventListener('popstate', check);
}
