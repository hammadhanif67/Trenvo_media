import { BRAND_PATHS } from './brandMarks';

/* ---------------------------------------------------------------------------
   SOCIAL ICONS

   lucide-react removed its brand glyphs, so the four marks are inlined here as
   single-path SVGs. They are used nominatively — to point at Trenvo's own
   profiles on those platforms — which is what these marks are for. No
   partnership, endorsement or verification is implied or stated anywhere.

   §30.6 — every one is aria-hidden. The accessible name lives on the link in
   Footer.tsx, so assistive technology hears "Trenvo Media on LinkedIn" rather
   than a shape.
--------------------------------------------------------------------------- */

export type SocialName = 'LinkedIn' | 'Instagram' | 'YouTube' | 'X';

/*
  The paths moved to brandMarks.ts. YouTube is used both here and in the
  case-study categories, and two copies of a trademark path is two places to
  get it wrong.
*/

export interface SocialIconProps {
  name: SocialName;
  className?: string;
}

export function SocialIcon({ name, className }: SocialIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d={BRAND_PATHS[name]} />
    </svg>
  );
}
