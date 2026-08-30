/**
 * SITEMAP + ROBOTS — master.md §21.7.
 *
 *   node scripts/generate-sitemap.mjs      (runs after `npm run build`)
 *
 * §21.7: "/sitemap.xml generated at build FROM THE ROUTE MANIFEST, lastmod from
 * content timestamps. /robots.txt allows all, references the sitemap, disallows
 * nothing except any preview or staging path."
 *
 * The manifest is dist/ itself: vite-react-ssg pre-renders exactly the routes
 * the router declares, so enumerating the built HTML cannot drift from what
 * actually shipped. A route that failed to render is absent from both.
 *
 * lastmod comes from each file's mtime — the build that produced it.
 */
import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const DIST = 'dist';

// No domain exists yet. A sitemap full of absolute URLs on a guessed host is
// worse than no sitemap, so this refuses to invent one: set SITE_ORIGIN when
// the domain is registered. Mirrors src/lib/site.ts.
const ORIGIN_NOT_SET = 'https://DOMAIN-NOT-SET.invalid';
const ORIGIN = (process.env.SITE_ORIGIN ?? ORIGIN_NOT_SET).replace(/\/$/, '');

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const pages = walk(DIST)
  .filter((f) => f.endsWith('.html'))
  .map((f) => {
    const route = '/' + relative(DIST, f).split(sep).join('/').slice(0, -5);
    return {
      loc: route === '/index' ? '/' : route,
      lastmod: statSync(f).mtime.toISOString().slice(0, 10),
    };
  })
  // A 404 must never be advertised as a destination.
  .filter((p) => p.loc !== '/404')
  .sort((a, b) => a.loc.localeCompare(b.loc));

const urls = pages
  .map(
    (p) =>
      `  <url>\n    <loc>${ORIGIN}${p.loc === '/' ? '/' : p.loc}</loc>\n    <lastmod>${p.lastmod}</lastmod>\n  </url>`,
  )
  .join('\n');

writeFileSync(
  join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);

// §21.7 — allow all, reference the sitemap, disallow nothing real.
writeFileSync(
  join(DIST, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`,
);

if (ORIGIN === ORIGIN_NOT_SET) {
  console.warn(
    '  ! SITE_ORIGIN is not set. sitemap.xml and robots.txt reference a placeholder host.',
  );
  console.warn('    Set it before deploying (master.md §21.1, §21.7).');
}

console.log(`sitemap.xml — ${pages.length} routes`);
for (const p of pages) console.log(`  ${p.loc}`);
