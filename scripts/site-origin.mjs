/**
 * THE PRODUCTION ORIGIN — one source of truth, shared by the build and by
 * every node script (sitemap, robots, audit).
 *
 * ONE VARIABLE NAME: `SITE_URL`. Vite only exposes `VITE_`-prefixed variables
 * to client code, so vite.config.ts reads this module and injects the resolved
 * value as a compile-time constant (`__SITE_ORIGIN__`). Nothing in src/ reads
 * process.env, and the domain is written down in exactly one place: DEFAULT_ORIGIN.
 *
 * Precedence: SITE_URL -> VITE_SITE_URL -> DEFAULT_ORIGIN.
 *
 * Setting SITE_URL is how a preview deployment points canonical/OG/sitemap at
 * its own host instead of production.
 */

/**
 * The production origin. This is the ONLY place the domain is written.
 *
 * ⚠ IT IS THE www HOST, AND THAT IS NOT A STYLE CHOICE — IT IS MEASURED.
 *
 * DNS is live and the domain is connected. Verified 1 September 2026:
 *
 *   https://trenvomedia.com/      -> 308 -> https://www.trenvomedia.com/
 *   https://www.trenvomedia.com/  -> 200  (Vercel)
 *   http://trenvomedia.com/       -> 308 -> https://trenvomedia.com/
 *
 * The apex permanently redirects to www, so www is the host that actually
 * answers 200 and is therefore the canonical origin. Pointing canonical,
 * og:url and the sitemap at the apex would make every one of them a URL that
 * redirects — which Search Console reports as a soft error on a sitemap, and
 * which wastes a hop on every crawl and every shared link.
 *
 * If the redirect is ever reversed at the DNS/host level so the apex serves 200
 * directly, change this ONE line and everything follows.
 */
export const DEFAULT_ORIGIN = 'https://www.trenvomedia.com';

const stripTrailingSlash = (value) => value.replace(/\/+$/, '');

/**
 * Resolve the origin for the current environment. Never returns a trailing slash.
 *
 * ⚠ `||` AND NOT `??`, DELIBERATELY.
 *
 * The previous implementation used `process.env.SITE_ORIGIN ?? FALLBACK`, and
 * the host had `SITE_ORIGIN` defined as an EMPTY STRING. `??` only falls back
 * on null/undefined, so the origin resolved to '' and production shipped
 * `canonical="/"`, `og:url="/"`, `og:image="/brand/og-default.png"` and a
 * sitemap of relative <loc> values — every one of them silently ignored by
 * crawlers and scrapers. Verified against the live site before this fix.
 *
 * `||` treats an empty or whitespace-only value as "not set", which is what an
 * empty environment variable actually means.
 */
export function resolveOrigin(env = process.env) {
  const raw = (env.SITE_URL || env.VITE_SITE_URL || '').trim();
  return stripTrailingSlash(raw || DEFAULT_ORIGIN);
}

export const SITE_ORIGIN = resolveOrigin();

/** Absolute URL for a route path. Mirrors absoluteUrl() in src/lib/site.ts. */
export function absoluteUrl(pathname, origin = SITE_ORIGIN) {
  return `${origin}${pathname === '/' ? '/' : pathname}`;
}
