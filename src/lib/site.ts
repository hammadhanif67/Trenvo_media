/* ---------------------------------------------------------------------------
   SITE ORIGIN + IDENTITY — the one place the production domain is defined.

   master.md §21.1 requires a canonical on every page and one resolved host.
   §21.7 requires an absolute sitemap. §21.6 requires an absolute og:image —
   every scraper ignores a relative one.

   THE DOMAIN IS NOT WRITTEN HERE. `__SITE_ORIGIN__` is a compile-time constant
   injected by vite.config.ts, which resolves it through scripts/site-origin.mjs
   — the same module the sitemap and robots generators import. One resolution
   path, one default, no drift between the HTML and the sitemap.

   ⚠ The literal below is a LAST-RESORT guard for a non-Vite context (a unit
   test, a node script importing this module directly), not a second source of
   truth. It matches DEFAULT_ORIGIN in scripts/site-origin.mjs — the www host,
   because the apex 308-redirects to it. Change it there, and here, together.

   The empty-string check matters: an environment variable defined but blank is
   how production came to ship `canonical="/"`. See resolveOrigin().

   Override for a preview deploy with the `SITE_URL` environment variable.
--------------------------------------------------------------------------- */

/**
 * Injected by Vite's `define`. Declared in src/vite-env.d.ts.
 *
 * The `typeof` guard is for the vitest/node contexts that evaluate this module
 * outside a Vite transform, where the identifier would otherwise be a
 * ReferenceError rather than merely undefined.
 */
export const SITE_ORIGIN: string =
  typeof __SITE_ORIGIN__ === 'string' && __SITE_ORIGIN__ !== ''
    ? __SITE_ORIGIN__
    : 'https://www.trenvomedia.com';

/** Absolute URL for a route, for canonical, og:url, JSON-LD and the sitemap. */
export function absoluteUrl(pathname: string): string {
  return `${SITE_ORIGIN}${pathname === '/' ? '/' : pathname}`;
}

/* -- Company identity ------------------------------------------------------
   Only facts that are verifiable are stated. Anything requiring a company
   record that has not been supplied is absent rather than invented — see
   VERIFICATION REQUIRED in README.md.
-------------------------------------------------------------------------- */

export const SITE_NAME = 'Trenvo Media';

export const SITE_DESCRIPTION =
  'Trenvo Media runs paid media and creative production as one system — the ads, the creative that runs in them, and the measurement that settles what worked — with one owner and one number.';

/** The real, domain-matched contact address. */
export const CONTACT_EMAIL = 'hello@trenvomedia.com';
