import type { ReactNode, ElementType, Ref } from 'react';
import { cn } from '../../lib/cn';
import { SurfaceContext } from './surface';
import { useTheme } from '../../hooks/useTheme';

/* ---------------------------------------------------------------------------
   SECTION — master.md §26.1
   Props: tone: paper | surface | ink, padding

   "Owns vertical rhythm and background; nothing else sets section padding"
   (§26.1). §26.3 repeats it: "Sections never set their own padding or
   background — Section owns both."

   Vertical rhythm is §25.2, already tokenised per breakpoint. Dark sections
   take one step more (--section-pad-ink).

   §22.2 principle 7: dark sections are punctuation. On the homepage exactly
   four are ink — hero, loop, proof, close — per the approved Conflict A
   resolution in implementation.md §1.1.

   Section also publishes its surface so Button picks the legal blue (§23.2).
--------------------------------------------------------------------------- */

export type SectionTone = 'paper' | 'surface' | 'ink';

/** §26.1's `padding` prop. `none` lets a full-bleed child own its own rhythm. */
export type SectionPadding = 'default' | 'none';

export interface SectionProps {
  /**
   * React 19 passes `ref` as an ordinary prop, so no forwardRef is needed. Used
   * by §27.2 #2's scroll-scrub to scope its GSAP context to one section.
   */
  ref?: Ref<HTMLElement>;
  tone?: SectionTone;
  padding?: SectionPadding;
  as?: ElementType;
  id?: string;
  'aria-labelledby'?: string;
  className?: string;
  children: ReactNode;
}

/** §23.3 — background and default text colour per tone. */
const TONE: Record<SectionTone, string> = {
  paper: 'bg-base text-primary',
  surface: 'bg-alt text-primary',
  ink: 'bg-punct text-onpunct',
};

export function Section({
  tone = 'paper',
  padding = 'default',
  as: Tag = 'section',
  className,
  children,
  ...rest
}: SectionProps) {
  // §25.2 — dark sections take one step more than adjacent light sections.
  const padClass =
    padding === 'none'
      ? ''
      : tone === 'ink'
        ? '[padding-block:var(--section-pad-ink)]'
        : '[padding-block:var(--section-pad)]';

  // §23.2's rule holds in both themes. In the dark theme EVERY surface is dark
  // (§23.5 note in tokens.css), so every Section reports a dark surface and
  // Button resolves to --blue-500 throughout. --blue-600 can never land on ink.
  const theme = useTheme();
  const surface = theme === 'dark' || tone === 'ink' ? 'dark' : 'light';

  return (
    <SurfaceContext.Provider value={surface}>
      <Tag className={cn(TONE[tone], padClass, className)} {...rest}>
        {children}
      </Tag>
    </SurfaceContext.Provider>
  );
}
