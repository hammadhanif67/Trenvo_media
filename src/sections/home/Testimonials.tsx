import { useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { Container, Eyebrow, Heading, Section } from '../../components/ui';
import { BrandWordmark } from '../../components/media/BrandWordmark';
import { HERO_CONTENT } from '../../components/hero/heroContent';
import { TESTIMONIALS } from '../../data/testimonials';

/**
 * CLIENT PROOF — "In their words"
 *
 * ⚠ THE REFERENCE IMAGE IS FABRICATED, and the brief says so itself: it shows
 * six brands (LeadsFlow, NutriHealth, eCommify, Brand Aura, FitZone, HomeBase)
 * that appear nowhere in this project, four invented quotes, four sets of five
 * stars, and a "3X increase in leads" nobody can check. None of it is built.
 *
 * The brief's own rule is the one followed: reuse the REAL trust brands from
 * the hero. Those are Soralune, HOLY, Healthify, Glowri and NutriPure, from
 * `HERO_CONTENT.trustBrands` — the same data the hero row reads, so the two can
 * never drift apart and removing a brand there removes its card here.
 *
 * ⚠ THAT IS FIVE BRANDS, NOT SIX. The brief asks for a 3x2 grid of six client
 * cards; there are five real clients. Inventing a sixth is exactly what the
 * brief forbids, so the sixth tile is NOT a client — it is the invitation to
 * become one, in the same shell so the grid stays square and aligned. It says
 * what it is.
 *
 * ⚠ NO PER-BRAND SERVICE LINE. The brief's card structure wants a service
 * (PAID SOCIAL, MEDIA BUYING, and so on) under each client. The project records
 * WHO the clients are, never WHAT was delivered to each, so a service line
 * would be an invented engagement scope. Each card carries the brand's own
 * sector instead, which is real data, and says plainly that no quote is
 * published yet.
 *
 * STARS ARE NOT BUILT, in any state. A star rating is an aggregate-rating
 * signal that implies a review platform standing behind it. There is none.
 *
 * SELF-FILLING. Add a real, attributed, permitted entry to `TESTIMONIALS` with
 * its `brand` set, and that card swaps its pending note for the quote. Nothing
 * here needs editing for that to happen.
 */

/**
 * The fill grows from wherever the pointer actually crossed the edge — every
 * angle, not four. `--ex`/`--ey` are that point; `--er` is the distance from it
 * to the FARTHEST corner, which is the radius the circle needs to cover the
 * whole card from an off-centre start without the overdraw a blanket 150%
 * would cost.
 */
function setFillOrigin(el: HTMLElement, clientX: number, clientY: number) {
  const r = el.getBoundingClientRect();
  const x = clientX - r.left;
  const y = clientY - r.top;
  const reach = Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y));
  el.style.setProperty('--ex', `${x}px`);
  el.style.setProperty('--ey', `${y}px`);
  el.style.setProperty('--er', `${reach}px`);
}

