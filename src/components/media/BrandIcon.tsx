import { BRAND_PATHS, type BrandMark } from './brandMarks';

/**
 * Renders one third-party brand mark from `brandMarks.ts`.
 *
 * §30.6 — always `aria-hidden`. The accessible name belongs to the link or the
 * heading beside it, so a screen reader hears "Meta Ads" rather than a shape.
 */
export interface BrandIconProps {
  name: BrandMark;
  className?: string;
}

export function BrandIcon({ name, className }: BrandIconProps) {
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
