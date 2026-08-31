import { ArrowRight, Megaphone, Clapperboard } from 'lucide-react';
import { Link } from 'react-router';
import { Button, Container, Eyebrow, Heading, Icon, Section } from '../../components/ui';
import { HoverCard } from '../../components/ui/HoverCard';
import { Reveal } from '../../components/motion/Reveal';
import { PRACTICE_NAV } from '../../data/navigation';
import { PRACTICES } from '../../data/home';

/**
 * 04 SERVICES — wireframe.md §04, master.md §6.2, §9.5
 *
 * Rebuilt to the reference: a claim on the left, service cards on the right,
 * each card listing the routed services inside that practice.
 *
 * The card lists are REAL LINKS to real service pages, which is what makes this
 * section useful rather than decorative — and is the internal linking the SEO
 * brief asks for, with the service name as the anchor text rather than "read
 * more". `PRACTICE_NAV` is the same source the header menu uses, so a service
 * can never appear here and be missing from the menu.
 */
export function Practices() {
  return (
    <Section tone="paper" aria-labelledby="practices-heading">
      <Container>
        <Reveal>
          <div className="grid gap-12 lg:grid-cols-[20rem_1fr] lg:gap-16">
            {/* -------- LEFT: the claim -------- */}
            <div>
              <Eyebrow className="text-accent">{PRACTICES.eyebrow}</Eyebrow>

              <Heading
                level={2}
                size="h2"
                id="practices-heading"
                className="mt-4 text-primary"
              >
                Media.
                <br />
                <span className="text-accent">Studio.</span>
              </Heading>

              <p className="mt-5 max-w-[34ch] text-body text-secondary [line-height:var(--lh-body)]">
                Strategy meets execution. Media that performs, creative that converts, and
                one team accountable for both.
              </p>

              <div className="mt-8">
                <Button href="/services" variant="secondary">
                  Explore services
                </Button>
              </div>
            </div>

            {/* -------- RIGHT: one card per practice -------- */}
            <ul className="grid gap-6 sm:grid-cols-2">
              {PRACTICES.cards.map((card, i) => {
                const nav = PRACTICE_NAV.find((p) => p.id === card.id);
                const PracticeIcon = i === 0 ? Megaphone : Clapperboard;
                return (
                  <li key={card.id}>
                    <HoverCard
                      as="div"
                      className="hover-card--ink card-surface flex h-full flex-col border border-hairline bg-base p-6"
                    >
                      <span className="icon-tile transition-colors group-hover:bg-paper/15 group-hover:text-paper">
                        <PracticeIcon aria-hidden="true" className="size-5" />
                      </span>

                      <h3 className="mt-5 text-h4 text-primary transition-colors [line-height:var(--lh-heading)] group-hover:text-paper">
                        {card.name}
                      </h3>

                      {/* Routed services are links; capabilities without a page are text. */}
                      <ul className="mt-5 flex-1 space-y-2">
                        {card.capabilities.map((capability) => {
                          const service = nav?.services.find(
                            (s) => s.label === capability,
                          );
                          return (
                            <li key={capability} className="flex items-start gap-2">
                              <span
                                aria-hidden="true"
                                className="mt-2 size-1 shrink-0 rounded bg-accent transition-colors group-hover:bg-paper"
                              />
                              {service ? (
                                <Link
                                  to={service.href}
                                  className="text-small text-secondary underline-offset-4 transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent group-hover:text-paper"
                                >
                                  {capability}
                                </Link>
                              ) : (
                                <span className="text-small text-secondary transition-colors group-hover:text-paper">
                                  {capability}
                                </span>
                              )}
                            </li>
                          );
                        })}
                      </ul>

                      <Link
                        to={card.cta.href}
                        className="mt-6 inline-flex items-center gap-2 text-small font-medium text-accent-strong transition-colors [min-height:var(--touch-min)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent group-hover:text-paper"
                      >
                        {card.cta.label}
                        <Icon icon={ArrowRight} />
                      </Link>
                    </HoverCard>
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
