import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { useSurface } from './surface';

/* ---------------------------------------------------------------------------
   PROSE — master.md §26.1: "Typographic defaults for long-form (teardowns,
   legal)". §26.3: "Cards never set their own typography — Heading and Prose
   own it."

   §24.3:  body line-height 1.6 · body tracking 0 · measure 62–72ch
           alignment left, always
   §23.3:  "Links in prose: --blue-700 on light, --blue-500 on dark, underlined"
   §25.3:  narrow container 720px is the companion width for this content
--------------------------------------------------------------------------- */

export interface ProseProps {
  as?: 'div' | 'article';
  className?: string;
  children: ReactNode;
}

export function Prose({ as: Tag = 'div', className, children }: ProseProps) {
  // §23.3 — the blue a link may use depends on the surface beneath it.
  const surface = useSurface();
  const linkColour =
    surface === 'dark' ? '[&_a]:text-blue-500' : '[&_a]:text-accent-strong';

  return (
    <Tag
      className={cn(
        'font-sans text-body text-left',
        '[line-height:var(--lh-body)] [letter-spacing:var(--tracking-body)]',
        // §24.3 — "62–72ch body maximum".
        '[max-width:var(--measure-body)]',
        // §25.4 — heading-to-body 16px, and paragraph rhythm from the scale.
        '[&>*+*]:mt-4',
        // §23.3 — links underlined, blue chosen by surface.
        '[&_a]:underline',
        linkColour,
        // §22.2 principle 4 — visible structure.
        '[&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6',
        '[&_li+li]:mt-2',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
