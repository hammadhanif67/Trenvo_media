import type { RouteRecord } from 'vite-react-ssg';
import { RootLayout } from '../layouts/RootLayout';
import { Home } from '../pages/Home';
import { Services } from '../pages/Services';
import { ServiceDetail } from '../pages/ServiceDetail';
import { NotFound } from '../pages/NotFound';
import { Process } from '../pages/Process';
import { Pricing } from '../pages/Pricing';
import { Work } from '../pages/Work';
import { WorkDetail } from '../pages/WorkDetail';
import { Teardowns } from '../pages/Teardowns';
import { TeardownDetail } from '../pages/TeardownDetail';
import { TeardownOffer } from '../pages/TeardownOffer';
import { About } from '../pages/About';
import { Careers } from '../pages/Careers';
import { Contact } from '../pages/Contact';
import { AiPolicy } from '../pages/AiPolicy';
import { Legal } from '../pages/Legal';
import { TEARDOWNS } from '../data/teardowns';
import { WORK } from '../data/work';
import { SERVICES } from '../data/services';

/**
 * THE ROUTE MANIFEST — master.md §28.2.
 *
 * This file is the source of truth for what exists. scripts/routes.mjs mirrors
 * it for the sitemap and the build audit; scripts/validate-routes.mjs fails the
 * build if the two ever disagree, or if any internal <Link> in src/ points at a
 * path this file does not declare.
 *
 * ---------------------------------------------------------------------------
 * ROUTES REMOVED, AND WHERE THEY WENT — all 301'd in vercel.json
 *
 *   /specialists            -> /about#specialists
 *       Two pages argued the same position with different words. /about is now
 *       the single company/team authority page and absorbs the lattice.
 *   /legal/privacy          -> /privacy
 *   /legal/terms            -> /terms
 *       Top-level legal paths are what people type and what a footer link is
 *       expected to be.
 *   /services/video-editing -> /services/short-form-video-ads
 *       Renamed with the taxonomy. See data/services.ts.
 * ---------------------------------------------------------------------------
 * STANDING ARCHITECTURAL RULE — approved 30 August 2026
 *
 *   No route in this file may declare a `loader` until the vite-react-ssg
 *   `json` compatibility gap is explicitly resolved.
 *
 * vite-react-ssg@0.9.2 calls `json` from react-router-dom inside
 * callRouteLoader, and React Router v7 removed it. The compatibility shim in
 * vendor/react-router-dom deliberately does not supply a replacement, because
 * writing one would invent behaviour the source documents never specified.
 *
 * The path is unreachable while no route defines a `loader` — which is what
 * master.md §26.4 already prescribes: content is typed data in src/data/ and
 * nothing fetches. Adding a `loader` here breaks the static build.
 *
 * See vendor/react-router-dom/README.md and implementation.md §3.1.
 * ---------------------------------------------------------------------------
 */
export const routes: RouteRecord[] = [
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: Home },

      /* -- Services ------------------------------------------------------- */
      { path: 'services', Component: Services },
      {
        path: 'services/:slug',
        Component: ServiceDetail,
        // §21.7 — every route ships real HTML, so the slugs are enumerated at
        // build time from the same data the pages render from.
        getStaticPaths: () => SERVICES.map((s) => `/services/${s.slug}`),
      },

      /* -- Company -------------------------------------------------------- */
      { path: 'process', Component: Process },
      { path: 'pricing', Component: Pricing },
      { path: 'about', Component: About },
      { path: 'careers', Component: Careers },
      { path: 'contact', Component: Contact },

      /* -- Proof ---------------------------------------------------------- */
      { path: 'work', Component: Work },
      {
        path: 'work/:slug',
        Component: WorkDetail,
        // Empty until the first verified case study is published. An empty
        // array emits no pages, which is correct: a route with no data must
        // not ship a shell.
        getStaticPaths: () => WORK.map((w) => `/work/${w.slug}`),
      },
      { path: 'teardowns', Component: Teardowns },
      {
        path: 'teardowns/:slug',
        Component: TeardownDetail,
        getStaticPaths: () => TEARDOWNS.map((t) => `/teardowns/${t.slug}`),
      },

      /* -- The offer — the primary low-friction conversion path. ----------- */
      { path: 'teardown', Component: TeardownOffer },

      /* -- Policy and legal. All noindex except /ai-policy. ---------------- */
      { path: 'ai-policy', Component: AiPolicy },
      { path: 'privacy', element: <Legal document="privacy" /> },
      { path: 'terms', element: <Legal document="terms" /> },
      { path: 'dpa', element: <Legal document="dpa" /> },

      /*
        THE 404.

        `path: '*'` renders NotFound for an unmatched client-side navigation,
        but a static host never reaches React for an unknown URL — it looks for
        a file and, finding none, serves its own default 404. `getStaticPaths`
        pre-renders the branded page to /404/index.html, and the build step
        copies it to /404.html, which is the filename Vercel, Netlify, S3 and
        nginx all look for. See scripts/emit-404.mjs.
      */
      { path: '*', Component: NotFound, getStaticPaths: () => ['/404'] },
    ],
  },
];
