/**
 * BUILD AUDIT — run against dist/ after `npm run build`.
 *
 *   node scripts/audit-build.mjs
 *
 * The point of this file is to make a whole CLASS of mistake impossible to
 * ship, rather than to catch instances of it in review. Every check below
 * exists because the corresponding bug either shipped on this project or was
 * one edit away from shipping.
 *
 * TWO SECTIONS, WITH DIFFERENT CONSEQUENCES:
 *
 *   CORRECTNESS  — a code defect. Fails the build (exit 1). These are things a
 *                  developer can and must fix.
 *
 *   LAUNCH GATES — real business content that has not been supplied. Reported
 *                  loudly, listed in full, but does NOT fail the build: no code
 *                  change can satisfy them, so a permanently red CI would just
 *                  train everyone to ignore it. `--strict` promotes them to
 *                  failures, which is what the pre-launch check should run.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const DIST = 'dist';
const STRICT = process.argv.includes('--strict');

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const htmlFiles = walk(DIST).filter((f) => f.endsWith('.html'));

/**
 * The public route a built file answers on.
 *
 * `dirStyle: 'nested'` emits about/index.html for /about, so the trailing
 * `/index` MUST be stripped — without it the audit compared `/404/index`
 * against `/404` and reported the branded 404 as a duplicate title of itself.
 */
const routeOf = (file) => {
  const route = '/' + relative(DIST, file).split(sep).join('/').slice(0, -5);
  if (route === '/index') return '/';
  return route.endsWith('/index') ? route.slice(0, -'/index'.length) : route;
};

/** Every route that actually shipped, deduplicated (404.html and 404/ collide). */
const pages = new Set(htmlFiles.map(routeOf));
const known = new Set(pages);

/**
 * Patterns that would signal fabricated proof reaching the HTML.
 *
 * 'trusted by growth-focused brands' is here because that heading stood over
 * five client names with no case study, no quote and no engagement behind any
 * of them. data/clients.ts gates it behind PUBLISH_CLIENTS; this is what stops
 * it returning by accident. Opening that gate legitimately means opening it
 * WITH proof underneath, and updating this list in the same commit.
 *
 * 'no quote published yet' is here for the same reason: it was rendered on five
 * testimonial cards, which advertises the absence of proof in the shape of
 * proof.
 */
const BANNED = [
  'coming soon',
  'lorem ipsum',
  'your logo here',
  'placeholder',
  'trusted by growth-focused brands',
  'no quote published yet',
  'case studies coming soon',
];

let failures = 0;
let gateWarnings = 0;

