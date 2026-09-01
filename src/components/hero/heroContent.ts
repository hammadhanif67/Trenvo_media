import { PRIMARY_CTA, SECONDARY_CTA } from '../../data/navigation';
import { CLIENTS } from '../../data/clients';
import type { Client } from '../../data/clients';

/* ---------------------------------------------------------------------------
   HERO CONTENT — single source for every string in the hero.

   ⚠ TWO THINGS WERE REMOVED HERE, AND BOTH MATTER.

   1. THE INFINITE TYPEWRITER IS GONE.

      The H1 used to be a fixed lead — "Turn Attention Into Growth With" —
      followed by a span that typed "AI Video Ads", then "Creative", then "Paid
      Media", forever. Three consequences, all bad:

        · The rendered H1 was grammatically incomplete for most of its cycle.
          Between keywords it read "Turn Attention Into Growth With" and
          stopped. That is what a visitor sees on arrival, what a screenshot
          catches, and what a scroll-past leaves behind.
        · An H1 whose text mutates forever is a permanently animating element
          inside the LCP candidate, which is the one place §27.3 explicitly
          rules motion out.
        · It ran for the entire session. Not an entrance — a loop, running
          while somebody is trying to read the paragraph beneath it.

      The heading is now a complete sentence that never changes. The only
      motion left in the hero is the one-pass entrance curtain, which finishes
      in 1.4 seconds and removes itself.

   2. THE "TRUSTED BY" CLIENT ROW IS GONE, pending verification.

      It read from five brand names with nothing behind them. The names are
      preserved in data/clients.ts behind a publication gate; the row returns
      the moment there is something real to put beneath it. Nothing here needs
      editing for that — `clients` reads the gated export.

   THE COPY IS THE POSITIONING THE SITE ALREADY EARNS ELSEWHERE: paid media and
   creative production as one system, with one owner and one number. Every other
   page argues it; the hero now says it.

   SEO: the H1 carries the commercial terms a buyer actually searches — paid
   media, creative production, measurement — as a sentence rather than a keyword
   list. Nothing is stuffed; every phrase names a thing Trenvo sells.
--------------------------------------------------------------------------- */

export interface HeroContent {
  /**
   * The H1, in two parts so the second can carry the accent colour. Both parts
   * are static, and concatenating them is always a complete sentence — which
   * is the property the typewriter could not hold.
   */
  titleLead: string;
  titleAccent: string;
  description: string;
  /** The three things the system covers, stated as claims about ownership. */
  pillars: { label: string; body: string }[];
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  /** Empty until data/clients.ts opens its publication gate. */
  clients: Client[];
}

export const HERO_CONTENT: HeroContent = {
  titleLead: 'Paid media and creative production,',
  titleAccent: 'run as one system.',

  description:
    'One team runs the ads, the creative that goes in them, and the measurement that settles what worked — with one owner and one number to answer for. No seam between the media buyer and the studio, because there is nobody on the other side of it.',

  /*
    The three pillars name what "one system" actually contains, so the claim is
    specific rather than a slogan. Media, creative and measurement are the three
    practices the taxonomy actually ships — see data/services.ts.
  */
  pillars: [
    { label: 'Media', body: 'Meta, Google, and what they are allowed to do with your budget.' },
    { label: 'Creative', body: 'The concepts, the production, and the variant volume paid social eats.' },
    { label: 'Measurement', body: 'One number, reconciled against something outside the ad platform.' },
  ],

  primaryCta: { label: PRIMARY_CTA.label, href: PRIMARY_CTA.href },
  secondaryCta: { label: SECONDARY_CTA.label, href: SECONDARY_CTA.href },

  clients: CLIENTS,
};
