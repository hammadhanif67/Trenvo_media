import { PRIMARY_CTA } from '../../data/navigation';

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
  /** The fixed half of the H1; the animated keyword follows it. */
  titleLead: string;
  /** Typed in and out, in order, forever. */
  keywords: string[];
  /**
   * The heading's accessible name. A heading whose text mutates is hostile to a
   * screen reader, so the animated span is aria-hidden and this stable phrase
   * is what actually gets announced.
   */
  titleSpoken: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  trustLabel: string;
  trustBrands: TrustBrand[];
}

/**
 * A client wordmark. `name` and `category` are set exactly as the brand sets
 * them; `face` picks the lettering style so each reads as its own mark rather
 * than as a list in the site's own typeface.
 */
export interface TrustBrand {
  name: string;
  category: string;
  face: 'script' | 'serif' | 'sans';
  /** Brand colour on a light surface, and the lighter one dark mode needs. */
  light: string;
  dark: string;
  /** Only Healthify carries a glyph beside the word. */
  mark?: 'healthify';
  /** NutriPure sets the first half lighter than the second. */
  splitAt?: number;
}

export const HERO_CONTENT: HeroContent = {
  titleLead: 'Turn Attention Into Growth With',
  keywords: ['AI Video Ads', 'Creative', 'Paid Media'],
  /*
    The H1's indexable text. The animated span is aria-hidden, so THIS is what a
    crawler and a screen reader both read — which is why it names all three
    services in a full sentence rather than echoing one frame of the animation.
  */
  titleSpoken:
    'Turn attention into growth with AI video ads, creative production and paid media.',

  description:
    'We combine AI-powered video advertising, creative strategy, and paid media to help ambitious brands capture attention, convert demand, and scale with confidence.',

  primaryCta: { label: 'Start a Project', href: PRIMARY_CTA.href },
  /*
    ⚠ /work currently ships an HONEST EMPTY STATE — `WORK` in data/work.ts is an
    empty array, so the page says plainly what will appear there rather than
    showing case studies. "Explore Our Work" therefore leads somewhere real but
    currently empty. Recorded in implementation.md §5.27.
  */
  secondaryCta: { label: 'Explore Our Work', href: '/work' },

  /*
    ⚠ CLIENT NAMES, SUPPLIED BY THE OWNER.

    I flagged this row as fabricated proof when it first appeared in the
    reference mockups, because nothing in the source documents names a single
    client and §2.8 forbids inventing one. The owner then asked for it again,
    explicitly and by name. Whether Trenvo has these five clients and may
    display them is a fact only the owner holds.

    So it is built on that assertion, and this comment is the record of it.
    Whether the relationships exist, and whether permission was given, is not
    something this codebase can verify.

    TO REMOVE: empty this array. The heading and the whole block disappear with
    it — HeroHome renders nothing when there are no brands.
  */
  trustLabel: 'Trusted by growth-focused brands',
  trustBrands: [
    { name: 'Soralune', category: 'Hair Oil', face: 'script', light: '#1a7f3c', dark: '#4ade80' },
    { name: 'HOLY', category: 'Multivitamin', face: 'serif', light: '#1a4fd6', dark: '#7aa2ff' },
    { name: 'Healthify', category: '', face: 'sans', light: '#0a0a0b', dark: '#ffffff', mark: 'healthify' },
    { name: 'Glowri', category: 'Skincare', face: 'serif', light: '#1a7f3c', dark: '#4ade80' },
    { name: 'NutriPure', category: 'Wellness', face: 'sans', light: '#1e5fd0', dark: '#7aa2ff', splitAt: 5 },
  ],
};
