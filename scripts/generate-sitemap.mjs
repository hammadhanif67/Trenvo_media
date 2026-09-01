/**
 * SITEMAP + ROBOTS — master.md §21.7.
 *
 *   node scripts/generate-sitemap.mjs      (runs after `npm run build`)
 *
 * §21.7: "/sitemap.xml generated at build FROM THE ROUTE MANIFEST, lastmod from
 * content timestamps. /robots.txt allows all, references the sitemap, disallows
 * nothing except any preview or staging path."
 *
 * ---------------------------------------------------------------------------
 * WHY IT ENUMERATES dist/ RATHER THAN THE ROUTER
 *
 * The requirement is that every URL in the sitemap returns 200. Reading the
 * router would list what SHOULD have been built; reading dist/ lists what
 * actually was. A route that failed to prerender is then absent from both the
 * site and the sitemap, rather than being advertised to Google as a page that
 * does not exist.
 *
 * That is not a licence to drift: scripts/audit-build.mjs cross-checks the
 * built pages against the metadata manifest in src/data/seo.ts and fails the
 * build if a declared route did not render.
 *
 * ---------------------------------------------------------------------------
 * WHAT IS EXCLUDED, AND HOW IT IS DECIDED
 *
 *   · /404              — a 404 must never be advertised as a destination
 *   · any page shipping `<meta name="robots" content="noindex...">`
 *
 * The noindex test READS THE BUILT HTML rather than a second list kept in this
 * file. src/data/seo.ts marks the legal routes noindex and components/Seo.tsx
 * emits the tag, so the sitemap and the page can never disagree about whether a
 * URL is indexable — which is exactly the class of bug a duplicated list
 * creates.
 *
 * ---------------------------------------------------------------------------
 * lastmod
 *
 * Content pages (teardowns, case studies) emit `dateModified` / `datePublished`
 * in their Article JSON-LD, and that is a REAL content timestamp, so it is used
 * where present. Everything else falls back to the build date, which is honest:
 * a static marketing page has no content timestamp more accurate than "the
 * build that produced it". A fabricated per-page date would be worse than a
 * true shared one.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { SITE_ORIGIN, DEFAULT_ORIGIN } from './site-origin.mjs';

const DIST = 'dist';

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const routeOf = (file) => {
  const route = '/' + relative(DIST, file).split(sep).join('/').slice(0, -5);
  if (route === '/index') return '/';
  // dirStyle: 'nested' emits about/index.html; the canonical route is /about.
  return route.endsWith('/index') ? route.slice(0, -'/index'.length) : route;
};

const BUILD_DATE = new Date().toISOString().slice(0, 10);

/** A real content timestamp from the page's Article JSON-LD, if it has one. */
function contentDate(html) {
  const modified = html.match(/"dateModified":"(\d{4}-\d{2}-\d{2})/)?.[1];
  if (modified) return modified;
  return html.match(/"datePublished":"(\d{4}-\d{2}-\d{2})/)?.[1] ?? null;
}

const noindex = (html) =>
  /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html);

const excluded = [];

const pages = walk(DIST)
  .filter((f) => f.endsWith('.html'))
  .map((file) => {
    const html = readFileSync(file, 'utf8');
    return { loc: routeOf(file), html };
  })
  .filter((page) => {
    if (page.loc === '/404') {
      excluded.push(`${page.loc} (404)`);
      return false;
    }
    if (noindex(page.html)) {
      excluded.push(`${page.loc} (noindex)`);
      return false;
    }
    return true;
  })
  .map((page) => ({
    loc: page.loc,
    lastmod: contentDate(page.html) ?? BUILD_DATE,
  }))
  .sort((a, b) => a.loc.localeCompare(b.loc));

/*
  DEFENCE IN DEPTH. Every loc must be an absolute URL on the configured origin,
  and no relative or placeholder URL may reach the file. A sitemap of relative
  paths is silently ignored; a sitemap on the wrong host is worse than none.
*/
const urls = pages
  .map((p) => {
    const loc = `${SITE_ORIGIN}${p.loc === '/' ? '/' : p.loc}`;
    if (!loc.startsWith('https://') && !loc.startsWith('http://')) {
      throw new Error(`sitemap: non-absolute URL "${loc}" — SITE_URL is misconfigured.`);
    }
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${p.lastmod}</lastmod>\n  </url>`;
  })
  .join('\n');

writeFileSync(
  join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);

/*
  robots.txt — §21.7: allow all, reference the sitemap with an ABSOLUTE URL,
  disallow nothing real.

  /api/ is disallowed because it is a POST-only endpoint with nothing to index;
  crawling it produces 405s in the log and no value to anyone.
*/
writeFileSync(
  join(DIST, 'robots.txt'),
  [
    'User-agent: *',
    'Allow: /',
    '',
    '# POST-only lead endpoint. Nothing to index.',
    'Disallow: /api/',
    '',
    `Sitemap: ${SITE_ORIGIN}/sitemap.xml`,
    '',
  ].join('\n'),
);

console.log(`\nsitemap.xml — ${pages.length} indexable routes on ${SITE_ORIGIN}`);
for (const p of pages) console.log(`  ${p.loc}  (${p.lastmod})`);
if (excluded.length > 0) {
  console.log(`\n  excluded: ${excluded.join(', ')}`);
}
if (SITE_ORIGIN === DEFAULT_ORIGIN) {
  console.log(`\n  Using the default production origin. Set SITE_URL to override.`);
}
