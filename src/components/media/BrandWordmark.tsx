import type { TrustBrand } from '../hero/heroContent';

/* ---------------------------------------------------------------------------
   BRAND WORDMARK — one client's name, set as text

   The same brands as the hero row, from the same data. No logo files were
   supplied, and tracing someone's trademark into an SVG is a worse guess than
   lettering their name honestly, so each mark keeps its own face and colour and
   is real HTML text — crawlable, translatable, and scalable.

   TWO DIFFERENCES FROM THE HERO ROW, both forced by contrast:

     1. It carries no `splitAt` fade. NutriPure sets "Nutri" at 72% opacity in
        the hero, which composites to 3.35:1 on white. That is fine for the
        hero's large decorative lettering; here the name is an <h3>, so it is
        real text and has to clear 4.5:1. At full opacity it measures 5.89:1.

     2. It switches colour by surface. The hero is an isolated light surface in
        both themes so it can always use `brand.light`; these cards sit on the
        page's own background and turn black on hover, where a colour like
        HOLY's #1a4fd6 would fall to 2.94:1. The dark value takes over there —
        #7aa2ff on black is 7.93:1.

   Both colours are published as custom properties and the CSS picks; see
   `.client-card__mark` in globals.css.
--------------------------------------------------------------------------- */

const FACE: Record<TrustBrand['face'], string> = {
  script: 'font-serif italic',
  serif: 'font-serif',
  sans: 'font-sans',
};

/** The four-dot glyph beside the Healthify wordmark. Decorative. */
function HealthifyMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className="size-4 shrink-0"
      fill="#f0353b"
    >
      <circle cx="7" cy="7" r="4.4" />
      <circle cx="17" cy="7" r="4.4" />
      <circle cx="7" cy="17" r="4.4" />
      <circle cx="17" cy="17" r="4.4" />
    </svg>
  );
}

export function BrandWordmark({ brand }: { brand: TrustBrand }) {
  return (
    <span
      className="client-card__mark inline-flex items-center gap-2"
      style={
        {
          '--mark-light': brand.light,
          '--mark-dark': brand.dark,
        } as React.CSSProperties
      }
    >
      {brand.mark === 'healthify' && <HealthifyMark />}
      <span
        className={`${FACE[brand.face]} text-[1.35rem] font-semibold leading-none tracking-tight`}
      >
        {brand.name}
      </span>
    </span>
  );
}
