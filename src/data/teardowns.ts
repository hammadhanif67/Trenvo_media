import type { Teardown } from '../types/content';

/* ---------------------------------------------------------------------------
   TEARDOWNS — the proof engine. master.md §19.4, §34.1(4).

   *** LAUNCH GATE ***
   master.md §34.2 and wireframe.md §08: the site does not go live with fewer
   than three published teardowns. wireframe.md §08 states the section "has no
   acceptable empty state".

   This array is EMPTY because no teardown has been written yet. Teardowns are a
   Phase 5 deliverable (§33), and each one analyses a real, publicly visible ad
   or ad creative. Inventing one would fabricate the single asset the entire
   proof strategy rests on.

   Until it is populated, homepage §08 unmounts rather than rendering a
   placeholder — §20.3: "an empty proof slot is removed from the layout, not
   filled with a placeholder ... never 'case studies coming soon'."

   Populating this file is what clears the launch gate. See implementation.md §5.4.
--------------------------------------------------------------------------- */

export const TEARDOWNS: Teardown[] = [];
