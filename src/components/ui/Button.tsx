import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react';
import { useSurface } from './surface';

/* ---------------------------------------------------------------------------
   BUTTON — master.md §26.1 primitive 1 of 9

   Props are §26.1's: variant, size, href | onClick, surface.

   `surface` selects the correct blue automatically. That is how §23.2's one
   fragile rule — "--blue-600 is never placed on --ink" (3.86:1) — is enforced
   in code rather than in review. A caller cannot express the failing pair.

   Specification decisions, all recorded in implementation.md §5.1.1:
     · padding 14/28 and 12/24 come from §25.4 verbatim and are an intentional
       documented exception to §25.1's spacing scale
     · `size` has no documented values anywhere; the prop exists as specified
       with a single member until Phase 4 defines a scale
     · tertiary and ghost have no documented padding, colour or border beyond
       §17.4's one line each; they get no padding box
     · dark-surface secondary and dark primary hover are NOT specified in
       §23.3 and are derived by documented substitution only
     · disabled is not documented at all; semantics only, no invented visuals
     · no border-radius: §22.2 permits small radii but defines no token
--------------------------------------------------------------------------- */

/** §17.4 — the four documented variants. No others exist. */
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost';

/**
 * §26.1 documents a `size` prop but **no document defines any size values**.
 * A single member keeps the documented API without inventing a scale. Phase 4
 * widens this union; nothing else changes. See implementation.md §5.1.1 B1.
 */
export type ButtonSize = 'default';

/** §23.3 — which blue is legal depends on the surface underneath. */
export type ButtonSurface = 'light' | 'dark';

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  surface?: ButtonSurface;
  children: ReactNode;
  className?: string;
}

export interface ButtonAsButtonProps
  extends
    ButtonBaseProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> {
  href?: undefined;
}

export interface ButtonAsLinkProps
  extends
    ButtonBaseProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> {
  /** §26.1 — `href | onClick`. With href this renders a real <a>. */
  href: string;
}

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

/**
 * §25.4 + §29.2 — "Minimum touch target 44×44px everywhere."
 *
 * Enforced on the element, never inferred from padding. §24.2/§24.3 assign no
 * font-size or line-height to buttons, so padding arithmetic cannot guarantee
 * 44px. inline-flex + centring makes the box the target, not the text.
 */
const BASE =
  'inline-flex items-center justify-center gap-2 ' +
  '[min-height:var(--touch-min)] [min-width:var(--touch-min)] ' +
  'font-sans font-medium text-small text-center no-underline ' +
  'cursor-pointer select-none ' +
  // §27.2 #9 — the ONLY motion on a button: press, scale(0.98), 80ms.
  // Scoped to transform deliberately. §27.5: "Animate only transform and
  // opacity." Tailwind's colour-transition utility also transitions
  // outline-color, which animates the focus ring and breaks §27.2 #10
  // ("Focus ring — instant, never animated"). Hover colour changes are
  // therefore instant, and no colour transition ships: §27.2 lists ten
  // motions and a button colour fade is not among them.
  //
  // (That utility's name is deliberately not written here: Tailwind scans
  // comments too, and naming it would emit dead CSS.)
  'transition-transform duration-[80ms] active:scale-[0.98] ' +
  // §23.3 — focus ring 2px, 2px offset, never removed. §30.3.
  'focus-visible:outline-2 focus-visible:outline-offset-2 ' +
  // §5.1.1 B4 — disabled is undocumented: semantics only, no invented visuals.
  'disabled:cursor-not-allowed aria-disabled:cursor-not-allowed';

/**
 * §25.4 padding, transcribed verbatim. See the note in tokens.css: 14px/28px
 * is an intentional documented exception to §25.1 and was not rounded.
 *
 * tertiary and ghost take no padding box — §17.4 describes tertiary as
 * "text + arrow" and says nothing about ghost's box at all. Absence of padding
 * is the absence of a decision, not a new one. Both still meet 44×44 via BASE.
 */