const report = (ok, label, detail = '') => {
  if (!ok) failures++;
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? '  ' + detail : ''}`);
};

const gate = (ok, label, detail = '') => {
  if (!ok) {
    if (STRICT) failures++;
    else gateWarnings++;
  }
  console.log(
    `  ${ok ? 'PASS' : STRICT ? 'FAIL' : 'GATE'}  ${label}${detail ? '  ' + detail : ''}`,
  );
};

console.log(`\nBUILD AUDIT — ${pages.size} routes${STRICT ? ' (strict)' : ''}\n`);

const multipleH1 = [];
const multipleMain = [];
const rootIssues = [];
const skipped = [];
const broken = new Map();
const banned = new Map();
const headIssues = [];
const deadCtas = [];
const titles = new Map();
const descriptions = new Map();
const placeholderOrigin = new Set();
const routesWithSocial = new Set();
const noindexedContent = [];
const missingMeta = [];

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const route = routeOf(file);

  /* ------------------------------------------------------------------------
     SINGLE RENDER — the Phase 1 invariant, checked in the shipped HTML.

     If the app ever mounts twice, the page carries two <main> elements and two
     <h1> elements and the first copy is inert. This cannot catch a duplicate
     introduced at RUNTIME by the mount (src/lib/mountGuard.ts covers that in
     the browser), but it does catch a prerender that emitted the shell twice,
     and it is the check that stops a regression reaching a reviewer's eyes.
  --------------------------------------------------------------------------- */
  const h1s = html.match(/<h1[\s>]/g) ?? [];
  if (h1s.length !== 1) multipleH1.push(`${route} (${h1s.length})`);

  const mains = html.match(/<main[\s>]/g) ?? [];
  if (mains.length !== 1) multipleMain.push(`${route} (${mains.length})`);

  const roots = html.match(/id="root"/g) ?? [];
  const markers = html.match(/data-server-rendered="true"/g) ?? [];
  if (roots.length !== 1) rootIssues.push(`${route}: ${roots.length} #root`);
  // The marker is what vite-react-ssg branches on to choose hydrate over
  // client-render. Missing it means React 19's createRoot appends a SECOND copy
  // of the page on top of the pre-rendered one.
  if (markers.length !== 1) {
    rootIssues.push(`${route}: ${markers.length} data-server-rendered markers`);
  }

  const levels = [...html.matchAll(/<h([1-4])[\s>]/g)].map((m) => Number(m[1]));
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] - levels[i - 1] > 1) {
      skipped.push(`${route} h${levels[i - 1]}->h${levels[i]}`);
      break;
    }
  }

  /* -- Link integrity. A link counts as resolved if it points at a built page
        OR at a real file in dist. ------------------------------------------ */
  for (const [, href] of html.matchAll(/(?:href|src)="(\/[^"#?]*)"/g)) {
    const clean = href.replace(/\/$/, '') || '/';
    if (known.has(clean)) continue;
    if (existsSync(join(DIST, href.replace(/^\//, '')))) continue;
    if (!broken.has(route)) broken.set(route, new Set());
    broken.get(route).add(href);
  }

  /* -- Dead CTAs. A control that looks interactive and goes nowhere. ------- */
  for (const [, href] of html.matchAll(/<a[^>]*href="(#|)"[^>]*>/g)) {
    deadCtas.push(`${route}: href="${href}"`);
  }

  /* -- Head integrity ------------------------------------------------------ */
  const head = html.match(/<head[^>]*>([\s\S]*?)<\/head>/)?.[1] ?? '';

  const titleTags = head.match(/<title[\s>]/g) ?? [];
  if (titleTags.length !== 1)
    headIssues.push(`${route}: ${titleTags.length} <title> in <head>`);

  const canonicals = html.match(/rel="canonical"[^>]*href="([^"]*)"/g) ?? [];
  if (canonicals.length !== 1) headIssues.push(`${route}: ${canonicals.length} canonical`);

  // Every canonical must be ABSOLUTE. A relative canonical resolves differently
  // on every host and is the classic way a staging domain gets indexed.
  const canonicalHref = html.match(/rel="canonical"[^>]*href="([^"]*)"/)?.[1];
  if (canonicalHref && !/^https?:\/\//.test(canonicalHref)) {
    headIssues.push(`${route}: canonical is relative (${canonicalHref})`);
  }

  const ogUrl = html.match(/property="og:url" content="([^"]*)"/)?.[1];
  if (!ogUrl) headIssues.push(`${route}: no og:url`);
  else if (!/^https?:\/\//.test(ogUrl)) {
    headIssues.push(`${route}: og:url is relative (${ogUrl})`);
  }

  const ogImage = html.match(/property="og:image" content="([^"]*)"/)?.[1];
  if (!ogImage) headIssues.push(`${route}: no og:image`);
  else if (!/^https?:\/\//.test(ogImage)) {
    headIssues.push(`${route}: og:image is relative (${ogImage})`);
  }

  const isNoindex = /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html);

  /*
    DYNAMIC CONTENT ROUTES MUST BE INDEXABLE.

    /teardowns/:slug and /work/:slug had no ROUTE_SEO entry, so getRouteSeo()
    fell through to NOT_FOUND_SEO and every published teardown and case study
    would have shipped `noindex`. The sitemap generator then drops the URL.

    The checks below could not catch that: "every indexable route is in the
    sitemap" SKIPS noindex pages, so a page that had wrongly removed itself
    passed vacuously. An absence-based test cannot detect an absence.

    This is the positive version. It is vacuous while both collections are
    empty and activates the moment content is published — which is when it
    matters. scripts/check-dynamic-seo.mjs guards the same invariant BEFORE any
    content exists, by testing the SEO module directly with fixtures.
  */
  if (isNoindex && /^\/(teardowns|work)\/.+/.test(route)) {
    noindexedContent.push(route);
  }

  /* -- Metadata completeness on every INDEXABLE route ---------------------- */
  const title = head.match(/<title[^>]*>([^<]*)<\/title>/)?.[1] ?? '';
  const description = head.match(/name="description" content="([^"]*)"/)?.[1] ?? '';

  if (!isNoindex && route !== '/404') {
    if (!title) missingMeta.push(`${route}: no title`);
    if (!description) missingMeta.push(`${route}: no meta description`);
    if (!html.includes('property="og:title"')) missingMeta.push(`${route}: no og:title`);
    if (!html.includes('name="twitter:card"'))
      missingMeta.push(`${route}: no twitter:card`);

    // Uniqueness is only meaningful across indexable pages: two noindex legal
    // pages sharing a description would not compete for anything.
    if (title) {
      if (!titles.has(title)) titles.set(title, []);
      titles.get(title).push(route);
    }
    if (description) {
      if (!descriptions.has(description)) descriptions.set(description, []);
      descriptions.get(description).push(route);
    }
  }

  if (html.includes('DOMAIN-NOT-SET.invalid')) placeholderOrigin.add(route);

  /*
    SOCIAL PROFILES — checked POSITIVELY.

    This used to look for the string 'profile not published yet', which an
    unset entry rendered. That test now passes vacuously: unset entries are
    filtered out of SOCIAL_LINKS before render, so the string can never appear
    whether or not any real profile exists. An absence-based check that cannot
    fail is worse than no check.

    So it asserts the opposite — that a real external profile link actually
    reaches the footer.
  */
  if (/href="https:\/\/(www\.)?(linkedin|instagram|facebook|youtube|x|twitter)\.com\//i.test(html)) {
    routesWithSocial.add(route);
  }

  const text = html.replace(/<[^>]+>/g, ' ').toLowerCase();
  for (const phrase of BANNED) {
    if (text.includes(phrase)) {
      if (!banned.has(route)) banned.set(route, new Set());
      banned.get(route).add(phrase);
    }
  }
}

