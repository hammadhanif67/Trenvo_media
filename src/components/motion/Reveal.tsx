import { LazyMotion, domAnimation, m, type Variants } from 'framer-motion';
import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/* ---------------------------------------------------------------------------
   REVEAL — master.md §27.2 #3

   "Section entrance · Establishes reading order and rhythm · Framer Motion ·
   8px rise + fade, 300ms, 60ms stagger, once only." Every constant below is
   that line.

   FAIL-SAFE BY CONSTRUCTION. The obvious implementation is Framer's
   `initial="hidden" whileInView="shown"`, and it was measured to be wrong for
   this site: it writes `opacity: 0` into the PRE-RENDERED HTML (§31.2), so nine
   homepage blocks ship invisible and depend on JavaScript to un-hide them. A
   <noscript> rule covers JavaScript being disabled, but not the commoner case
   of the bundle failing, erroring or arriving late — and this site is
   pre-rendered precisely so the HTML is the product.

   Nothing here is ever hidden and left waiting:

     · server and first client render carry no motion styles at all — the
       shipped HTML is fully visible, verified at 0 occurrences of `opacity:0`;
     · an element already on screen at mount never animates, so nothing moves
       under a reader and §31's LCP element is untouched;
     · an element below the fold PLAYS a 0 -> 1 keyframe when it scrolls in.
       It is not parked at 0 beforehand, so a missing or late observer, a
       throttled tab or a dead animation frame all degrade to "already visible".

   The failure mode is "no animation", never "no content".

   §27.4 — reduced motion disables #3 entirely: no observer, no motion wrapper.
   §31.4 — LazyMotion + domAnimation + `m`, so the full library never loads.
--------------------------------------------------------------------------- */

const DISTANCE = 8; // px
const DURATION = 0.3; // 300ms
const STAGGER = 0.06; // 60ms

/*
  KEYFRAMES, NOT A HIDDEN STATE. The element is never parked at opacity 0
  waiting for an observer to release it — it simply plays 0 -> 1 and 8px -> 0
  once, when it scrolls in. If the observer never fires, or the animation never
  runs, the element is already visible and nothing is lost. There is no state
  the content can get stuck in.
*/
const child: Variants = {
  run: {
    opacity: [0, 1],
    y: [DISTANCE, 0],
    transition: { duration: DURATION, ease: 'easeOut' },
  },
};

const parent: Variants = {
  run: { transition: { staggerChildren: STAGGER } },
};

type Phase = 'idle' | 'run';

/**
 * 'idle' until we know the element is off-screen. Returns the phase plus the
 * ref to attach. Once 'shown' is reached it never goes back — "once only".
 */
function useRevealPhase(enabled: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>('idle');

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    // Already on screen when the page arrived — it is being read right now, so
    // it must not move. This is also what keeps §31's LCP element unanimated.
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    if (typeof IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setPhase('run');
          io.disconnect(); // once only
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [enabled]);

  // `as` can render a non-div element; the observer only needs an Element.
  return { ref: ref as React.RefObject<never>, phase };
}

export interface RevealProps {
  children: ReactNode;
  /** Stagger direct <RevealItem> children by 60ms instead of moving as one block. */
  stagger?: boolean;
  as?: ElementType;
  className?: string;
}

export function Reveal({ children, stagger = false, as, className }: RevealProps) {
  const reducedMotion = useReducedMotion();
  const { ref, phase } = useRevealPhase(!reducedMotion);

  // §27.4 — rendered visible, with no motion wrapper at all.
  if (reducedMotion) {
    const Tag = as ?? 'div';
    return <Tag className={className}>{children}</Tag>;
  }

  const Component = as ? m.create(as) : m.div;

  return (
    <LazyMotion features={domAnimation} strict>
      <Component
        ref={ref}
        // Reflects the phase so the reveal state is inspectable in the DOM.
        // The noscript rule in RootLayout keys off the attribute's presence.
        data-reveal={phase}
        className={className}
        // `false` is what keeps the shipped HTML free of any hidden style.
        initial={false}
        animate={phase === 'idle' ? undefined : phase}
        variants={stagger ? parent : child}
      >
        {children}
      </Component>
    </LazyMotion>
  );
}

/** One staggered item. Only meaningful inside a <Reveal stagger>. */
export function RevealItem({
  children,
  as,
  className,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    const Tag = as ?? 'div';
    return <Tag className={className}>{children}</Tag>;
  }

  const Component = as ? m.create(as) : m.div;
  return (
    <Component data-reveal="" className={className} variants={child}>
      {children}
    </Component>
  );
}
