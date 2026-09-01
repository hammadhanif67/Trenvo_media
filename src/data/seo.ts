import type { SeoMeta } from '../types/content';
import { SERVICES } from './services';

/* ---------------------------------------------------------------------------
   PER-ROUTE SEO — master.md §21.2.

   EVERY indexable route has a UNIQUE title and a UNIQUE description. That is
   checked, not assumed: scripts/audit-build.mjs fails the build on a duplicate
   title, a duplicate description, a missing canonical, or a route in the
   manifest with no entry here.

   TITLES are intent-based — written around what a buyer types (paid media,
   performance creative, AI video, Meta Ads, Google Ads, measurement, ad
   teardowns) as readable phrases rather than keyword strings. Nothing is
   repeated for its own sake; a title that reads like a list is one a human
   skips in the results.

   §21.6: og:title mirrors the page's H1, NOT the SEO title, because the two do
   different jobs — the SEO title is a search result, the og:title is what a
   human reads in a link preview.

   `noindex` marks routes that must not be indexed but must still be crawlable
   so their links pass (robots `noindex, follow`). They are also excluded from
   the sitemap — see scripts/routes.mjs.
--------------------------------------------------------------------------- */

export interface RouteSeo extends SeoMeta {
  /** §21.6 — mirrors the page H1 rather than the SEO title. */
  ogTitle: string;
  /**
   * Emit `robots: noindex, follow` and exclude from the sitemap.
   * Legal pages only — they have to exist and be linked, and have no business
   * competing for a search result.
   */
  noindex?: boolean;
}

const SITE = 'Trenvo Media';

export const ROUTE_SEO: Record<string, RouteSeo> = {
  '/': {
    title: 'Paid Media & Creative Production, Run as One System | Trenvo Media',
    description:
      'Trenvo Media runs paid media, performance creative and measurement as one system — one owner, one number, and a named specialist on every discipline.',
    ogTitle: 'Paid media and creative production as one system.',
  },

  /* -- Services ----------------------------------------------------------- */
  '/services': {
    title: `Paid Media & Creative Services | ${SITE}`,
    description:
      'Two practices, one loop. Meta Ads, Google Ads and measurement alongside performance creative, AI video and short-form video ads.',
    ogTitle: 'Two practices. One loop.',
  },

  /* -- Company ------------------------------------------------------------ */
  '/process': {
    title: `How We Work — Read, Make, Run, Learn | ${SITE}`,
    description:
      'Week one is a diagnosis with defined deliverables, not a discovery call. How the loop runs, what you get, and what we need from you.',
    ogTitle: 'Week one is a diagnosis, not a discovery call.',
  },
  '/pricing': {
    title: `Pricing & Engagement Models | ${SITE}`,
    description:
      'How Trenvo engagements are structured and priced, what sits inside a cycle, and what we will tell you before you ask.',
    ogTitle: 'What an engagement costs, and how it is structured.',
  },
  '/about': {
    title: `About Trenvo Media — The Specialist Model`,
    description:
      'Why we run media and creative under one roof, the disciplines that do the work, the boundary each one publishes, and who we are not for.',
    ogTitle: 'We exist because the seam costs more than the work.',
  },
  '/careers': {
    title: `Careers — How We Hire Specialists | ${SITE}`,
    description:
      'What we look for in a media or creative specialist, how the hiring standard works, and how to reach us if that describes you.',
    ogTitle: 'How we hire, and what we will not compromise on.',
  },
  '/contact': {
    title: `Contact Trenvo Media`,
    description:
      'Start a conversation with the specialists who would do the work. Tell us what you sell, what you are spending, and what is not working.',
    ogTitle: 'Tell us what you are building.',
  },

  /* -- Proof and the offer ------------------------------------------------ */
  '/work': {
    title: `Selected Work & Case Studies | ${SITE}`,
    description:
      'Builds, reels and campaigns, labelled for exactly what they are. Measured results appear here only once they have been measured.',
    ogTitle: 'Selected work.',
  },
  '/teardowns': {
    title: `Ad & Creative Teardowns | ${SITE}`,
    description:
      'Specialist analyses of real, publicly visible ads and ad creative — observation, hypothesis, what we would test, and how we would measure it.',
    ogTitle: 'We publish our thinking. Read it before you hire us.',
  },
  '/teardown': {
    title: `Request a Free Ad Teardown | ${SITE}`,
    description:
      'A specialist read of your ads, your creative and the page they land on. No call required, no deck, and nothing asked of you first.',
    ogTitle: 'A free teardown of your ads and creative.',
  },

  /* -- Policy ------------------------------------------------------------- */
  '/ai-policy': {
    title: `Our AI Policy — Where AI Is Used, and Where People Are | ${SITE}`,
    description:
      'Exactly where AI is used in production, where a human reviews it, how synthetic creative is disclosed, and what we do with your data.',
    ogTitle: 'Where we use AI, and where we do not.',
  },

  /* -- Legal. Linked, crawlable, never indexed. --------------------------- */
  '/privacy': {
    title: `Privacy | ${SITE}`,
    description:
      'What data Trenvo Media collects, why, how long it is kept, and what you own throughout an engagement.',
    ogTitle: 'Privacy',
    noindex: true,
  },
  '/terms': {
    title: `Terms | ${SITE}`,
    description:
      'The terms of a Trenvo Media engagement, including ownership of accounts and assets.',
    ogTitle: 'Terms',
    noindex: true,
  },
  '/dpa': {
    title: `Data Processing Addendum | ${SITE}`,
    description:
      'The data processing terms that apply when Trenvo Media handles personal data on your behalf.',
    ogTitle: 'Data Processing Addendum',
    noindex: true,
  },
};

/**
 * The service pages supply their own copy from data/services.ts, so the
 * taxonomy and the metadata cannot drift.
 */
for (const service of SERVICES) {
  ROUTE_SEO[`/services/${service.slug}`] = {
    ...service.seo,
    ogTitle: service.name,
  };
}

/**
 * §28.5 bars non-null assertions, and rightly: `ROUTE_SEO['/404']!` asserts a
 * key exists that a later edit could remove, turning a compile-time guarantee
 * into a runtime crash. The fallback is a real constant instead, so the
 * function is total by construction.
 *
 * A 404 is noindex for the obvious reason.
 */
const NOT_FOUND_SEO: RouteSeo = {
  title: `Page not found | ${SITE}`,
  description:
    'That page does not exist. Everything we do sits inside two practices — media and creative.',
  ogTitle: 'That page does not exist.',
  noindex: true,
};

export function getRouteSeo(pathname: string): RouteSeo {
  return ROUTE_SEO[pathname] ?? NOT_FOUND_SEO;
}

/** Every route that carries metadata here. Used by the build audit. */
export const SEO_ROUTES: string[] = Object.keys(ROUTE_SEO);

/** Routes that must be excluded from the sitemap. */
export const NOINDEX_ROUTES: string[] = Object.entries(ROUTE_SEO)
  .filter(([, seo]) => seo.noindex)
  .map(([route]) => route);