const PADDING: Record<ButtonVariant, string> = {
  primary: '[padding:var(--btn-pad-primary)]',
  secondary: '[padding:var(--btn-pad-secondary)]',
  tertiary: '',
  ghost: '',
};

/**
 * §23.3, exactly as written for the four rows it specifies.
 *
 * These deliberately use the RAW palette, not the theme-aware semantic tokens.
 * A button's colours are relative to the SURFACE beneath it, not to the theme:
 * the label on a --blue-500 fill must be --ink whether the page is light or
 * dark. The theme is handled one level up, by SurfaceContext reporting 'dark'
 * for every tone when the dark theme is active — which is what keeps §23.2's
 * rule intact, since in dark mode every surface is dark.
 *
 * Rows marked DERIVED are NOT in §23.3. They apply that table's own
 * dark-surface substitutions (--line → --line-dark, --ink → --paper,
 * --blue-600 → --blue-500) because §23.3 gives no dark secondary and no dark
 * primary hover. Recorded in implementation.md §5.1.1 B3.
 */
const VARIANT: Record<ButtonSurface, Record<ButtonVariant, string>> = {
  light: {
    // §23.3 "Primary button: --blue-600 fill, --paper label; hover --blue-700"
    primary: 'bg-blue-600 text-paper hover:bg-blue-700 focus-visible:outline-blue-600',
    // §23.3 "Secondary button: 1px --line border, --ink label; hover border/label --blue-600"
    secondary:
      'border border-line text-ink hover:border-blue-600 hover:text-blue-600 focus-visible:outline-blue-600',
    // §17.4 "text + arrow, blue, underline on hover".
    tertiary: 'text-blue-700 hover:underline focus-visible:outline-blue-600',
    // §17.4 gives ghost no colour, border or padding.
    ghost: 'text-ink hover:text-blue-600 focus-visible:outline-blue-600',
  },
  dark: {
    // §23.3 "Primary button on dark: --blue-500 fill, --ink label". Hover: DERIVED.
    primary: 'bg-blue-500 text-ink focus-visible:outline-blue-500',
    // DERIVED — §23.3 specifies no dark secondary.
    secondary:
      'border border-line-dark text-paper hover:border-blue-500 hover:text-blue-500 focus-visible:outline-blue-500',
    tertiary: 'text-blue-500 hover:underline focus-visible:outline-blue-500',
    ghost: 'text-paper hover:text-blue-500 focus-visible:outline-blue-500',
  },
};

/**
 * Renders a real <button> by default and a real <a> when `href` is given
 * (§26.1's `href | onClick`). Never a <div> or <span> — §30.6 calls that
 * "a defect, not an implementation".
 */
export function Button(props: ButtonProps) {
  // §23.2's rule enforced by construction: the surface defaults from whatever
  // Section painted, so a caller cannot land --blue-600 on --ink by forgetting
  // a prop. An explicit `surface` still wins for buttons outside a Section.
  const inheritedSurface = useSurface();

  const {
    variant = 'primary',
    size = 'default',
    surface = inheritedSurface,
    className = '',
    children,
    ...rest
  } = props;

  // `size` is part of the documented API but has no documented values, so it
  // cannot yet affect rendering. Referenced so it is never silently dropped.
  void size;

  const classes = [BASE, PADDING[variant], VARIANT[surface][variant], className]
    .filter(Boolean)
    .join(' ');

  if (typeof rest.href === 'string') {
    const { href, ...anchorRest } = rest as ButtonAsLinkProps;
    return (
      <a href={href} className={classes} {...anchorRest}>
        {children}
      </a>
    );
  }

  const { href: _ignored, ...buttonRest } = rest as ButtonAsButtonProps;
  void _ignored;

  return (
    <button type="button" className={classes} {...buttonRest}>
      {children}
    </button>
  );
}