/* -- 1. Single render ------------------------------------------------------ */
console.log('  SINGLE RENDER');
report(rootIssues.length === 0, 'exactly one #root, correctly marked', rootIssues.join(', '));
report(multipleMain.length === 0, 'exactly one <main> per page', multipleMain.join(', '));
report(multipleH1.length === 0, 'exactly one <h1> per page', multipleH1.join(', '));

/* -- 2. Structure and links ------------------------------------------------ */
console.log('\n  STRUCTURE & LINKS');
report(skipped.length === 0, 'no skipped heading levels', skipped.join(', '));
report(
  broken.size === 0,
  'every internal link resolves to a built route or file',
  [...broken].map(([r, v]) => `${r} -> ${[...v].join(' ')}`).join(' | '),
);
report(
  deadCtas.length === 0,
  'no href="#" or empty-href links',
  deadCtas.slice(0, 8).join(' | '),
);

/* -- 3. Metadata ----------------------------------------------------------- */
console.log('\n  METADATA');
report(
  headIssues.length === 0,
  'head integrity (one title, one absolute canonical, absolute og:url and og:image)',
  headIssues.join(' | '),
);
report(
  missingMeta.length === 0,
  'every indexable route carries full metadata',
  missingMeta.join(' | '),
);
report(
  noindexedContent.length === 0,
  'every published teardown and case study is indexable',
  noindexedContent.length > 0
    ? `${noindexedContent.join(', ')} — shipped noindex; see the dynamic-route block in src/data/seo.ts`
    : '',
);

const duplicateTitles = [...titles.entries()].filter(([, routes]) => routes.length > 1);
report(
  duplicateTitles.length === 0,
  'every indexable route has a unique title',
  duplicateTitles.map(([t, r]) => `"${t.slice(0, 40)}" on ${r.join(', ')}`).join(' | '),
);

const duplicateDescriptions = [...descriptions.entries()].filter(
  ([, routes]) => routes.length > 1,
);
report(
  duplicateDescriptions.length === 0,
  'every indexable route has a unique description',
  duplicateDescriptions.map(([d, r]) => `"${d.slice(0, 32)}…" on ${r.join(', ')}`).join(' | '),
);

/* -- 4. The sitemap -------------------------------------------------------- */
console.log('\n  SITEMAP & ROBOTS');
const sitemapPath = join(DIST, 'sitemap.xml');
const robotsPath = join(DIST, 'robots.txt');

