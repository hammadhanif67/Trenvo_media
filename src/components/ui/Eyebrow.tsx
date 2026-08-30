import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

/* ---------------------------------------------------------------------------
   EYEBROW — master.md §26.1: "Mono uppercase label".

   §24.2 --fs-label 13px. §24.3: mono label tracking +0.08em, uppercase.
   §22.2 principle 3: "Monospace carries the technical voice."

   COLOUR — a real constraint, not a preference. §23.1 annotates --subtle as
   "tertiary text on light — minimum size 16px", and §23.2 repeats it:
   "Tertiary labels, 16px minimum". An eyebrow is 13px, so --subtle is NOT
   available to it. --muted (7.56:1) is used on light and --muted-dark
   (7.72:1) on dark. Recorded in implementation.md §5.1.2.
--------------------------------------------------------------------------- */

export interface EyebrowProps {
  as?: 'p' | 'span' | 'div';
  className?: string;
  children: ReactNode;
}

export function Eyebrow({ as: Tag = 'p', className, children }: EyebrowProps) {
  return (
    <Tag
      className={cn(
        'font-mono text-label uppercase [letter-spacing:var(--tracking-label)]',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
