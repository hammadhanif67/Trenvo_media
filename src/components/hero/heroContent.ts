import { PRIMARY_CTA, SECONDARY_CTA } from '../../data/navigation';

/* ---------------------------------------------------------------------------
   HERO CONTENT — single source for every string in the hero.

   The reference mockups (public/assets/Manage Content 1 (1) and (2)) set the
   art direction: eyebrow, three-line H1 with the last line in accent, lead
   paragraph, two CTAs, and a trust block beneath.

   ⚠ ONE PART OF THE REFERENCE IS NOT BUILT, DELIBERATELY.

   Both mockups end with "Trusted by growth-focused brands" over five named
   client logos — Soralune, HOLY, Healthify, Glowri, NutriPure — and the laptop
   shows ROAS 4.6x, Spend $114K, Conversions 657, Revenue $470K.

   Those are fabricated clients and fabricated results. master.md §2.8 forbids
   exactly this, the standing instruction on this project forbids it, and
   `npm run audit` fails the build on fabricated-proof language. A visitor who
   searched any of those five brand names would find nothing.

   So the trust BLOCK is built — same position, same weight in the composition —
   and filled with claims Trenvo can actually stand behind: how the team is
   structured, which is true today and needs no client to verify. When real
   clients exist and permission is given, `trustItems` is where their names go.

   SEO: the H1 carries the commercial terms a buyer actually searches — AI video
   ads, creative, paid media, conversion — as a sentence rather than a keyword
   list. Nothing here is stuffed; every phrase is a thing Trenvo sells.
--------------------------------------------------------------------------- */

export interface HeroContent {
  eyebrow: string;
  /** Rendered as separate lines; `accent` is the line painted in the brand blue. */
  titleLines: string[];
  titleAccentLine: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  trustLabel: string;
  trustItems: string[];
}

export const HERO_CONTENT: HeroContent = {
  eyebrow: 'All-in-one growth system',

  titleLines: ['AI Video Ads, Creative', '& Paid Media,'],
  titleAccentLine: 'One Conversion System',

  description:
    'Trenvo Media runs both — the paid media and the creative that runs in it — with a named specialist on each.',

  primaryCta: { label: PRIMARY_CTA.label, href: PRIMARY_CTA.href },
  secondaryCta: {
    label: 'Get a teardown of your ads and creative',
    href: SECONDARY_CTA.href,
  },

  /*
    Not "Trusted by…". Trenvo has no published client list, and inventing one is
    the single thing this project must never do. These three are structural
    facts about the team — true on day one, and verifiable on /specialists.
  */
  trustLabel: 'How the work is staffed',
  trustItems: ['Six named disciplines', 'A specialist per account', 'Published boundaries'],
};
