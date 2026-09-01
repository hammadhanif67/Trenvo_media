import { Head } from 'vite-react-ssg';
import { useLocation } from 'react-router';
import { getRouteSeo } from '../data/seo';
import { absoluteUrl } from '../lib/site';
import type { JsonLd } from '../lib/schema';

/* ---------------------------------------------------------------------------
   SEO — master.md §21, §28.2 (head tag composition).

   §21.7 is the reason this can work at all: "every route must ship real
   server-rendered HTML." vite-react-ssg pre-renders each route, so these tags
   are in the file on disk rather than applied by JavaScript afterwards —
   §28.4: "Social and messaging link previews DO NOT EXECUTE JAVASCRIPT AT ALL."

   EVERY URL EMITTED HERE IS ABSOLUTE. canonical, og:url and og:image all run
   through absoluteUrl(), which resolves against the one origin defined in
   scripts/site-origin.mjs. A relative og:image is silently ignored by every
   scraper, and a relative canonical is a different bug on every host — so the
   build audit fails on either.
--------------------------------------------------------------------------- */

export interface SeoProps {
  /** Overrides the route's default, for dynamic pages such as a teardown. */
  title?: string;
  description?: string;
  ogTitle?: string;
  /**
   * Overrides the canonical path. Needed by the dynamic routes: useLocation()
   * gives the concrete path at prerender time, which is correct, but a page
   * that wants to point at a different canonical (a paginated view, say) says
   * so explicitly rather than by accident.
   */
  canonicalPath?: string;
  /**
   * Route-specific image, relative to the site root. Defaults to the brand
   * card. Made absolute here, never by the caller.
   */
  image?: string;
  /** Force `noindex, follow` for a page not enumerated in data/seo.ts. */
  noindex?: boolean;
  /** §21.5 — structured data for this page. Nulls are dropped. */
  schemas?: (JsonLd | null)[];
  /** `article` for teardowns, `website` for everything else. */
  ogType?: 'website' | 'article';
}

export function Seo({
  title,
  description,
  ogTitle,
  canonicalPath,
  image = '/brand/og-default.png',
  noindex,
  schemas = [],
  ogType = 'website',
}: SeoProps) {
  const { pathname } = useLocation();
  const route = getRouteSeo(pathname);

  const finalTitle = title ?? route.title;
  const finalDescription = description ?? route.description;
  const finalOgTitle = ogTitle ?? route.ogTitle;
  const canonical = absoluteUrl(canonicalPath ?? pathname);
  const absoluteImage = absoluteUrl(image);

  /*
    `noindex, follow` and not `noindex, nofollow`. A legal page still passes
    authority through its links and still needs its own links crawled; the only
    thing wrong with it in an index is that it would compete with a page that
    belongs there.
  */
  const robots = (noindex ?? route.noindex) ? 'noindex, follow' : undefined;

  const present = schemas.filter((s): s is JsonLd => s !== null);

  return (
    <Head>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <link rel="canonical" href={canonical} />
      {robots && <meta name="robots" content={robots} />}

      {/* §21.6 — og:image must be ABSOLUTE; scrapers ignore relative URLs. */}
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:image:alt" content={finalOgTitle} />
      <meta name="twitter:image" content={absoluteImage} />

      {/* §21.6 — written for a human reading a link preview. */}
      <meta property="og:title" content={finalOgTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:url" content={canonical} />
      <meta name="twitter:title" content={finalOgTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:url" content={canonical} />

      {present.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Head>
  );
}
