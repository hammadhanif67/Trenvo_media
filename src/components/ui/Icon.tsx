import type { LucideIcon, LucideProps } from 'lucide-react';
import { cn } from '../../lib/cn';

/* ---------------------------------------------------------------------------
   ICON — master.md §26.1
   "Lucide re-export, sized and stroke-normalised · One import surface, so icon
   weight stays consistent."

   §31.4: "Icons imported individually" — tree-shaking. Callers import the
   Lucide glyph they need and pass it here, so this file never pulls the whole
   set in.

   SIZING — no icon size is specified anywhere in either document. Rather than
   invent a scale, icons size to the type they sit beside (1em) and inherit
   currentColor. That keeps them consistent by construction and adds no new
   value to the system. A numeric override is available for the rare case that
   needs one. Recorded in implementation.md §5.1.2.

   STROKE — likewise unspecified. Lucide's own default (2) is used rather than
   a number chosen here; "stroke-normalised" is satisfied by fixing it in one
   place, which is exactly what this component is for.
--------------------------------------------------------------------------- */

export interface IconProps extends Omit<LucideProps, 'ref' | 'size' | 'color'> {
  /** The Lucide glyph, imported individually by the caller (§31.4). */
  icon: LucideIcon;
  /** Optional pixel size. Omit to track the surrounding font-size. */
  size?: number;
  className?: string;
}

/** Lucide's default stroke width. Fixed here so icon weight stays consistent. */
const STROKE_WIDTH = 2;

export function Icon({ icon: Glyph, size, className, ...rest }: IconProps) {
  return (
    <Glyph
      aria-hidden="true"
      focusable="false"
      strokeWidth={STROKE_WIDTH}
      // currentColor + 1em: the icon inherits the colour and scale of its
      // context, so it can never drift from the type it labels.
      color="currentColor"
      {...(size ? { size } : { width: '1em', height: '1em' })}
      className={cn('inline-block shrink-0', className)}
      {...rest}
    />
  );
}
