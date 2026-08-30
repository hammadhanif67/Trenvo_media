import { useEffect, type RefObject } from 'react';
import { useReducedMotion } from './useReducedMotion';

/* ---------------------------------------------------------------------------
   LOOP MOTION — the hero's Loop diagram.

   §27.2 #1 is documented: "Loop path draw in hero · GSAP (SVG path) · 900ms,
   plays once, ease-out, NEVER LOOPS." That part is implemented exactly.

   ⚠ TWO BEHAVIOURS BEYOND THE DOCUMENTS, both requested:

     · a continuous circular travel around the path after the draw settles.
       §27.3 does not ship "looping ambient animation", and §27.2 #1 says the
       draw "plays once, never loops". This is a deliberate override, of the
       same kind already taken for the hero video.
     · the loop scales up and fades out as the hero scrolls away. §27.2 #2
       gives a scroll-scrub to SECTION 03, not to the hero, and §27.3 does not
       ship "parallax backgrounds". Also an override.

   Recorded in implementation.md §5.16. HERO_LOOP_MOTION is the off switch.

   §27.4 — under prefers-reduced-motion NONE of this runs: the diagram renders
   in its final state, which is exactly what §27.4 requires ("the loop diagram
   renders in its final state").

   §31.4 — "GSAP and ScrollTrigger are DYNAMICALLY IMPORTED only on routes that
   use them ... this is the single largest bundle decision on the project." The
   import below is inside the effect for that reason: it never enters the
   initial bundle, and never loads at all under reduced motion.

   §27.5 — only transform and opacity are animated, and every ScrollTrigger is
   killed on unmount.
--------------------------------------------------------------------------- */

const DRAW_MS = 900; // §27.2 #1

export function useLoopMotion(
  containerRef: RefObject<HTMLElement | null>,
  enabled: boolean,
): void {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!enabled || reducedMotion) return;
    const container = containerRef.current;
    if (!container) return;

    let cleanup = () => {};
    let cancelled = false;

    void (async () => {
      // §31.4 — kept out of the initial bundle.
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const paths = gsap.utils.toArray<SVGPathElement>('path[data-loop-path]');

        paths.forEach((path) => {
          const length = path.getTotalLength();

          // §27.2 #1 — draws once, 900ms, ease-out, then holds.
          gsap.fromTo(
            path,
            { strokeDasharray: length, strokeDashoffset: length },
            {
              strokeDashoffset: 0,
              duration: DRAW_MS / 1000,
              ease: 'power2.out',
              onComplete: () => {
                // Hand the path back to a plain solid stroke, so the travelling
                // dot below is the only thing still moving.
                gsap.set(path, { strokeDasharray: 'none' });
              },
            },
          );
        });

        // Continuous circular travel — the requested override. A single marker
        // riding the path reads as "this loop is running" without the whole
        // drawing moving, which would fight the headline beside it.
        const travellers = gsap.utils.toArray<SVGCircleElement>('[data-loop-traveller]');
        travellers.forEach((dot) => {
          const path =
            dot.parentElement?.querySelector<SVGPathElement>('path[data-loop-path]');
          if (!path) return;
          const length = path.getTotalLength();

          gsap.to(
            { d: 0 },
            {
              d: length,
              duration: 9,
              ease: 'none',
              repeat: -1,
              delay: DRAW_MS / 1000,
              onUpdate() {
                const p = path.getPointAtLength(this.targets()[0].d % length);
                gsap.set(dot, { attr: { cx: p.x, cy: p.y } });
              },
            },
          );
          gsap.fromTo(
            dot,
            { opacity: 0 },
            { opacity: 1, duration: 0.4, delay: DRAW_MS / 1000 },
          );
        });

        // Scroll: grows and fades, gone by the time the hero leaves. Scrubbed
        // rather than triggered, so it tracks the scrollbar and reverses.
        gsap.to(container, {
          scale: 1.6,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: container.closest('section') ?? container,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }, container);

      cleanup = () => {
        ctx.revert(); // §27.5 — kills the ScrollTriggers this context created.
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [containerRef, enabled, reducedMotion]);
}
