/**
 * DYNAMIC-ROUTE INDEXABILITY — regression check.
 *
 *   node scripts/check-dynamic-seo.mjs
 *
 * ---------------------------------------------------------------------------
 * THE DEFECT THIS EXISTS TO CATCH
 *
 * /teardowns/:slug and /work/:slug had no entry in ROUTE_SEO, so getRouteSeo()
 * fell through to NOT_FOUND_SEO — which is `noindex: true`, because it describes
 * a 404. The detail pages pass their own title, description and ogTitle but NOT
 * `noindex`, so `noindex ?? route.noindex` resolved to the 404's `true`.
 *
 * Every published teardown and case study would therefore have shipped
 * `<meta name="robots" content="noindex, follow">`, and generate-sitemap.mjs
 * would have dropped the URL, because it excludes exactly that tag. The site's
 * only proof asset would have been invisible to search from the moment it was
 * published.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS CHECK IS NOT PART OF audit-build.mjs
 *
 * audit-build.mjs reads dist/. It CANNOT catch this today, for two reasons:
 *
 *   1. data/teardowns.ts and data/work.ts are empty, so no such page is built.
 *      There is nothing in dist/ to inspect.
 *   2. Its "every indexable route is in the sitemap" test SKIPS pages marked
 *      noindex — so a wrongly-noindexed page passes vacuously. An absence-based
 *      check cannot detect a page that removed itself.
 *
 * So this check works on the SEO MODULE ITSELF, with fixtures, and therefore
 * works before any content exists — which is the entire point. It has to guard
 * the system BEFORE teardown #1 is written, not after.
 *
 * ---------------------------------------------------------------------------
 * HOW IT EVALUATES TYPESCRIPT WITHOUT A TEST FRAMEWORK
 *
 * It asks Vite — already the project's bundler and already a devDependency — to
 * bundle src/data/seo.ts for the SSR target, then imports the result. No new
 * dependency, no second module resolver, and the module graph is resolved
 * exactly as it is in production. A hand-rolled reimplementation of the
 * resolution logic would be the one thing guaranteed not to catch a regression
 * in the real one.
 *
 * ⚠ THE FIXTURES BELOW NEVER REACH THE SITE. They live in this file, are passed
 * to the exported generators, and are discarded. data/teardowns.ts and
 * data/work.ts stay empty; this check deliberately does NOT write content in
 * order to test content plumbing.
 */
import { build } from 'vite';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

let failures = 0;
const results = [];

const assert = (ok, label, detail = '') => {
  if (!ok) failures++;
  results.push(`  ${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? '  — ' + detail : ''}`);
};

/* -- Fixtures. Shaped like the real types; never published. ---------------- */

const TEARDOWN_FIXTURE = {
  slug: 'fixture-teardown',
  subject: 'Fixture teardown subject',
  summary: 'Fixture summary used only by scripts/check-dynamic-seo.mjs.',
  category: 'Fixture category',
  disciplineId: 'performance-creative-strategist',
  observedAt: 'Fixture source',
  problem: 'x',
  observation: 'x',
  analysis: 'x',
  whatWeWouldChange: 'x',
  why: 'x',
  howWeWouldMeasure: 'x',
  expectedImpact: 'x',
  limits: 'x',
  serviceSlug: 'performance-creative',
  datePublished: '2026-01-01',
};

const WORK_FIXTURE = {
  kind: 'project',
  slug: 'fixture-case-study',
  client: 'Fixture client',
  objective: 'x',
  startingPoint: 'x',
  context: 'Fixture case study context',
  diagnosis: 'Fixture diagnosis used only by scripts/check-dynamic-seo.mjs.',
  hypothesis: 'x',
  strategy: 'x',
  built: [],
  media: 'x',
  testDesign: 'x',
  measurement: 'x',
  timeframe: 'x',
  tools: [],
  disciplineIds: [],
  serviceSlugs: ['performance-creative'],
  datePublished: '2026-01-01',
};

/** Mirrors the resolution in components/Seo.tsx, which is what actually ships. */
const robotsFor = (routeSeo, explicitNoindex) =>
  (explicitNoindex ?? routeSeo.noindex) ? 'noindex, follow' : undefined;

