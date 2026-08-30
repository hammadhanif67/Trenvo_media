/* ---------------------------------------------------------------------------
   SITE ORIGIN — the one place the production domain is defined.

   master.md §21.1 requires a canonical on every page and one resolved host.
   §21.7 requires an absolute sitemap. §21.6 requires an absolute og:image —
   every scraper ignores a relative one.

   All of those need an origin, and NO DOMAIN EXISTS YET. Guessing one is worse
   than having none: a canonical pointing at a domain Trenvo does not own tells
   crawlers the real page is somewhere else, and a sitemap full of dead absolute
   URLs is worse than no sitemap.

   So the origin is configuration, not a constant:

     · set VITE_SITE_ORIGIN (build) / SITE_ORIGIN (node scripts) when the
       domain is registered — see .env.example
     · until then it falls back to the placeholder below, and `npm run audit`
       FAILS on it, so the site cannot be shipped with a guessed domain by
       accident

   The placeholder is deliberately not a plausible domain. It must never be
   mistaken for a real one in a diff or a log.
--------------------------------------------------------------------------- */

/** Sentinel value. The audit fails while this is what ships. */
export const ORIGIN_NOT_SET = 'https://DOMAIN-NOT-SET.invalid';

/**
 * `.invalid` is reserved by RFC 2606 precisely so it can never resolve, which
 * is what makes this safe to ship into a preview build without misdirecting a
 * crawler to somebody else's site.
 */
export const SITE_ORIGIN: string =
  (import.meta.env['VITE_SITE_ORIGIN'] as string | undefined)?.replace(/\/$/, '') ??
  ORIGIN_NOT_SET;

/** True while the domain is still unknown. */
export const originIsPlaceholder = SITE_ORIGIN === ORIGIN_NOT_SET;

/** Absolute URL for a route, for canonical, og:url and JSON-LD. */
export function absoluteUrl(pathname: string): string {
  return `${SITE_ORIGIN}${pathname === '/' ? '/' : pathname}`;
}
