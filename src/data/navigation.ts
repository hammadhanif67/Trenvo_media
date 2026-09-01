import { PRACTICES, SERVICES, servicesInPractice } from './services';
import type { PracticeDefinition } from './services';
import type { PracticeId } from '../types/content';
import { CONTACT_EMAIL } from '../lib/site';

/* ---------------------------------------------------------------------------
   NAVIGATION — DERIVED, not written.

   ⚠ THIS FILE USED TO HAND-MAINTAIN THE MENU. It listed the mega-menu columns
   as literal arrays, and data/home.ts listed a third, longer set of
   "capabilities" on the practice cards. They drifted: the homepage advertised
   AI UGC Ads, Short-Form Video Ads and Motion Design, the menu showed none of
   them, and only some had pages at all.

   Everything structural below is now computed from data/services.ts. Adding a
   service adds it to the mega-menu, the footer and the /services grid at once,
   and it is impossible for one of them to disagree with another.

   Only three things are still written by hand, because they are editorial
   rather than structural: PRIMARY_NAV's ordering, the CTA labels, and the
   footer's Company/Resources columns.
--------------------------------------------------------------------------- */

export interface NavLink {
  label: string;
  href: string;
}

export interface PracticeNav extends PracticeDefinition {
  /** The routed service pages inside this practice. */
  services: NavLink[];
}

const serviceLink = (slug: string, label: string): NavLink => ({
  label,
  href: `/services/${slug}`,
});

/** Mega-menu and footer columns, one per practice, derived from SERVICES. */
export const PRACTICE_NAV: PracticeNav[] = PRACTICES.map((practice) => ({
  ...practice,
  services: servicesInPractice(practice.id).map((s) => serviceLink(s.slug, s.name)),
}));

/** Every service as a flat link list — used by the 404 page and the sitemap. */
export const ALL_SERVICE_LINKS: NavLink[] = SERVICES.map((s) =>
  serviceLink(s.slug, s.name),
);

export function practiceNav(id: PracticeId): PracticeNav | undefined {
  return PRACTICE_NAV.find((p) => p.id === id);
}

/* -- Primary navigation ----------------------------------------------------
   The requested header set: Services, Process, Work, Teardowns, About,
   Contact. Services is the mega-menu trigger and Contact is the header action,
   so four links are rendered between them.

   Contact is reachable in one click from every page — as the header button on
   desktop, and from the mobile drawer and the sticky mobile action bar.
-------------------------------------------------------------------------- */

export const PRIMARY_NAV: NavLink[] = [
  { label: 'Process', href: '/process' },
  { label: 'Work', href: '/work' },
  { label: 'Teardowns', href: '/teardowns' },
  { label: 'About', href: '/about' },
];

/**
 * §17.2 Tier 1 — the persistent header action.
 *
 * ⚠ THIS IS NO LONGER /contact. The teardown is the lower-friction first step
 * and the primary conversion path: it asks for less, delivers something before
 * asking for anything, and qualifies harder than a contact form does. /contact
 * remains one click away in the header nav and the footer.
 */
export const PRIMARY_CTA: NavLink = {
  label: 'Request a free teardown',
  href: '/teardown',
};

/** A shorter label for the places the full one will not fit. */
export const PRIMARY_CTA_SHORT: NavLink = {
  label: 'Free teardown',
  href: '/teardown',
};

/** §17.2 Tier 2 — the higher-intent path, for buyers who are already ready. */
export const SECONDARY_CTA: NavLink = { label: 'Start a conversation', href: '/contact' };

/**
 * The mega-menu footer row — master.md §11.2 calls it "the highest-value pixel
 * in the navigation" because it makes the structural argument in one line.
 */
export const LOOP_LINK: NavLink = {
  label: 'The Loop — how the two practices work as one system',
  href: '/services',
};

/** §11.2's mega-menu CTA. */
export const MEGA_MENU_CTA: NavLink = PRIMARY_CTA;

/* -- Footer ----------------------------------------------------------------
   Four columns. Media and Creative are derived from the taxonomy; Company and
   Resources are editorial and written here.
-------------------------------------------------------------------------- */

