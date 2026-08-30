import type { Specialist } from '../types/content';

/* ---------------------------------------------------------------------------
   SPECIALISTS — master.md §10.5, §28.2.

   EMPTY ARRAY AT LAUNCH, BY DESIGN. §10.2 lists the three ways this section
   fails, and the first is "fake people ... reverse-image-searchable, and fatal
   if found. Prohibited."

   Until real specialists exist, the lattice renders DISCIPLINES and their
   boundaries (data/disciplines.ts). §26.2 gives DisciplineLattice both states
   from day one, so adding real people later is a data change, not a redesign.
   §26.2: SpecialistCard "never renders a placeholder".
--------------------------------------------------------------------------- */

export const SPECIALISTS: Specialist[] = [];
