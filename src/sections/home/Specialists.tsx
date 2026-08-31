import type { ReactNode } from 'react';
import {
  ArrowRight,
  BarChart3,
  Database,
  FlaskConical,
  Sparkles,
  Target,
  UsersRound,
} from 'lucide-react';
import { Link } from 'react-router';
import { Container, Heading, Section } from '../../components/ui';
import { Reveal } from '../../components/motion/Reveal';
import { PRINCIPLES, SPECIALISTS_SECTION } from '../../data/home';

/**
 * 05 WHY IT WORKS — wireframe.md §05, master.md §13 §5
 *
 * Built to the supplied reference: a centred eyebrow ruled on both sides, a
 * large centred heading with the last word in accent, and the six principles as
 * ONE JOINED GRID rather than six cards floating in gaps. Each cell carries a
 * full border and is pulled a pixel left and up so adjacent borders collapse
 * into a single hairline — see `.disc-card` in globals.css.
 *
 * Six items because there are six disciplines. The count is arithmetic, not a
 * grid that happened to need filling.
 *
 * THE HOVER ALTERNATES BY POSITION: cards 1, 3 and 5 take a blue border and
 * nothing else; cards 2, 4 and 6 fill blue. Nothing scales and nothing lifts.
 * The rule lives in `.disc-card` in globals.css, keyed on `nth-child` rather
 * than on a prop, because the pattern belongs to the position in the grid and
 * not to any principle's meaning.
 *
 * ⚠ Partner badges are still not built. Trenvo holds no partnership or
 * certification, and §2.8 forbids inventing one.
 */

const ICONS = [Target, Database, Sparkles, FlaskConical, BarChart3, UsersRound] as const;

/** A short rule either side of a centred label, as the reference draws it. */
function RuledLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-4">
      <span aria-hidden="true" className="h-px w-10 bg-hairline sm:w-16" />
      {children}
      <span aria-hidden="true" className="h-px w-10 bg-hairline sm:w-16" />
    </div>
  );
}

export function Specialists() {
  return (
    <Section tone="surface" aria-labelledby="specialists-heading">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-[52rem] text-center">
            <RuledLabel>
              <p className="font-mono text-label uppercase tracking-[var(--tracking-label)] text-accent">
                Why it works
              </p>
            </RuledLabel>

            <Heading
              level={2}
              size="h2"
              align="center"
              id="specialists-heading"
              className="mt-6 text-primary [text-wrap:balance]"
            >
              Six disciplines. One outcome: <span className="text-accent">growth.</span>
            </Heading>

            <p className="mx-auto mt-5 max-w-[46ch] text-body text-secondary [line-height:var(--lh-body)]">
              {SPECIALISTS_SECTION.headline}
            </p>
          </div>

          {/*
            One joined grid. The cells collapse their shared borders via the
            negative margins in `.disc-card`, so this reads as a single ruled
            block rather than six detached boxes.
          */}
          <ul className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map((principle, i) => {
              const PrincipleIcon = ICONS[i] ?? Target;
              const number = String(i + 1).padStart(2, '0');
              return (
                <li
                  key={principle.id}
                  className="disc-card flex flex-col border border-hairline bg-base p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <span className="disc-card__icon inline-flex size-12 shrink-0 items-center justify-center bg-accent text-paper">
                        <PrincipleIcon aria-hidden="true" className="size-6" />
                      </span>

                      <div>
                        <p className="font-mono text-h4 leading-none text-accent">
                          {number}
                        </p>
                        <span
                          aria-hidden="true"
                          className="disc-card__rule mt-2 block h-px w-6 bg-accent"
                        />
                        <h3 className="mt-3 text-h4 text-primary [line-height:var(--lh-heading)]">
                          {principle.title}
                        </h3>
                      </div>
                    </div>

                    {/*
                      A real destination now: the page that actually explains
                      this principle. The `after` pseudo-element stretches the
                      link across the whole card, so the entire card is the hit
                      target while the accessible name stays specific — a
                      screen reader hears "Revenue focused — how we work", not
                      six identical "link, arrow".
                    */}
                    <Link
                      to={principle.href}
                      className="disc-card__arrowbox inline-flex size-8 shrink-0 items-center justify-center bg-accent/10 text-accent after:absolute after:inset-0 after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      <ArrowRight aria-hidden="true" className="size-4" />
                      <span className="sr-only">{principle.title}</span>
                    </Link>
                  </div>

                  <p className="mt-5 text-small text-secondary [line-height:var(--lh-body)]">
                    {principle.body}
                  </p>
                </li>
              );
            })}
          </ul>

          <div className="mt-12">
            <RuledLabel>
              <Link
                to={SPECIALISTS_SECTION.cta.href}
                className="group inline-flex items-center gap-2 text-body font-medium text-accent-strong [min-height:var(--touch-min)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {SPECIALISTS_SECTION.cta.label}
                <ArrowRight className="size-4 transition-transform duration-[250ms] group-hover:translate-x-1" />
              </Link>
            </RuledLabel>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
