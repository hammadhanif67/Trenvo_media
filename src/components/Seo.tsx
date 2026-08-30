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

   §21.1 — canonical on every page.
   §21.2 — title <=60 chars, description <=155.
   §21.6 — og:title mirrors the H1, not the SEO title; twitter:card is
           summary_large_image; og:locale is en.
--------------------------------------------------------------------------- */

export interface SeoProps {
  /** Overrides the route's default, for dynamic pages such as a teardown. */
  title?: string;
  description?: string;
  ogTitle?: string;
  /** §21.5 — structured data for this page. Nulls are dropped. */
  schemas?: (JsonLd | null)[];
}

export function Seo({ title, description, ogTitle, schemas = [] }: SeoProps) {
  const { pathname } = useLocation();
  const route = getRouteSeo(pathname);

  const finalTitle = title ?? route.title;
  const finalDescription = description ?? route.description;
  const finalOgTitle = ogTitle ?? route.ogTitle;
  const canonical = absoluteUrl(pathname);

  const present = schemas.filter((s): s is JsonLd => s !== null);

  return (
    <Head>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <link rel="canonical" href={canonical} />

      {/* §21.6 — og:image must be ABSOLUTE; scrapers ignore relative URLs. */}
      <meta property="og:image" content={absoluteUrl('/brand/og-default.png')} />
      <meta name="twitter:image" content={absoluteUrl('/brand/og-default.png')} />

      {/* §21.6 — written for a human reading a link preview. */}
      <meta property="og:title" content={finalOgTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:url" content={canonical} />
      <meta name="twitter:title" content={finalOgTitle} />
      <meta name="twitter:description" content={finalDescription} />

      {present.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Head>
  );
}