export const COMPANY_NAV: NavLink[] = [
  { label: 'About', href: '/about' },
  { label: 'Process', href: '/process' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
  { label: 'Careers', href: '/careers' },
];

export const RESOURCES_NAV: NavLink[] = [
  { label: 'Teardowns', href: '/teardowns' },
  { label: 'Free teardown', href: '/teardown' },
  { label: 'Work', href: '/work' },
  { label: 'AI policy', href: '/ai-policy' },
];

/** The legal row. Every one of these is noindex — see src/data/seo.ts. */
export const LEGAL_NAV: NavLink[] = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'DPA', href: '/dpa' },
];

/* -- Company facts ---------------------------------------------------------
   ⚠ ONLY VERIFIED FACTS APPEAR HERE.

   No registered company name, no company number, no street address and no
   founding year has been supplied to this repository, so none is stated. The
   footer renders what is missing as nothing at all rather than as a plausible
   guess — an invented legal entity or address is the one category of
   fabrication with legal consequences attached.

   To add them: fill COMPANY_FACTS below. The footer renders each line only
   when it is non-empty, and lib/schema.ts adds the Organization `address` only
   when a full postal address is present.
-------------------------------------------------------------------------- */

export interface CompanyFacts {
  /** Registered legal entity, exactly as filed. Empty until verified. */
  legalName: string;
  /** Company registration number, with the registry named. Empty until verified. */
  registration: string;
  /** Year of incorporation, as a four-digit string. Empty until verified. */
  founded: string;
  /**
   * A real, staffed postal address. Empty until verified.
   *
   * ⚠ Filling this is ALSO what would justify LocalBusiness schema. It is not
   * emitted while this is empty, and it must not be added for a virtual
   * office — see lib/schema.ts.
   */
  address: {
    street: string;
    locality: string;
    region: string;
    postalCode: string;
    country: string;
  } | null;
}

export const COMPANY_FACTS: CompanyFacts = {
  legalName: '',
  registration: '',
  founded: '',
  address: null,
};

export { CONTACT_EMAIL };

export const REGION_LINE =
  'Working with brands in the US, UK, EU, GCC, Australia and Canada';

/* ---------------------------------------------------------------------------
   SOCIAL PROFILES — verified 1 September 2026.

   Each URL below was opened and confirmed to be Trenvo Media's own account,
   not merely to return a 200:

     Instagram  @trenvomedia, 564 posts, 728 followers
     Facebook   "Trenvo Media", Page type: Advertising agency
     LinkedIn   "Trenvo Media", Advertising Services

   ⚠ CANONICAL URLS, NOT SHARE LINKS. The Facebook URL supplied was a
   /share/1P8sJczDy1/ link; opening it resolves to a page whose own canonical is
   /trenvomedia/, so that is what is stored. The Instagram URL supplied carried
   an `igsi` share-tracking parameter, which is stripped for the same reason: a
   share link is a redirect with someone's attribution attached, and it does not
   belong in a footer or in Organization.sameAs.

   ⚠ X IS ABSENT, NOT PENDING-WITH-A-PLACEHOLDER. No X account exists yet and
   one must not be invented. Adding an entry here with a guessed handle would
   either 404 or, worse, point at somebody else's account. When a real X profile
   exists, add it and it appears in the footer and in sameAs automatically.

   THE SENTINEL SURVIVES for exactly that case: an entry whose href is
   SOCIAL_NOT_SET is DROPPED FROM THE RENDER ENTIRELY rather than shown greyed
   out. With three real profiles beside it, a dead fourth icon reads as a broken
   link, not as candour.
--------------------------------------------------------------------------- */

export const SOCIAL_NOT_SET = 'PROFILE-NOT-SET';

export interface SocialLink {
  /** Platform name — also the accessible name of the link. */
  label: string;
  /** Real profile URL, or SOCIAL_NOT_SET while unknown. */
  href: string;
}

const ALL_SOCIAL_LINKS: SocialLink[] = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/trenvomedia/' },
  { label: 'Instagram', href: 'https://www.instagram.com/trenvomedia/' },
  { label: 'Facebook', href: 'https://www.facebook.com/trenvomedia/' },
];

/**
 * What the site renders. Only profiles with a real, resolved URL — so nothing
 * ever points at a page that does not exist.
 */
export const SOCIAL_LINKS: SocialLink[] = ALL_SOCIAL_LINKS.filter(
  (s) => s.href !== SOCIAL_NOT_SET,
);

/** Feeds Organization.sameAs. Same list, named for what schema.org calls it. */
export const RESOLVED_SOCIAL_LINKS: SocialLink[] = SOCIAL_LINKS;
