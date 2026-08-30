import type { ReactNode, ElementType } from 'react';
import { cn } from '../../lib/cn';

/* ---------------------------------------------------------------------------
   CONTAINER — master.md §26.1
   Props: width: default | wide | narrow
   "Single source of layout width" (§26.1).

   §25.3 gives all three widths and the responsive gutters:
     default 1280px · wide (full-bleed max) 1440px · narrow (prose) 720px
     gutters 20px mobile -> 32px tablet -> 48px desktop  (--gutter)
--------------------------------------------------------------------------- */

export type ContainerWidth = 'default' | 'wide' | 'narrow';

export interface ContainerProps {
  width?: ContainerWidth;
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

/** §25.3 — the only three widths in the system. */
const WIDTH: Record<ContainerWidth, string> = {
  default: '[max-width:var(--container-default)]',
  wide: '[max-width:var(--container-wide)]',
  narrow: '[max-width:var(--container-narrow)]',
};

export function Container({
  width = 'default',
  as: Tag = 'div',
  className,
  children,
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        'w-full mx-auto',
        // §25.3 gutters. §29.2: "No horizontal overflow at any width."
        '[padding-inline:var(--gutter)]',
        WIDTH[width],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
