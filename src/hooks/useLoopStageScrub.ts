import { useEffect, type RefObject } from 'react';
import { useReducedMotion } from './useReducedMotion';

/* ---------------------------------------------------------------------------
   LOOP STAGE SCRUB — master.md §27.2 #2

   "Loop stage scroll-scrub · Makes a four-stage process legible as a
   progression rather than a list · GSAP ScrollTrigger · Scrubbed, reversible,
   pinned max 100vh."

   ⚠ ONE DEVIATION, MEASURED: the section is NOT pinned.

   Pinning holds an element still while the page scrolls past it, which only
   works when the element fits the viewport. Section 03 renders 1359px against
   a 900px desktop viewport — about 1.5x — so pinning it would freeze a section
   with roughly a third of itself permanently off-screen, and the stage the
   scrub is highlighting could be one of the hidden ones. Pinning here would
   defeat the stated purpose rather than serve it.

   Everything else in #2 is exactly as specified: scrubbed to scroll position,
   fully reversible, and it advances the four stages as a progression. Recorded
   in implementation.md §5.18.

   §27.4 — #2 is in the disabled list, so under reduced motion this runs
   nothing and every stage stays at its final, fully legible state.
   §27.5 — opacity only, and the trigger is killed on unmount.
   §31.4 — ScrollTrigger stays dynamically imported.
--------------------------------------------------------------------------- */

/** Stages below the active one dim to this. Never lower — the text stays readable. */
const DIM = 0.35;

export function useLoopStageScrub(sectionRef: RefObject<HTMLElement | null>): void {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    let cleanup = () => {};
    let cancelled = false;

    void (async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const stages = gsap.utils.toArray<HTMLElement>('[data-loop-stage]');
        if (stages.length === 0) return;

        stages.forEach((stage, i) => {
          // The first stage starts lit: a reader arriving at the section should
          // see a progression already begun, not four dimmed rows.
          gsap.set(stage, { opacity: i === 0 ? 1 : DIM });

          if (i === 0) return;

          gsap.to(stage, {
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: stage,
              // Scrubbed and reversible: scrolling back dims it again.
              start: 'top 85%',
              end: 'top 55%',
              scrub: true,
            },
          });
        });
      }, section);

      cleanup = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [sectionRef, reducedMotion]);
}
