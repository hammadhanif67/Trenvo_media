/**
 * EMIT dist/404.html
 *
 *   node scripts/emit-404.mjs      (runs after `npm run build`)
 *
 * ---------------------------------------------------------------------------
 * THE BUG THIS FIXES
 *
 * app/router.tsx has always carried `path: '*'` rendering the branded NotFound
 * page, and that works perfectly for a client-side navigation to a bad URL.
 *
 * It does nothing at all for a visitor who TYPES a bad URL, follows a stale
 * inbound link, or lands from a search result on a page that has moved. A
 * static host never reaches React in that case: it looks for a file, does not
 * find one, and serves its own default — the grey unstyled page with the host's
 * name on it. Measured before this script: dist/ contained no 404 file of any
 * kind, so every hard 404 on the deployed site was the platform's.
 *
 * ---------------------------------------------------------------------------
 * THE FIX
 *
 * The router gives the catch-all a `getStaticPaths` returning `/404`, so
 * vite-react-ssg prerenders the branded page to dist/404/index.html. This copies
 * it to dist/404.html, which is the filename Vercel, Netlify, S3 and nginx all
 * look for by convention.
 *
 * BOTH FILES ARE KEPT. /404.html is what the host serves automatically;
 * /404/index.html means the URL /404 also resolves, which is useful for testing
 * the page and harmless otherwise. Neither is advertised: the page ships
 * `noindex` (data/seo.ts) and the sitemap generator excludes it explicitly.
 */
import { copyFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const SOURCE = join('dist', '404', 'index.html');
const TARGET = join('dist', '404.html');

if (!existsSync(SOURCE)) {
  console.error(
    `\n  emit-404: ${SOURCE} was not built.\n` +
      `  The catch-all route in src/app/router.tsx must declare\n` +
      `  getStaticPaths: () => ['/404'] for the branded 404 to be prerendered.\n`,
  );
  process.exit(1);
}

copyFileSync(SOURCE, TARGET);
console.log(`404.html — branded not-found page emitted`);
