import { cn } from '../../lib/cn';

/* ---------------------------------------------------------------------------
   RULE — master.md §26.1: "Hairline divider", prop `tone`.

   §23.3: "Hairlines: --line on light, --line-dark on dark."
   §22.2 principle 4: "Structure is visible. Hairlines, grids and alignment are
   shown rather than hidden. Visible structure reads as engineering."
--------------------------------------------------------------------------- */

export type RuleTone = 'light' | 'dark';

export interface RuleProps {
  tone?: RuleTone;
  className?: string;
}

const TONE: Record<RuleTone, string> = {
  light: 'border-hairline',
  dark: 'border-hairline',
};

export function Rule({ tone = 'light', className }: RuleProps) {
  return <hr className={cn('w-full border-0 border-t', TONE[tone], className)} />;
}
