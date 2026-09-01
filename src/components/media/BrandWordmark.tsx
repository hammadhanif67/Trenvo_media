import type { Client } from '../../data/clients';

/* ---------------------------------------------------------------------------
   BRAND WORDMARK — one client's name, set as text

   The same brands as the hero row, from the same data. No logo files were
   supplied, and tracing someone's trademark into an SVG is a worse guess than
   lettering their name honestly, so each mark keeps its own face and colour and
   is real HTML text — crawlable, translatable, and scalable.

   NO GLYPH HERE, and that is an alignment decision. Only Healthify carries a
   symbol, and inline it pushed that one name to x=49 while the other four sat
   at x=25 — one indented name in a grid of six reads as a mistake. The names
   are `<h3>`s in a column and their left edge has to be a straight line, so the
   glyph stays in the hero row where the marks sit side by side and nothing is
   in a column. Nothing is lost: it is decorative, `aria-hidden`, and the brand
   is still named, coloured and lettered as its own.

   TWO FURTHER DIFFERENCES FROM THE HERO ROW, both forced by contrast:

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

const FACE: Record<Client['face'], string> = {
  script: 'font-serif italic',
  serif: 'font-serif',
  sans: 'font-sans',
};

export function BrandWordmark({ brand }: { brand: Client }) {
  return (
    <span
      className={`client-card__mark ${FACE[brand.face]} text-[1.35rem] font-semibold leading-none tracking-tight`}
      style={
        {
          '--mark-light': brand.light,
          '--mark-dark': brand.dark,
        } as React.CSSProperties
      }
    >
      {brand.name}
    </span>
  );
}
