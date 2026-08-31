import type { SeoMeta } from '../types/content';
import { SERVICES } from './services';

/* ---------------------------------------------------------------------------
   PER-ROUTE SEO — master.md §21.2.

   §21.2 supplies title and description for TWELVE routes, transcribed verbatim
   below. Titles are <=60 characters and descriptions <=155, per §21.2.

   SIX routes have no documented metadata: /work, /about, /contact,
   /legal/privacy, /legal/terms and /404. They are written here to §21.2's own
   pattern and marked `directional`. A title is a structural label rather than a
   claim, and every one below describes only what the page contains — no
   number, no client, no result (§18.3 rule 2). Phase 5 replaces them.

   §21.6: og:title mirrors the H1, NOT the SEO title, because the two do
   different jobs — the SEO title is a search result, the og:title is what a
   human reads in a link preview.
--------------------------------------------------------------------------- */

export interface RouteSeo extends SeoMeta {
  /** §21.6 — mirrors the page H1 rather than the SEO title. */
  ogTitle: string;
  /** True where §21.2 supplies no wording for this route. */
  directional?: boolean;
}

const SITE = 'Trenvo Media';

export const ROUTE_SEO: Record<string, RouteSeo> = {
  /* -- Documented in §21.2, verbatim ------------------------------------- */
  '/': {
    title: 'Trenvo Media — Performance Media & Creative Production',
    description:
      'We run the whole loop: the ads, the creative, and the pages they land on — with a named specialist on each discipline.',
    ogTitle: 'AI video ads, creative and paid media, run as one system.',
  },
  '/services': {
    title: `Services — Media & Studio | ${SITE}`,
    description:
      'Two practices, one loop. Paid media and performance creative production under one team, with a named specialist on each.',
    ogTitle: 'Two practices. One loop.',
  },
  '/specialists': {
    title: `Our Specialist Model | ${SITE}`,
    description:
      'Six disciplines, published boundaries, and a named specialist on every part of your account.',
    ogTitle: 'Specialists on your account. Not a generalist with a dashboard.',
  },
  '/process': {
    title: `How We Work — The Loop | ${SITE}`,
    description:
      'Read, Make, Run, Learn. Week one is a diagnosis with defined deliverables, not a discovery call.',
    ogTitle: 'Week one is a diagnosis, not a discovery call.',
  },
  '/teardowns': {
    title: `Ad & Creative Teardowns | ${SITE}`,
    description:
      'We publish our thinking. Specialist analyses of real ads and real ad creative — read them before you hire us.',
    ogTitle: 'We publish our thinking. Read it before you hire us.',
  },

  /* -- Not documented. Written to §21.2's pattern, claim-free. ------------ */
  '/work': {
    title: `Selected Work | ${SITE}`,
    description:
      'Craft samples, production reels and builds, labelled for what they are. Measured results appear only once they are measured.',
    ogTitle: 'Selected work.',
    directional: true,
  },
  '/about': {
    title: `About — Why Trenvo Exists | ${SITE}`,
    description:
      'Two vendors, one funnel, nobody owning the number. We removed the seam by running the whole loop ourselves.',
    ogTitle: 'We exist because the seam costs more than the work.',
    directional: true,
  },
  '/contact': {
    title: `Contact | ${SITE}`,
    description:
      'Two ways in: start a project, or get a specialist read of your ads and creative before anything is asked of you.',
    ogTitle: 'Tell us what you are building.',
    directional: true,
  },
  '/legal/privacy': {
    title: `Privacy | ${SITE}`,
    description:
      'How Trenvo Media handles the data you share, and what you own throughout an engagement.',
    ogTitle: 'Privacy',
    directional: true,
  },
  '/legal/terms': {
    title: `Terms | ${SITE}`,
    description:
      'The terms of a Trenvo Media engagement, including ownership of accounts and assets.',
    ogTitle: 'Terms',
    directional: true,
  },
};

/** §21.2 supplies all seven service pages; they live in data/services.ts. */
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
 */
const NOT_FOUND_SEO: RouteSeo = {
  title: `Page not found | ${SITE}`,
  description: 'That page does not exist. Everything we do sits inside two practices.',
  ogTitle: 'That page does not exist.',
  directional: true,
};

export function getRouteSeo(pathname: string): RouteSeo {
  return ROUTE_SEO[pathname] ?? NOT_FOUND_SEO;
}
