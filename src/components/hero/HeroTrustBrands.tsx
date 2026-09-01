import type { Client } from '../../data/clients';

/* ---------------------------------------------------------------------------
   CLIENT WORDMARKS

   Set as text, not as image files. No logo assets were supplied, and tracing
   another company's mark into an SVG would be a worse guess than lettering the
   name honestly — a wrong curve on someone's trademark is a real problem, a
   faithful setting of their name is not.

   Each mark keeps its own face and colour so the row reads as five brands
   rather than five list items in Trenvo's typeface.

   ALWAYS THE LIGHT COLOURS. The hero is an isolated light surface in both
   themes (implementation.md §5.27), so the brands sit on white either way and
   the light values are always the correct ones. `dark` is kept on the data for
   the day this row appears on a dark surface elsewhere.

   ⚠ THIS RENDERS NOTHING TODAY. `CLIENTS` in data/clients.ts is gated behind
   PUBLISH_CLIENTS, which is false: the row was showing five names with no case
   study, no quote and no engagement behind any of them, which is unsupported
   proof whatever the underlying relationships are. The heading is part of the
   block, so it disappears with the names rather than standing over an empty
   row. Read the header of data/clients.ts before opening the gate.
--------------------------------------------------------------------------- */

const FACE: Record<Client['face'], string> = {
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
      className="size-3 shrink-0 sm:size-4"
      fill="#f0353b"
    >
      <circle cx="7" cy="7" r="4.4" />
      <circle cx="17" cy="7" r="4.4" />
      <circle cx="7" cy="17" r="4.4" />
      <circle cx="17" cy="17" r="4.4" />
    </svg>
  );
}

export function HeroTrustBrands({ clients }: { clients: Client[] }) {
  // No publishable clients, no block. The heading goes with them.
  if (clients.length === 0) return null;

  return (
    <div className="mt-12">
      {/*
        The heading only ever appears above real, permitted names with something
        behind them — see the three conditions in data/clients.ts. "Trusted by"
        over an empty or unsupported row is the classic fabricated social-proof
        pattern, and the build audit fails if this string reaches the HTML while
        the gate is shut.
      */}
      <p className="text-small text-primary">Trusted by growth-focused brands</p>

      {/*
        STRICTLY ONE LINE. `flex-wrap` let the row break whenever the copy
        column was narrower than the five marks needed — which is why NutriPure
        kept dropping underneath. `flex-nowrap` removes that escape hatch, and
        the type and gaps scale down with the viewport so the row fits instead
        of wrapping. `min-w-0` on each item lets flexbox shrink them rather than
        forcing an overflow.
      */}
      <ul className="mt-5 flex flex-nowrap items-center gap-x-3 sm:gap-x-5 lg:gap-x-6">
        {clients.map((brand) => {
          const colour = brand.light;
          const head =
            brand.splitAt != null ? brand.name.slice(0, brand.splitAt) : brand.name;
          const tail = brand.splitAt != null ? brand.name.slice(brand.splitAt) : '';

          return (
            <li key={brand.name} className="flex min-w-0 items-center gap-2">
              {brand.mark === 'healthify' && <HealthifyMark />}

              <span className="flex flex-col leading-none">
                <span
                  className={[
                    FACE[brand.face],
                    'text-[0.8rem] font-semibold leading-none tracking-tight whitespace-nowrap sm:text-[0.95rem] lg:text-[1.1rem]',
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
                    className="mt-1 hidden font-sans text-[0.5rem] font-medium whitespace-nowrap uppercase leading-none [letter-spacing:0.12em] sm:block sm:text-[0.55rem]"
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
