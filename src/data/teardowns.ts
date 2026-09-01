import type { Teardown } from '../types/content';

/* ---------------------------------------------------------------------------
   TEARDOWNS — the proof engine. master.md §19.4, §34.1(4).

   *** LAUNCH GATE ***
   master.md §34.2 and wireframe.md §08: the site does not go live with fewer
   than three published teardowns. §34.1(4) calls a teardown "one asset doing
   five jobs" — proof, lead magnet, organic strategy, social surface, and
   evidence of expertise.

   THIS ARRAY IS EMPTY, and it must stay empty until real teardowns are written.
   Each one analyses a real, publicly visible ad or ad creative. Inventing one
   would fabricate the single asset the entire proof strategy rests on — and
   unlike most fabrications, this one is checkable: a reader can go and look at
   the ad.

   While it is empty:
     · /teardowns keeps only what is true today — what a teardown is, and the
       offer to produce one — and the index unmounts (§20.3: an empty proof slot
       is removed, never filled with "coming soon")
     · homepage §08 unmounts entirely
     · /teardowns/:slug pre-renders NO pages, because getStaticPaths maps this
       array

   ---------------------------------------------------------------------------
   HOW TO PUBLISH ONE

   Copy the template below, fill every field, and add it to TEARDOWNS. The page
   at /teardowns/:slug, the index card, the Article JSON-LD, the sitemap entry
   and the cross-links on the related service page all appear from that one
   edit — nothing else needs touching.

   THE RULES EACH ENTRY MUST HOLD TO:

     1. The subject is real and PUBLICLY VISIBLE. An ad library entry, a live
        landing page, a running ad you can screenshot. If it came from a client
        account, it is not a teardown — it is confidential.
     2. `expectedImpact` states a DIRECTION and a mechanism, never a number. We
        do not have the advertiser's data. "We would expect hook rate to move
        before CPA does" is defensible; "we would expect a 30% lift" is invented.
     3. `limits` is mandatory and is written last. §14: "Stating what you cannot
        know is the clearest signal that everything else you said, you do know."
     4. `serviceSlug` must exist in data/services.ts, and `relatedSlugs` must
        name teardowns that exist. scripts/validate-routes.mjs fails the build
        on either.
     5. Criticism is of the WORK, never of the people who made it. Every one of
        these is written knowing the advertiser may read it.

   ---------------------------------------------------------------------------
   TEMPLATE — copy, do not uncomment in place.

   {
     slug: 'brand-meta-hook-teardown',
     subject: 'Three seconds of nothing: a Meta ad that opens on a logo',
     summary:
       'A supplement brand spends its first two seconds on brand furniture, in a placement where the first two seconds are the whole auction.',
     category: 'DTC supplements',
     disciplineId: 'performance-creative-strategist',
     observedAt: 'Meta Ad Library, observed 14 March 2026',
     problem: 'What the advertiser is trying to sell, and to whom.',
     observation: 'What is actually on screen, described without judgement.',
     analysis: 'What we believe is happening, stated so it can be wrong.',
     whatWeWouldChange: 'The specific change. One thing, not a list.',
     why: 'What that change is a bet on, and what would disprove it.',
     howWeWouldMeasure: 'The metric that would settle it, and the window.',
     expectedImpact: 'Direction and mechanism. NO NUMBER.',
     limits: 'What we cannot see from outside the account.',
     serviceSlug: 'performance-creative',
     relatedSlugs: [],
     datePublished: '2026-03-14',
   }
--------------------------------------------------------------------------- */

export const TEARDOWNS: Teardown[] = [];

export function getTeardown(slug: string): Teardown | undefined {
  return TEARDOWNS.find((t) => t.slug === slug);
}

/**
 * Teardowns related to a given one: those it names explicitly, then others
 * covering the same service, never itself, capped so the block stays a
 * recommendation rather than an index.
 */
export function relatedTeardowns(slug: string, limit = 2): Teardown[] {
  const current = getTeardown(slug);
  if (!current) return [];

  const named = (current.relatedSlugs ?? [])
    .map(getTeardown)
    .filter((t): t is Teardown => t !== undefined);

  const sameService = TEARDOWNS.filter(
    (t) =>
      t.slug !== slug &&
      t.serviceSlug === current.serviceSlug &&
      !named.some((n) => n.slug === t.slug),
  );

  return [...named, ...sameService].slice(0, limit);
}

/** Teardowns that analyse work relevant to a given service page. */
export function teardownsForService(serviceSlug: string): Teardown[] {
  return TEARDOWNS.filter((t) => t.serviceSlug === serviceSlug);
}
