import { useEffect, type RefObject } from 'react';
import { useReducedMotion } from './useReducedMotion';
import type { CubeHandle } from '../components/motion/CubeScene';

/* ---------------------------------------------------------------------------
   CASE-STUDIES PIN — two tracks on one scrollbar

   The section pins, and scroll progress drives two things that never touch each
   other:

     · the CUBE, through `cube.setProgress(0..1)`. It is a WebGL object; it has
       no DOM box, so it cannot push, pull or reflow anything.
     · the CONTENT, through a GSAP tween on a single wrapper's `y`.

   THE ORDER IS THE POINT. The content is held at y = 0 for the first 75% of the
   pin while the cube travels right → centre and grows. Only after the cube has
   reached its peak does the content start moving up. That is why the two are
   separate tweens on one timeline rather than one animation of a shared parent:
   a shared parent would make the content's movement a side effect of the cube's,
   which is exactly what the brief rules out.

   The cube's progress is mapped from the timeline's own progress rather than
   tweened, so it stays exact at any scrub value and cannot drift out of step
   with the pin.

   §31.4 — GSAP and ScrollTrigger stay dynamically imported.
   §27.4 — under reduced motion none of this runs: no pin, no scrub, no
   movement. The section renders as an ordinary block and the cube sits still.
--------------------------------------------------------------------------- */

/** How much scroll the pin consumes. Long enough to feel deliberate, not a trek. */
const PIN_LENGTH = '+=1800';

export function useCubeScrollTimeline(
  sectionRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
  cubeRef: RefObject<CubeHandle | null>,
): void {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    // Pinning a section on a phone costs more than it buys: the viewport is
    // short, the cube is small, and a long pin reads as the page being stuck.
    if (typeof window !== 'undefined' && window.innerWidth < 1024) return;

    let cleanup = () => {};
    let cancelled = false;

    void (async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: PIN_LENGTH,
            pin: true,
            scrub: 0.8,
            // The cube reads the timeline directly, so it is exact at any
            // scrub value rather than lagging a tween of its own.
            onUpdate: (self) => cubeRef.current?.setProgress(self.progress),
          },
        });

        /*
          Phases 1–3, 0% → 75%: the content does not move. Stated explicitly as
          a held tween rather than left implicit, so the timeline's shape says
          what the brief asks for and a later edit cannot shorten it by accident.
        */
        timeline.to(content, { y: 0, duration: 0.75, ease: 'none' });

        /* Phase 4, 75% → 100%: only now does the content travel. */
        timeline.to(content, { y: -260, duration: 0.25, ease: 'none' });
      }, section);

      cleanup = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [sectionRef, contentRef, cubeRef, reducedMotion]);
}
