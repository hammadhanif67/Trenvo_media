import type { CaseStudy } from '../types/content';

/* ---------------------------------------------------------------------------
   WORK — master.md §19, wireframe.md §09.

   THIS ARRAY IS EMPTY. No verified case study has been supplied, so /work
   renders an honest empty state — what will appear there and what will not —
   rather than placeholder cards. §20.3: "A missing section is invisible; a
   fake one is fatal."

   Because getStaticPaths in app/router.tsx maps this array, an empty array
   pre-renders NO /work/:slug pages. A route with no data does not ship a shell.

   ---------------------------------------------------------------------------
   THE CONSTRAINTS ON EVERY ENTRY (§19.3)

     · `kind: 'project'` unless there are MEASURED results. The card then reads
       PROJECT, never RESULT.
     · A `'project'` study cannot carry metrics — `metrics?: never` in
       types/content.ts makes that a COMPILE ERROR, not a review catch.
     · A `'result'` study MUST carry metrics, and every Metric requires
       `method` and `window`: §19.2 block 7, "only real, only measured, with the
       measurement method stated and the time window given."
     · No percentage without an absolute baseline.
     · No platform dashboard number presented as a business result.
     · No composite or "representative" client. If the client cannot be named,
       set `anonymised: true` and use a category — "a DTC supplement brand".
       An invented brand name is fabrication; an honest category is not.
     · No before/after screenshot that is not genuinely before and after.
     · `quote` requires the person's real name, their role, and their explicit
       permission to publish it.

   ---------------------------------------------------------------------------
   TEMPLATE — copy, do not uncomment in place.

   {
     kind: 'project',
     slug: 'acme-creative-system',
     client: 'A DTC supplement brand',
     anonymised: true,
     objective: 'What the client was trying to achieve.',
     startingPoint: 'Where things stood at the start. No invented baseline.',
     context: 'The one-line summary the index card shows.',
     diagnosis: 'What we found when we read the account, the creative and the page.',
     hypothesis: 'What we believed would change it, stated so it could be wrong.',
     strategy: 'What we decided to do about it.',
     built: [{ src: '/work/acme/hook-01.webp', alt: 'Describe what is shown.' }],
     media: 'How the media was structured and run against the hypothesis.',
     testDesign: 'What was tested against what, and how the winner was decided.',
     measurement: 'How the outcome was measured, and against which source of truth.',
     timeframe: 'March – August 2026',
     tools: ['Meta Ads Manager', 'Google Ads', 'GA4'],
     disciplineIds: ['performance-creative-strategist', 'meta-ads-specialist'],
     serviceSlugs: ['performance-creative', 'meta-ads'],
     datePublished: '2026-09-01',
   }

   For a MEASURED study, switch `kind` to 'result' and add:

     metrics: [
       {
         label: 'Cost per acquisition',
         value: '$41 from $67',
         method: 'Shopify orders reconciled against platform-reported purchases',
         window: '90 days, matched against the 90 days prior',
       },
     ],
--------------------------------------------------------------------------- */

export const WORK: CaseStudy[] = [];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return WORK.find((w) => w.slug === slug);
}

/** Case studies that used a given service, for the service pages to link to. */
export function workForService(serviceSlug: string): CaseStudy[] {
  return WORK.filter((w) => w.serviceSlugs.includes(serviceSlug));
}
