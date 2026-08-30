import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

/* ---------------------------------------------------------------------------
   HEADING — master.md §26.1
   Props: level: 1–4, size

   "Decouples semantic level from visual size — prevents the classic 'we
   skipped an h2 to get the right size' defect" (§26.1). §30.1 makes it a
   requirement: "One <h1> per page, no skipped levels (enforced by the Heading
   primitive)." §21.3 repeats it for SEO.

   Unlike Button's `size` — which has no documented values anywhere — Heading's
   sizes ARE documented: §24.2's scale supplies display, h1, h2, h3, h4.

   §24.3 supplies tracking, line-height and weight per step:
     tracking   display/H1 -0.03em · H2/H3 -0.02em
     weights    700 H1/H2/display · 600 H3/H4
     alignment  "Left, always."
--------------------------------------------------------------------------- */

export type HeadingLevel = 1 | 2 | 3 | 4;
export type HeadingSize = 'display' | 'h1' | 'h2' | 'h3' | 'h4';

export interface HeadingProps {
  level: HeadingLevel;
  size?: HeadingSize;
  id?: string;
  className?: string;
  children: ReactNode;
}

/**
 * §24.2 font-size · §24.3 tracking, line-height and weight.
 *
 * h4 tracking: §24.3 specifies display/H1 and H2/H3 but stops there. h4 takes
 * the nearest documented value (--tracking-heading) rather than an invented
 * one. Recorded in implementation.md §5.1.2.
 */
const SIZE: Record<HeadingSize, string> = {
  display:
    'text-display font-bold [letter-spacing:var(--tracking-display)] [line-height:var(--lh-display)]',
  h1: 'text-h1 font-bold [letter-spacing:var(--tracking-display)] [line-height:var(--lh-display)]',
  h2: 'text-h2 font-bold [letter-spacing:var(--tracking-heading)] [line-height:var(--lh-heading)]',
  h3: 'text-h3 font-semibold [letter-spacing:var(--tracking-heading)] [line-height:var(--lh-heading)]',
  h4: 'text-h4 font-semibold [letter-spacing:var(--tracking-heading)] [line-height:var(--lh-heading)]',
};

/** Default visual size mirrors the semantic level; callers override freely. */
const DEFAULT_SIZE: Record<HeadingLevel, HeadingSize> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
};

export function Heading({ level, size, id, className, children }: HeadingProps) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4';
  const visual = size ?? DEFAULT_SIZE[level];

  return (
    <Tag
      id={id}
      // §24.3 "Alignment: Left, always." Centred headlines are permitted only
      // in the close section, which opts in via className.
      className={cn('font-sans text-left text-balance', SIZE[visual], className)}
    >
      {children}
    </Tag>
  );
}
