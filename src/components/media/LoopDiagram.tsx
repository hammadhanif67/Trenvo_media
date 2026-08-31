import { useRef } from 'react';
import { cn } from '../../lib/cn';
import { useLoopMotion } from '../../hooks/useLoopMotion';
import { HERO_LOOP_MOTION } from '../../data/home';

/* ---------------------------------------------------------------------------
   LOOP DIAGRAM — master.md §26.2, §6.3, §13 §1

   "The Loop" is the named method (§6.3) and the central visual device
   (wireframe.md Part 4 item 3). §13 §1: "three labelled nodes (Media / Studio /
   ⚠ TWO nodes, not §13 §1's three: the Engineering practice is removed
   (implementation.md §5.22). The path and the method are unchanged.
   Black background, white
   type, single blue path."

   §29.2: "The Loop diagram has TWO COMPOSITIONS, not one scaled composition:
   horizontal on >=1024px, vertical on mobile." Both are rendered here and
   swapped by CSS, so there is no layout shift and no JS measurement.

   §30.6: "The Loop diagram carries a text alternative describing the model in
   words." That is the <title>/<desc> pair plus role="img".

   §27.2 #1 gives the draw animation to the hero: 900ms, once, GSAP. `mode`
   selects it — 'static' renders the final state and runs no JavaScript at all,
   which is also what every reduced-motion visitor gets (§27.4).
--------------------------------------------------------------------------- */

export type LoopDiagramMode = 'static' | 'draw' | 'scroll';

export interface LoopDiagramProps {
  mode?: LoopDiagramMode;
  className?: string;
}

const NODES = ['Media', 'Studio'] as const;

const TEXT_ALTERNATIVE =
  'The Loop: Media and Studio are two practices joined by a single continuous path, run as one system rather than as separate vendors.';

export function LoopDiagram({ mode = 'static', className }: LoopDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);

  // §27.2 #1's draw, plus the requested travel and scroll-scrub. Static mode
  // runs nothing, and reduced motion runs nothing whatever the mode
  // (§27.4) — the diagram simply renders in its final state.
  useLoopMotion(ref, mode !== 'static' && HERO_LOOP_MOTION);

  return (
    <div ref={ref} className={cn('w-full', className)}>
      {/* Horizontal composition — >=1024px (§29.2). */}
      <svg
        role="img"
        aria-labelledby="loop-title-h loop-desc-h"
        viewBox="0 0 640 300"
        className="hidden h-auto w-full lg:block"
      >
        <title id="loop-title-h">The Loop</title>
        <desc id="loop-desc-h">{TEXT_ALTERNATIVE}</desc>

        {/* §23.3 — "The Loop diagram path: --blue-500 on dark". */}
        <path
          data-loop-path
          d="M120 80 H520 A60 60 0 0 1 520 200 H120 A60 60 0 0 1 120 80 Z"
          fill="none"
          stroke="var(--blue-500)"
          strokeWidth="1.5"
        />
        {/* Rides the path once motion is on; invisible until then. */}
        <circle
          data-loop-traveller
          r="5"
          cx="120"
          cy="80"
          fill="var(--blue-500)"
          opacity="0"
        />

        {/*
          Two nodes sit at OPPOSITE ends of the path — Media at the top-left
          corner, Studio at the bottom-right. The old positions were derived
          from a three-node formula (x = 120 + i * 200), which with two nodes
          left them both in the left half and the right end of the loop empty.
        */}
        {NODES.map((node, i) => {
          const first = i === 0;
          const x = first ? 120 : 520;
          const y = first ? 80 : 200;
          return (
            <g key={node}>
              <circle cx={x} cy={y} r="6" fill="var(--blue-500)" />
              <text
                x={x}
                y={first ? 60 : 232}
                textAnchor="middle"
                fill="var(--paper)"
                className="font-mono"
                fontSize="13"
                letterSpacing="1.04"
              >
                {node.toUpperCase()}
              </text>
            </g>
          );
        })}

        <text
          x="320"
          y="148"
          textAnchor="middle"
          fill="var(--muted-dark)"
          className="font-mono"
          fontSize="13"
          letterSpacing="1.04"
        >
          THE LOOP
        </text>
      </svg>

      {/* Vertical composition — below 1024px (§29.2). A separate drawing, not a
          scaled copy: the path runs top-to-bottom so it reads on a phone. */}
      <svg
        role="img"
        aria-labelledby="loop-title-v loop-desc-v"
        viewBox="0 0 280 420"
        /*
          Capped, not just width-constrained. The vertical composition is 1:1.5,
          so at a 335px column it rendered 503px tall — taller than the headline
          it accompanies, which pushed the CTAs and trust row well below the
          fold. max-height lets it scale down and centre instead.
        */
        className="mx-auto block h-auto w-full max-h-80 lg:hidden"
      >
        <title id="loop-title-v">The Loop</title>
        <desc id="loop-desc-v">{TEXT_ALTERNATIVE}</desc>

        <path
          data-loop-path
          d="M80 60 V360 A40 40 0 0 0 200 360 V60 A40 40 0 0 0 80 60 Z"
          fill="none"
          stroke="var(--blue-500)"
          strokeWidth="1.5"
        />
        <circle
          data-loop-traveller
          r="5"
          cx="80"
          cy="60"
          fill="var(--blue-500)"
          opacity="0"
        />

        {/* Same reasoning as the horizontal composition: opposite ends. */}
        {NODES.map((node, i) => {
          const first = i === 0;
          const x = first ? 80 : 200;
          const y = first ? 60 : 360;
          return (
            <g key={node}>
              <circle cx={x} cy={y} r="6" fill="var(--blue-500)" />
              <text
                x={first ? x + 16 : x - 16}
                y={y + 5}
                textAnchor={first ? 'start' : 'end'}
                fill="var(--paper)"
                className="font-mono"
                fontSize="13"
                letterSpacing="1.04"
              >
                {node.toUpperCase()}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
