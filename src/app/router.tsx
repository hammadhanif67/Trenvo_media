import type { RouteRecord } from 'vite-react-ssg';
import { RootLayout } from '../layouts/RootLayout';
import { Home } from '../pages/Home';
import { Services } from '../pages/Services';
import { ServiceDetail } from '../pages/ServiceDetail';
import { NotFound } from '../pages/NotFound';
import { Specialists } from '../pages/Specialists';
import { Process } from '../pages/Process';
import { Work } from '../pages/Work';
import { Teardowns } from '../pages/Teardowns';
import { TeardownDetail } from '../pages/TeardownDetail';
import { About } from '../pages/About';
import { Contact } from '../pages/Contact';
import { Legal } from '../pages/Legal';
import { TEARDOWNS } from '../data/teardowns';
import { SERVICES } from '../data/services';

/**
 * THE ROUTE MANIFEST — master.md §28.2.
 *
 * This file is also the source for sitemap generation (master.md §21.7, M11).
 *
 * All 16 approved launch routes (wireframe.md §1.1) are registered. The M0
 * spike routes that proved the route shapes were removed once the real pages
 * replaced them.
 *
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
      { path: 'services', Component: Services },
      { path: 'specialists', Component: Specialists },
      { path: 'process', Component: Process },
      { path: 'work', Component: Work },
      { path: 'teardowns', Component: Teardowns },
      {
        path: 'teardowns/:slug',
        Component: TeardownDetail,
        // §21.7 — enumerated from the same data the pages render from. Empty
        // until Phase 5 publishes the first teardowns (the launch gate).
        getStaticPaths: () => TEARDOWNS.map((t) => `/teardowns/${t.slug}`),
      },
      { path: 'about', Component: About },
      { path: 'contact', Component: Contact },
      { path: 'legal/privacy', element: <Legal document="privacy" /> },
      { path: 'legal/terms', element: <Legal document="terms" /> },
      {
        path: 'services/:slug',
        Component: ServiceDetail,
        // §21.7 — every route ships real HTML, so the seven slugs are
        // enumerated at build time from the same data the pages render from.
        getStaticPaths: () => SERVICES.map((s) => `/services/${s.slug}`),
      },
      { path: '*', Component: NotFound },
    ],
  },
];
