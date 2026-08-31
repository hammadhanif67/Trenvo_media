/**
 * BUILD AUDIT — run against dist/ after `npm run build`.
 *
 *   node scripts/audit-build.mjs
 *
 * Checks the invariants the source documents state as requirements, so they are
 * verified rather than assumed:
 *
 *   · exactly one <h1> per page            master.md §21.3, §30.1
 *   · no skipped heading levels            master.md §30.1
 *   · every internal link resolves         wireframe.md §1.4 "no orphans"
 *   · no fabricated-proof language         master.md §20.3, §34.1(5)
 *   · exactly one <title> and one canonical  master.md §21.1, §21.2
 *   · unique title per route                 master.md §21.2, no duplicates
 *   · og:image is an absolute URL            §21.6 — scrapers ignore relative
 *   · the production origin is configured    §21.1 — never ship a guessed domain
 *   · social profile URLs are configured    never ship a link to a guessed handle
 *   · every spacing utility is on the scale  §25.1 — off-scale classes are SILENT
 *
 * A link counts as resolved if it points at a built page OR a real file in
 * dist — an earlier version only whitelisted /assets and reported every
 * favicon as broken.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const DIST = 'dist';

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const htmlFiles = walk(DIST).filter((f) => f.endsWith('.html'));

const routeOf = (f) => {
  const r = '/' + relative(DIST, f).split(sep).join('/').slice(0, -5);
  return r === '/index' ? '/' : r;
};

const pages = new Set(htmlFiles.map(routeOf));
const known = new Set([...pages, '/404']);

/**
 * §20.3, §34.1(5) — patterns that would signal fabricated proof.
 *
 * 'trusted by' was on this list and has been removed. It was only ever a PROXY:
 * a "trusted by" heading with nothing real underneath is the classic fabricated
 * social-proof pattern, and while the site named no clients the phrase alone was
 * a fair signal. The hero now carries a client row the owner supplied by name
 * (see src/components/hero/heroContent.ts and implementation.md §5.25), so the
 * phrase no longer implies the thing this check exists to catch.
 *
 * What the rule actually protected is still enforced: `your logo here` and
 * `placeholder` both stay, so an empty or stubbed proof row still fails the
 * build. Only the heading is allowed, and only because there is now something
 * real beneath it.
 */
const BANNED = ['coming soon', 'lorem ipsum', 'your logo here', 'placeholder'];