export function Testimonials() {
  const brands = HERO_CONTENT.trustBrands;

  /*
    The origin is NOT reset on leave, so the circle collapses back to the point
    it grew from rather than snapping away. The pointer position separately
    feeds a very small highlight — see `.client-card__fill` for how restrained
    it is kept.
  */
  const fill = useMemo(
    () => ({
      onPointerEnter: (e: React.PointerEvent<HTMLElement>) => {
        setFillOrigin(e.currentTarget, e.clientX, e.clientY);
      },
      onPointerMove: (e: React.PointerEvent<HTMLElement>) => {
        const el = e.currentTarget;
        const r = el.getBoundingClientRect();
        el.style.setProperty('--cx', `${e.clientX - r.left}px`);
        el.style.setProperty('--cy', `${e.clientY - r.top}px`);
      },
    }),
    [],
  );

  return (
    <Section tone="paper" aria-labelledby="testimonials-heading">
      <Container>
        <header className="mx-auto max-w-[46rem] text-center">
          <Eyebrow className="text-accent">In their words</Eyebrow>
          <Heading
            level={2}
            size="h2"
            align="center"
            id="testimonials-heading"
            className="mt-4 text-primary [text-wrap:balance]"
          >
            What our clients say<span className="text-accent">.</span>
          </Heading>
          <p className="mx-auto mt-5 max-w-[60ch] text-body text-secondary [line-height:var(--lh-body)]">
            These are the brands we work with. A quote goes up only once the client has
            approved it and it can carry their name — so the cards fill in as that
            permission comes, and not before.
          </p>
        </header>

        {/*
          3 x 2 on desktop, 2 up on tablet, 1 on mobile. `grid-auto-rows: 1fr`
          plus a flex `li` is what keeps all six the same height whatever the
          copy does — the lesson from the case-study rows: a grid item stretches
          but the box inside it does not.
        */}
        <ul className="mt-12 grid gap-5 [grid-auto-rows:1fr] sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand, i) => {
            const quote = TESTIMONIALS.find((t) => t.brand === brand.name);
            return (
              <li key={brand.name} className="flex">
                <article className="client-card" {...fill}>
                  <span className="client-card__fill" aria-hidden="true" />

                  <div className="relative z-10 flex h-full flex-col">
                    <div className="flex items-center justify-between">
                      <span className="client-card__num font-mono text-label">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="client-card__label text-label uppercase [letter-spacing:0.12em]">
                        Client
                      </span>
                    </div>

                    <h3 className="client-card__name mt-8">
                      <BrandWordmark brand={brand} />
                    </h3>

                    {brand.category && (
                      <p className="client-card__sector mt-2 text-small">{brand.category}</p>
                    )}

                    <div className="client-card__rule mt-auto border-t pt-5">
                      {quote ? (
                        <>
                          <blockquote className="client-card__note text-small [line-height:var(--lh-body)]">
                            {quote.quote}
                          </blockquote>
                          <p className="client-card__cta mt-3 text-small font-medium">
                            {quote.name} — {quote.role}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="client-card__note text-small [line-height:var(--lh-body)]">
                            No quote published yet.
                          </p>
                          <Link
                            to="/work"
                            className="client-card__cta mt-3 inline-flex items-center gap-2 text-small font-medium after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                          >
                            See our work
                            <ArrowRight
                              aria-hidden="true"
                              className="client-card__arrow size-4"
                            />
                            <span className="sr-only">— {brand.name}</span>
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              </li>
            );
          })}

          {/*
            THE SIXTH TILE IS NOT A CLIENT. There are five real ones and the
            grid wants six; the honest way to square it is to say what this is
            rather than invent a brand to fill the hole.

            It is filled and inverted against the theme — ink on light, paper on
            dark — so it reads as the one ACTION in the grid rather than a
            client whose logo failed to load.
          */}
          <li className="flex">
            <article className="client-card client-card--cta" {...fill}>
              <span className="client-card__fill" aria-hidden="true" />

              <div className="relative z-10 flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <span className="client-card__num font-mono text-label">06</span>
                  <span className="client-card__label text-label uppercase [letter-spacing:0.12em]">
                    Open
                  </span>
                </div>

                <h3 className="client-card__cta client-card__name mt-8 text-[1.35rem] font-semibold leading-none tracking-tight">
                  Your brand next
                </h3>

                <p className="client-card__sector mt-2 text-small">
                  Paid media · Creative · AI video
                </p>

                <div className="client-card__rule mt-auto border-t pt-5">
                  <p className="client-card__note text-small [line-height:var(--lh-body)]">
                    Tell us what you sell and who you need to reach.
                  </p>
                  <Link
                    to="/contact"
                    className="client-card__cta mt-3 inline-flex items-center gap-2 text-small font-medium after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    Start a project
                    <ArrowRight aria-hidden="true" className="client-card__arrow size-4" />
                  </Link>
                </div>
              </div>
            </article>
          </li>
        </ul>
      </Container>
    </Section>
  );
}
