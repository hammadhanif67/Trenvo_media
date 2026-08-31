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

   THE ORDER IS THE POINT. The content is held at y = 0 for the first 70% of the
   pin while the cube travels right → centre and grows. Only after the cube has
   reached its peak does the content start moving up. That is why the two are
   separate tweens on one timeline rather than one animation of a shared parent:
   a shared parent would make the content's movement a side effect of the cube's,
   which is exactly what the brief rules out.

   THREE THINGS KILL THE JOLT the first version had:

     1. `anticipatePin` — ScrollTrigger switches the section to fixed one frame
        BEFORE the pin starts. Without it a fast wheel step lands past the start
        and the section visibly snaps into place.
     2. The travel phase eases IN (`power2.in`). A linear tween starting after a
        hold is a step change in velocity: the content is stationary one frame
        and moving at full speed the next, which reads as a kick. `power2.in`
        leaves the hold at zero velocity, so the two phases join smoothly.
     3. `invalidateOnRefresh` — the start values are re-read on resize instead
        of being replayed from a stale measurement.

   The cube's progress is mapped from the timeline's own progress rather than
   tweened, so it stays exact at any scrub value and cannot drift out of step
   with the pin.

   §31.4 — GSAP and ScrollTrigger stay dynamically imported.
   §27.4 — under reduced motion none of this runs: no pin, no scrub, no
   movement. The section renders as an ordinary block and the cube sits still.
--------------------------------------------------------------------------- */

/**
 * How much scroll the pin consumes — and it is the whole cost of this effect.
 *
 * A pin does not move the page. Every pixel here is scrolling the reader does
 * while the document stays where it is, so the number has to be paid for by
 * what happens during it.
 *
 * At 1600 it was not. The section is 900px tall and its pin-spacer measured
 * 2500px, so 1600px — roughly 1.8 screens at 900px, and 16% of a 10,018px page
 * — went on holding the reader still. Scrolling past it felt like the page had
 * stopped, or like the same content was being scrolled through twice.
 *
 * 700 keeps the beat legible — the cube still crosses and grows over ~490px,
 * and the content rises over the last ~210px — while cutting the standstill to
 * well under a screen.
 */
const PIN_LENGTH = '+=700';

/**
 * How far the content rises in the last phase. Small on purpose: the section is
 * exactly one viewport tall with the content centred, so a large rise would
 * open the dead band under the rows that the first version had.
 */
const RISE = 130;

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

    /*
      A pinned section taller than the viewport can never sit flush: its bottom
      stays cut off for the entire pin, and the rise then opens a dead band
      under the rows. The section is `min-h-svh`, so it measures exactly one
      viewport whenever the content fits. If it does not fit — a short laptop,
      a large text-zoom setting — there is no pin at all and the section scrolls
      like any other. Better no choreography than a broken one.
    */
    if (section.offsetHeight > window.innerHeight + 2) return;

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
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            scrub: 1,
            // The cube reads the timeline directly, so it is exact at any
            // scrub value rather than lagging a tween of its own.
            onUpdate: (self) => cubeRef.current?.setProgress(self.progress),
          },
        });

        /*
          Phases 1–3, 0% → 70%: the content does not move. Stated explicitly as
          a held tween rather than left implicit, so the timeline's shape says
          what the brief asks for and a later edit cannot shorten it by accident.
        */
        timeline.to(content, { y: 0, duration: 0.7, ease: 'none' });

        /* Phase 4, 70% → 100%: only now does the content travel, and it leaves
           the hold at zero velocity so the transition cannot be felt. */
        timeline.to(content, { y: -RISE, duration: 0.3, ease: 'power2.in' });
      }, section);

      cleanup = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [sectionRef, contentRef, cubeRef, reducedMotion]);
}