let failures = 0;
const report = (ok, label, detail = '') => {
  if (!ok) failures++;
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? '  ' + detail : ''}`);
};

console.log(`\nBUILD AUDIT — ${pages.size} pages\n`);

// 1 — exactly one <h1>
const multipleH1 = [];
// 2 — no skipped heading levels
const skipped = [];
// 3 — link integrity
const broken = new Map();
// 4 — banned language
const banned = new Map();
// 5 — head integrity
const headIssues = [];
const titles = new Map();
// 6 — the production origin must be real before launch
const placeholderOrigin = new Set();
const placeholderSocial = new Set();

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const route = routeOf(file);

  const h1s = html.match(/<h1[\s>]/g) ?? [];
  if (h1s.length !== 1) multipleH1.push(`${route} (${h1s.length})`);

  const levels = [...html.matchAll(/<h([1-4])[\s>]/g)].map((m) => Number(m[1]));
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] - levels[i - 1] > 1) {
      skipped.push(`${route} h${levels[i - 1]}->h${levels[i]}`);
      break;
    }
  }

  for (const [, href] of html.matchAll(/(?:href|src)="(\/[^"#?]*)"/g)) {
    const clean = href.replace(/\/$/, '') || '/';
    if (known.has(clean)) continue;
    if (existsSync(join(DIST, href.replace(/^\//, '')))) continue;
    if (!broken.has(route)) broken.set(route, new Set());
    broken.get(route).add(href);
  }

  // Scope to <head>: SVG <title> elements are accessible names for diagrams
  // (§30.6) and must not be counted as page titles.
  const head = html.match(/<head[^>]*>([\s\S]*?)<\/head>/)?.[1] ?? '';
  const titleTags = head.match(/<title[\s>]/g) ?? [];
  if (titleTags.length !== 1)
    headIssues.push(`${route}: ${titleTags.length} <title> in <head>`);

  const canonicals = html.match(/rel="canonical"/g) ?? [];
  if (canonicals.length !== 1)
    headIssues.push(`${route}: ${canonicals.length} canonical`);

  const title = head.match(/<title[^>]*>([^<]*)<\/title>/)?.[1] ?? '';
  if (title) {
    if (!titles.has(title)) titles.set(title, []);
    titles.get(title).push(route);
  }

  if (html.includes('DOMAIN-NOT-SET.invalid')) placeholderOrigin.add(route);
  // The sentinel itself never reaches the HTML — an unset entry renders as a
  // span, not a link. The sr-only note it carries is the observable signal.
  if (html.includes('profile not published yet')) placeholderSocial.add(route);

  const ogImage = html.match(/property="og:image" content="([^"]*)"/)?.[1];
  if (ogImage && !/^https?:\/\//.test(ogImage)) {
    headIssues.push(`${route}: og:image is relative (${ogImage})`);
  }

  const text = html.replace(/<[^>]+>/g, ' ').toLowerCase();
  for (const phrase of BANNED) {
    if (text.includes(phrase)) {
      if (!banned.has(route)) banned.set(route, new Set());
      banned.get(route).add(phrase);
    }
  }
}

report(multipleH1.length === 0, 'exactly one <h1> per page', multipleH1.join(', '));
report(skipped.length === 0, 'no skipped heading levels', skipped.join(', '));
report(
  broken.size === 0,
  'every internal link resolves',
  [...broken].map(([r, v]) => `${r} -> ${[...v].join(' ')}`).join(' | '),
);
report(
  banned.size === 0,
  'no fabricated-proof language',
  [...banned].map(([r, v]) => `${r}: ${[...v].join(', ')}`).join(' | '),
);

const duplicateTitles = [...titles.entries()].filter(([, routes]) => routes.length > 1);
report(
  headIssues.length === 0,
  'head integrity (one title, one canonical, absolute og:image)',
  headIssues.join(' | '),
);
report(
  duplicateTitles.length === 0,
  'every route has a unique title',
  duplicateTitles.map(([t, r]) => `"${t.slice(0, 40)}" on ${r.join(', ')}`).join(' | '),
);

report(
  placeholderOrigin.size === 0,
  'production origin is configured',
  placeholderOrigin.size > 0
    ? `${placeholderOrigin.size} pages reference DOMAIN-NOT-SET.invalid — set VITE_SITE_ORIGIN and SITE_ORIGIN, see .env.example`
    : '',
);

report(
  placeholderSocial.size === 0,
  'social profile URLs are configured',
  placeholderSocial.size > 0
    ? `${placeholderSocial.size} pages still carry PROFILE-NOT-SET — set the real URLs in src/data/navigation.ts SOCIAL_LINKS`
    : '',
);

/*
 * §25.1 — SPACING UTILITIES MUST BE ON THE SCALE.
 *
 * globals.css resets `--spacing-*` and redefines only the §25.1 steps, so a
 * class like `p-7`, `mt-14` or `py-2.5` compiles to NOTHING. It is not an
 * error, it is not a warning, and the element simply renders with no padding.
 *
 * That failed silently three separate times on this project — py-2.5 on the
 * capability chips, py-1.5 on the stage chips, and p-7 / mt-14 / gap-14 /
 * size-14 across five files, where a card reported `padding: 0px` on a class
 * that looked correct. This check reads the SOURCE rather than dist, because by
 * the time it reaches the CSS the class has already vanished.
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

console.log(
  `\n${failures === 0 ? 'All checks passed.' : `${failures} check(s) failed.`}\n`,
);
process.exit(failures === 0 ? 0 : 1);