if (!existsSync(sitemapPath)) {
  report(false, 'sitemap.xml exists', 'run scripts/generate-sitemap.mjs');
} else {
  const sitemap = readFileSync(sitemapPath, 'utf8');
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

  report(locs.length > 0, 'sitemap.xml lists at least one URL');
  report(
    locs.every((l) => /^https?:\/\//.test(l)),
    'every sitemap URL is absolute',
    locs.filter((l) => !/^https?:\/\//.test(l)).join(', '),
  );

  /*
    THE CHECK THAT MATTERS. 14 of 15 sitemap URLs used to 404, because the
    sitemap listed paths the build never produced. Every <loc> must map to a
    page that actually shipped — which is what "returns 200" means for a static
    site, since the file either exists or it does not.
  */
  const unbuilt = locs
    .map((l) => new URL(l).pathname.replace(/\/$/, '') || '/')
    .filter((p) => !pages.has(p));
  report(
    unbuilt.length === 0,
    'every sitemap URL corresponds to a built page',
    unbuilt.join(', '),
  );

  // And nothing indexable is MISSING from it.
  const indexable = [...pages].filter((route) => {
    if (route === '/404') return false;
    const file = route === '/' ? join(DIST, 'index.html') : join(DIST, route, 'index.html');
    if (!existsSync(file)) return false;
    return !/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(
      readFileSync(file, 'utf8'),
    );
  });
  const sitemapPaths = new Set(
    locs.map((l) => new URL(l).pathname.replace(/\/$/, '') || '/'),
  );
  const missing = indexable.filter((r) => !sitemapPaths.has(r));
  report(
    missing.length === 0,
    'every indexable route is in the sitemap',
    missing.join(', '),
  );

  report(
    !sitemap.includes('/404'),
    'the sitemap does not advertise the 404 page',
  );
}

report(existsSync(robotsPath), 'robots.txt exists');
if (existsSync(robotsPath)) {
  const robots = readFileSync(robotsPath, 'utf8');
  const sitemapLine = robots.match(/^Sitemap:\s*(\S+)/m)?.[1];
  report(
    Boolean(sitemapLine && /^https?:\/\//.test(sitemapLine)),
    'robots.txt references the sitemap with an absolute URL',
    sitemapLine ?? 'no Sitemap: line',
  );
}

/* -- 5. The branded 404 ---------------------------------------------------- */
console.log('\n  404');
report(
  existsSync(join(DIST, '404.html')),
  'dist/404.html exists (hosts serve this, not the router)',
  'run scripts/emit-404.mjs',
);

/* -- 6. Honesty ------------------------------------------------------------ */
console.log('\n  HONESTY');
report(
  banned.size === 0,
  'no fabricated-proof or placeholder language',
  [...banned].map(([r, v]) => `${r}: ${[...v].join(', ')}`).join(' | '),
);
report(
  placeholderOrigin.size === 0,
  'production origin is configured',
  placeholderOrigin.size > 0
    ? `${placeholderOrigin.size} pages reference DOMAIN-NOT-SET.invalid — set SITE_URL`
    : '',
);

/* -- 7. Source-level: the spacing scale ------------------------------------ */
console.log('\n  SOURCE');

/*
 * §25.1 — SPACING UTILITIES MUST BE ON THE SCALE.
 *
 * globals.css resets `--spacing-*` and redefines only the §25.1 steps, so a
 * class like `p-7`, `mt-14` or `py-2.5` compiles to NOTHING. It is not an
 * error, it is not a warning, and the element simply renders with no padding.
 *
 * That failed silently three separate times on this project. This check reads
 * the SOURCE rather than dist, because by the time it reaches the CSS the class
 * has already vanished.
 */
const SPACING_STEPS = new Set([
  '0', '1', '2', '3', '4', '5', '6', '8', '10', '12',
  '16', '20', '24', '32', '40', '50',
  'px', 'auto', 'full',
]);
const SPACING_PROPS =
  'p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|space-x|space-y|size|w|h';
const spacingPattern = new RegExp(
  `(?<![\\w-])(${SPACING_PROPS})-(\\d+(?:\\.\\d+)?)(?![\\w.-])`,
  'g',
);

const offScale = [];
if (existsSync('src')) {
  for (const file of walk('src')) {
    if (!/\.tsx?$/.test(file)) continue;
    const source = readFileSync(file, 'utf8');
    for (const match of source.matchAll(spacingPattern)) {
      if (!SPACING_STEPS.has(match[2])) {
        offScale.push(`${relative('src', file)}: ${match[0]}`);
      }
    }
  }
}

report(
  offScale.length === 0,
  'every spacing utility is on the §25.1 scale',
  offScale.length > 0
    ? `${offScale.length} off-scale class(es) generate no CSS — ${[...new Set(offScale)].slice(0, 6).join(', ')}`
    : '',
);

/* -- 8. Launch gates — real business content, not code --------------------- */
console.log('\n  LAUNCH GATES (real content required — these are not code defects)');
gate(
  routesWithSocial.size === pages.size,
  'a real social profile link reaches every page footer',
  routesWithSocial.size === 0
    ? 'no external social profile link found — set real URLs in src/data/navigation.ts'
    : routesWithSocial.size < pages.size
      ? `only ${routesWithSocial.size}/${pages.size} pages carry one`
      : '',
);

// Teardowns are the documented launch gate: §34.2 and wireframe.md §08 both
// state the site does not go live with fewer than three published.
const teardownPages = [...pages].filter((p) => p.startsWith('/teardowns/'));
gate(
  teardownPages.length >= 3,
  'at least three teardowns are published',
  `${teardownPages.length} published — see src/data/teardowns.ts`,
);

const workPages = [...pages].filter((p) => p.startsWith('/work/'));
gate(
  workPages.length >= 1,
  'at least one case study is published',
  `${workPages.length} published — see src/data/work.ts`,
);

console.log(
  `\n${failures === 0 ? 'All correctness checks passed.' : `${failures} check(s) FAILED.`}` +
    (gateWarnings > 0
      ? `\n${gateWarnings} launch gate(s) outstanding — run with --strict to make these fail.`
      : '') +
    '\n',
);

process.exit(failures === 0 ? 0 : 1);
