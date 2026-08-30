import type { CaseStudy } from '../types/content';

/* ---------------------------------------------------------------------------
   WORK — master.md §19, wireframe.md §09.

   implementation.md §1.2 approved that real work samples exist and that /work
   ships. They have not been supplied to the build yet, so this array is empty
   rather than filled with anything invented.

   Constraints that bind every entry when it is populated (§19.3):
     · kind: 'project' — the card reads PROJECT, never RESULT
     · NO metrics. The discriminated union in types/content.ts makes a metric on
       a project a compile error, not a review catch
     · no fabricated before/after, no percentage without an absolute baseline,
       no platform number presented as a business result, no composite client

   While empty, homepage §09 unmounts entirely (wireframe.md §09, §20.3):
   "A missing section is invisible; a fake one is fatal."
--------------------------------------------------------------------------- */

export const WORK: CaseStudy[] = [];
