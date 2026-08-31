import { useTheme } from '../../hooks/useTheme';
import type { TrustBrand } from './heroContent';

/* ---------------------------------------------------------------------------
   CLIENT WORDMARKS

   Set as text, not as image files. No logo assets were supplied, and tracing
   another company's mark into an SVG would be a worse guess than lettering the
   name honestly — a wrong curve on someone's trademark is a real problem, a
   faithful setting of their name is not.

   Each mark keeps its own face and colour so the row reads as five brands
   rather than five list items in Trenvo's typeface.

   THEME. The reference sets these on white. Several of the brand colours —
   the greens especially — fall through the floor on a dark surface, so each
   carries a lighter variant used only in the dark theme. The hue is preserved;
   only the lightness moves, which is the smallest change that keeps them
   readable without repainting anyone's brand.
--------------------------------------------------------------------------- */

const FACE: Record<TrustBrand['face'], string> = {
  script: 'font-serif italic',
  serif: 'font-serif',
  sans: 'font-sans',
};

/** The four-dot glyph that sits beside the Healthify wordmark. */
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

export function HeroTrustBrands({
  label,
  brands,
}: {
  label: string;
  brands: TrustBrand[];
}) {
  const dark = useTheme() === 'dark';

  // No clients, no block — removing the data removes the row entirely.
  if (brands.length === 0) return null;

  return (
    <div className="mt-12">
      <p className="text-small text-primary">{label}</p>

      {/*
        Sized to fit all five on ONE line inside the left column, as in the
        reference. At 1.45rem with a 2.5rem gap the row needed more than the
        ~606px available and NutriPure wrapped to a second line.
      */}
      <ul className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-5 sm:gap-x-7">
        {brands.map((brand) => {
          const colour = dark ? brand.dark : brand.light;
          const head =
            brand.splitAt != null ? brand.name.slice(0, brand.splitAt) : brand.name;
          const tail = brand.splitAt != null ? brand.name.slice(brand.splitAt) : '';

          return (
            <li key={brand.name} className="flex items-center gap-2">
              {brand.mark === 'healthify' && <HealthifyMark />}

              <span className="flex flex-col leading-none">
                <span
                  className={[
                    FACE[brand.face],
                    'text-[1.15rem] font-semibold leading-none tracking-tight',
                  ].join(' ')}
                  style={{ color: colour }}
                >
                  {/* NutriPure sets "Nutri" lighter than "Pure". */}
                  {tail ? (
                    <>
                      <span style={{ opacity: 0.72 }}>{head}</span>
                      <span>{tail}</span>
                    </>
                  ) : (
                    head
                  )}
                </span>

                {brand.category && (
                  <span
                    className="mt-1 font-sans text-[0.55rem] font-medium uppercase leading-none [letter-spacing:0.14em]"
                    style={{ color: colour }}
                  >
                    {brand.category}
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
