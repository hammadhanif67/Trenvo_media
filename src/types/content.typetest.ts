/* ---------------------------------------------------------------------------
   TYPE-LEVEL ASSERTIONS — content.ts

   This file contains no runtime code and is imported by nothing, so it emits
   nothing into the bundle. It exists to prove that the honesty rules of
   master.md §19–20 are enforced by the compiler rather than by review (§34.2).

   Every `@ts-expect-error` below is an assertion that the line beneath it is a
   type error. If any of these constructs ever becomes legal, `tsc` fails on the
   unused directive — so the guarantee cannot rot silently.

   Run with: npx tsc --noEmit
--------------------------------------------------------------------------- */

import type { CaseStudy, MeasurementDefinition, Metric, Practice } from './content';

const built = [{ src: '', alt: '' }];

/**
 * Every field CaseStudyBase requires. Kept exhaustive on purpose: adding a
 * required field to the type breaks this file first, which is where a missing
 * field should be noticed.
 */
const base = {
  slug: '',
  client: '',
  objective: '',
  startingPoint: '',
  context: '',
  diagnosis: '',
  hypothesis: '',
  strategy: '',
  built,
  media: '',
  testDesign: '',
  measurement: '',
  timeframe: '',
  tools: [],
  disciplineIds: [],
  serviceSlugs: [],
  datePublished: '2026-01-01',
};

/* -- MUST COMPILE ---------------------------------------------------------- */

/** §19.3 — blocks 1–6 with no result is a valid, publishable study. */
export const validProject: CaseStudy = { ...base, kind: 'project' };

/** §19.2 block 7 — a result carries measured metrics with method and window. */
export const validResult: CaseStudy = {
  ...base,
  kind: 'result',
  metrics: [{ label: '', value: '', method: '', window: '' }],
};

/* -- MUST NOT COMPILE ------------------------------------------------------ */
/* Each invalid case is written on a single line so the @ts-expect-error above  */
/* it always lands on the line the compiler flags.                              */

const metric = { label: '', value: '', method: '', window: '' };

/**
 * THE RULE. §28.3: "A developer cannot accidentally render a results-style card
 * for a project with no results, because the type will not allow it."
 */
// @ts-expect-error — a 'project' may never carry metrics (§19.3, §34.1(5))
export const projectCannotCarryMetrics: CaseStudy = { ...base, kind: 'project', metrics: [metric] };

/** §19.2 block 7 — 'result' without measured metrics is the §2.8 failure. */
// @ts-expect-error — 'result' requires metrics
export const resultRequiresMetrics: CaseStudy = { ...base, kind: 'result' };

/** §19.2 block 7 — a metric that cannot state its method is not publishable. */
// @ts-expect-error — method and window are required on Metric
export const metricNeedsMethodAndWindow: Metric = { label: '', value: '' };

/** Finding 3 — the glossary type must never stand in for a measured result. */
// @ts-expect-error — MeasurementDefinition is not a Metric
export const glossaryIsNotAResult: Metric = { metric: '', ownedBy: 'media', howWeUseIt: '' };

/** §13 §7 — ownedBy is a practice, not a free string. */
// @ts-expect-error — 'creative' is not a PracticeId
export const ownedByIsAPractice: MeasurementDefinition = { metric: '', ownedBy: 'creative', howWeUseIt: '' };

/** §6.2 — a practice owns a question; the three ids are closed. */
// @ts-expect-error — 'operations' is not a PracticeId
export const practiceIdIsClosed: Practice = { id: 'operations', name: '', question: '' };