const outDir = mkdtempSync(join(tmpdir(), 'trenvo-seo-check-'));

try {
  await build({
    logLevel: 'error',
    configFile: false,
    define: { __SITE_ORIGIN__: JSON.stringify('https://www.trenvomedia.com') },
    build: {
      outDir,
      ssr: true,
      write: true,
      minify: false,
      rollupOptions: {
        input: 'src/data/seo.ts',
        output: { entryFileNames: 'seo.mjs', format: 'es' },
      },
    },
  });

  const seo = await import(pathToFileURL(join(outDir, 'seo.mjs')).href);

  console.log('\nDYNAMIC-ROUTE SEO CHECK\n');

  /* -- 1. The generators produce INDEXABLE metadata ----------------------- */

  const teardownSeo = seo.teardownRouteSeo(TEARDOWN_FIXTURE);
  assert(
    robotsFor(teardownSeo, undefined) === undefined,
    'a valid teardown is INDEXABLE (no robots meta emitted)',
    robotsFor(teardownSeo, undefined) ?? '',
  );
  assert(
    teardownSeo.noindex !== true,
    'teardown metadata does not carry noindex',
  );
  assert(
    teardownSeo.title.includes(TEARDOWN_FIXTURE.subject),
    'teardown title derives from its subject',
  );
  assert(
    teardownSeo.description === TEARDOWN_FIXTURE.summary,
    'teardown description derives from its summary',
  );

  const workSeo = seo.caseStudyRouteSeo(WORK_FIXTURE);
  assert(
    robotsFor(workSeo, undefined) === undefined,
    'a valid case study is INDEXABLE (no robots meta emitted)',
    robotsFor(workSeo, undefined) ?? '',
  );
  assert(workSeo.noindex !== true, 'case study metadata does not carry noindex');
  assert(
    workSeo.title.includes(WORK_FIXTURE.context),
    'case study title derives from its context',
  );

  /* -- 2. Unknown slugs must STILL be noindex ----------------------------- */

  const unknownTeardown = seo.getRouteSeo('/teardowns/does-not-exist');
  assert(
    robotsFor(unknownTeardown, undefined) === 'noindex, follow',
    'a nonexistent teardown slug stays NOINDEX',
  );

  const unknownWork = seo.getRouteSeo('/work/does-not-exist');
  assert(
    robotsFor(unknownWork, undefined) === 'noindex, follow',
    'a nonexistent work slug stays NOINDEX',
  );

  /* -- 3. The 404 and legal pages are unchanged --------------------------- */

  assert(
    robotsFor(seo.getRouteSeo('/404'), undefined) === 'noindex, follow',
    'the 404 fallback is still noindex',
  );
  for (const legal of ['/privacy', '/terms', '/dpa']) {
    assert(
      robotsFor(seo.getRouteSeo(legal), undefined) === 'noindex, follow',
      `${legal} is still noindex`,
    );
  }

  /* -- 4. Real indexable routes did not regress --------------------------- */

  for (const route of ['/', '/teardowns', '/work', '/services/ai-video']) {
    assert(
      robotsFor(seo.getRouteSeo(route), undefined) === undefined,
      `${route} is still indexable`,
    );
  }

  /* -- 5. The wiring itself ----------------------------------------------
     Guards the case where the generators exist but nothing calls them — which
     would reintroduce the exact defect while every assertion above still
     passed. With empty collections this is vacuous and says so.
  ----------------------------------------------------------------------- */

  const dynamicRoutes = seo.SEO_ROUTES.filter(
    (r) => r.startsWith('/teardowns/') || r.startsWith('/work/'),
  );
  const noindexDynamic = dynamicRoutes.filter((r) => seo.getRouteSeo(r).noindex);
  assert(
    noindexDynamic.length === 0,
    'every published dynamic route is indexable',
    dynamicRoutes.length === 0
      ? 'no teardowns or case studies published yet — vacuous, activates with content'
      : `${dynamicRoutes.length} published`,
  );

  console.log(results.join('\n'));
  console.log(
    `\n${failures === 0 ? 'Dynamic-route SEO is correct.' : `${failures} check(s) FAILED.`}\n`,
  );
} finally {
  rmSync(outDir, { recursive: true, force: true });
}

process.exit(failures === 0 ? 0 : 1);
