import type { PracticeId } from '../types/content';

/* ---------------------------------------------------------------------------
   NAVIGATION — transcribed from wireframe.md §1.3 and master.md §11.2/§11.3.

   Structure only. No marketing copy lives here: labels are the documented
   capability names (§9.4) and the routes are the approved launch paths
   (wireframe.md §1.1). Adding a service is a data edit (§26.4).

   This file is deliberately separate from data/services.ts, which arrives at M5
   with the full Service shape (outcome, situation, mechanisms, faqs, seo). The
   navigation needs only label + href, and blocking the header on unwritten copy
   would be the wrong dependency.
--------------------------------------------------------------------------- */

export interface NavLink {
  label: string;
  href: string;
}

export interface PracticeNav {
  id: PracticeId;
  /** §6.2 — the practice name as it appears in the mega-menu column head. */
  name: string;
  /** §6.2 — the question this practice owns. */
  question: string;
  /** The routed service pages inside this practice (master.md §9.4). */
  services: NavLink[];
}

/**
 * master.md §11.2 and wireframe.md §1.3 — three columns matching the three
 * practices, holding exactly the seven routed service pages of §9.4.
 *
 * Capabilities that are NOT routed pages — measurement & attribution, motion
 * design — are absent by design, and implementation.md §1.4 (D6) records that
 * practice-card bullets are not all links. A menu entry without a route would
 * be a dead link.
 *
 * §9.3's /services/web-development is gone: Trenvo sells digital marketing and
 * does not offer web development (implementation.md §5.21). Engineering now
 * carries Landing Pages alone — the page a campaign points at, which is a
 * conversion asset rather than a development service.
 */
export const PRACTICE_NAV: PracticeNav[] = [
  {
    id: 'media',
    name: 'Media',
    question: 'Is the money going to the right place?',
    services: [
      { label: 'Meta Ads', href: '/services/meta-ads' },
      { label: 'Google Ads', href: '/services/google-ads' },
    ],
  },
  {
    id: 'studio',
    name: 'Studio',
    question: 'Is there anything worth showing when it gets there?',
    services: [
      { label: 'Performance Creative', href: '/services/performance-creative' },
      { label: 'AI Video Production', href: '/services/ai-video' },
      { label: 'Video Editing', href: '/services/video-editing' },
    ],
  },
  {
    id: 'engineering',
    name: 'Engineering',
    question: 'Does anything happen after the click?',
    services: [
      { label: 'Landing Pages', href: '/services/landing-pages' },
    ],
  },
];

/**
 * master.md §11.2 — "Primary navigation (5 items + 1 action)". Services is the
 * mega-menu trigger and is rendered separately, so four links appear here.
 *
 * Process and Contact are deliberately absent: §11.2 fixes the header at five
 * items, and both are reachable from the footer and from in-page CTAs.
 */
export const PRIMARY_NAV: NavLink[] = [
  { label: 'Specialists', href: '/specialists' },
  { label: 'Work', href: '/work' },
  { label: 'Teardowns', href: '/teardowns' },
  { label: 'About', href: '/about' },
];

/**
 * master.md §17.2 — Tier 1, the persistent header action.
 * §17.3 places it in the header on every page.
 */
export const PRIMARY_CTA: NavLink = { label: 'Start a project', href: '/contact' };

/** master.md §17.2 — Tier 2, the artefact CTA. */
export const SECONDARY_CTA: NavLink = { label: 'Get a teardown', href: '/contact' };

/**
 * The mega-menu footer row — master.md §11.2 calls it "the highest-value pixel
 * in the navigation" because it makes the structural argument in one line.
 *
 * Neither document states its destination. It points at /services, whose H1 is
 * "Three practices. One loop." (§14) — the page that answers exactly what the
 * row promises. Smallest reversible choice; recorded in implementation.md §5.3.
 */
export const LOOP_LINK: NavLink = {
  label: 'The Loop — how the three practices work as one system',
  href: '/services',
};

/**
 * §11.2's mega-menu CTA. §17.2 Tier 3 names the discipline at the moment of
 * decision; the generic form routes to /contact like the other conversion CTAs.
 */
export const MEGA_MENU_CTA: NavLink = { label: 'Talk to a specialist', href: '/contact' };

/** wireframe.md §12 — footer COMPANY column. */
export const COMPANY_NAV: NavLink[] = [
  { label: 'About', href: '/about' },
  { label: 'Process', href: '/process' },
  { label: 'Specialists', href: '/specialists' },
  { label: 'Contact', href: '/contact' },
];

/** wireframe.md §12 — footer PROOF column. */
export const PROOF_NAV: NavLink[] = [
  { label: 'Work', href: '/work' },
  { label: 'Teardowns', href: '/teardowns' },
];

/** wireframe.md §12 — footer legal row. */
export const LEGAL_NAV: NavLink[] = [
  { label: 'Privacy', href: '/legal/privacy' },
  { label: 'Terms', href: '/legal/terms' },
];

/**
 * wireframe.md §12, verbatim. The region line is a statement of where Trenvo
 * works — §7.3 lists it as an honest launch proof point. It is not a claim
 * about clients, and no client is named anywhere.
 */
export const CONTACT_EMAIL = 'hello@trenvomedia.com';
export const REGION_LINE =
  'Working with brands in the US, UK, EU, GCC, Australia and Canada';

/* ---------------------------------------------------------------------------
   SOCIAL PROFILES

   ⚠ LAUNCH GATE. The real profile URLs have not been supplied, and I will not
   guess them: a guessed handle either 404s or, worse, points at someone else's
   account. So each entry carries the sentinel below until the real URL is set.

   The row still RENDERS in the footer — the design does not wait on this — but
   an unset entry renders as plain text rather than as a link, so nothing ever
   points at a URL that does not exist. Replace the sentinel with the real URL
   and it becomes a link automatically. `npm run audit` fails while any remain,
   exactly as it does for the unset production origin.
--------------------------------------------------------------------------- */

export const SOCIAL_NOT_SET = 'PROFILE-NOT-SET';

export interface SocialLink {
  /** Platform name — also the accessible name of the link. */
  label: string;
  /** Real profile URL, or SOCIAL_NOT_SET while unknown. */
  href: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'LinkedIn', href: SOCIAL_NOT_SET },
  { label: 'Instagram', href: SOCIAL_NOT_SET },
  { label: 'YouTube', href: SOCIAL_NOT_SET },
  { label: 'X', href: SOCIAL_NOT_SET },
];
