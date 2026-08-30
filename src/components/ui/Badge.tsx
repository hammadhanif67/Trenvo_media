import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { useSurface } from './surface';

/* ---------------------------------------------------------------------------
   BADGE — master.md §26.1
   Props: tone: neutral | blue | mono
   "Discipline and practice labels" (§26.1).

   The three tones are named in §26.1 but no fill, border or padding is
   specified for any of them. Implemented with documented tokens only:
     neutral  hairline border (§23.3) + secondary text colour (§23.3)
     blue     --blue-50 "tint background" (§23.1) with --blue-700 text on
              light; on dark, no blue surface is documented, so it stays a
              hairline with --blue-500 text (§23.4 forbids blue as a large
              background surface, and §23.3 gives --blue-500 as the dark blue)
     mono     the §22.2 principle 3 technical voice — mono, uppercase, tracked

   Padding uses --space-label-heading (12px) and --s-2 (8px), both on the
   §25.1 scale. Recorded as a minimal implementation in implementation.md
   §5.1.2 — no value here is invented, but the composition is a judgement.
--------------------------------------------------------------------------- */

export type BadgeTone = 'neutral' | 'blue' | 'mono';

export interface BadgeProps {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}

export function Badge({ tone = 'neutral', className, children }: BadgeProps) {
  const surface = useSurface();
  const dark = surface === 'dark';

  const TONE: Record<BadgeTone, string> = {
    neutral: dark
      ? 'border border-hairline text-onpunct-2'
      : 'border border-hairline text-secondary',
    blue: dark ? 'border border-hairline text-blue-500' : 'bg-blue-50 text-accent-strong',
    mono: dark
      ? 'border border-hairline text-onpunct font-mono uppercase [letter-spacing:var(--tracking-label)]'
      : 'border border-hairline text-primary font-mono uppercase [letter-spacing:var(--tracking-label)]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center text-label leading-none',
        'py-2 px-3',
        TONE[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
