import { ArrowRight, Megaphone, Clapperboard } from 'lucide-react';
import { Link } from 'react-router';
import { Button, Container, Eyebrow, Heading, Icon, Section } from '../../components/ui';
import { HoverCard } from '../../components/ui/HoverCard';
import { Reveal } from '../../components/motion/Reveal';
import { PRACTICE_NAV } from '../../data/navigation';
import { PRACTICES_SECTION } from '../../data/home';

/**
 * 04 SERVICES — wireframe.md §04, master.md §6.2, §9.5
 *
 * Rebuilt to the reference: a claim on the left, service cards on the right,
 * each card listing the routed services inside that practice.
 *
 * ⚠ EVERY BULLET IS NOW A REAL, ROUTED SERVICE.
 *
 * This section used to render `PRACTICES.cards[].capabilities` — a hand-written
 * list in data/home.ts that had drifted from the taxonomy. It advertised "AI
 * UGC Ads", "Short-Form Video Ads", "Motion Design" and "Measurement &
 * attribution" as things Trenvo sells, and rendered the ones with no page as
 * plain text. So the homepage promised six Creative capabilities while the menu
 * offered three, and a visitor who wanted the ones that were only text had
 * nowhere to click.
 *
 * The lists now come from PRACTICE_NAV, which is derived from
 * data/services.ts — the same source the header menu and the footer read. Every
 * bullet is a link to a page that exists, and a service cannot appear here and
 * be missing from the menu. Adding one to services.ts adds it in all three
 * places at once.
 *
 * The service name is the anchor text rather than "read more", which is the
 * internal linking §21.4 asks for.
 */
export function Practices() {
  return (
    <Section tone="paper" aria-labelledby="practices-heading">
      <Container>
        <Reveal>
          <div className="grid gap-12 lg:grid-cols-[20rem_1fr] lg:gap-16">
            {/* -------- LEFT: the claim -------- */}
            <div>
              <Eyebrow className="text-accent">{PRACTICES_SECTION.eyebrow}</Eyebrow>

              <Heading
                level={2}
                size="h2"
                id="practices-heading"
                className="mt-4 text-primary"
              >
                {/* Derived, so renaming a practice renames the heading too. */}
                {PRACTICE_NAV[0]?.name}.
                <br />
                <span className="text-accent">{PRACTICE_NAV[1]?.name}.</span>
              </Heading>

              <p className="mt-5 max-w-[34ch] text-body text-secondary [line-height:var(--lh-body)]">
                {PRACTICES_SECTION.lead}
              </p>

              <div className="mt-8">
                <Button href="/services" variant="secondary">
                  Explore services
                </Button>
              </div>
            </div>

            {/* -------- RIGHT: one card per practice -------- */}
            <ul className="grid auto-rows-fr gap-6 sm:grid-cols-2">
              {PRACTICE_NAV.map((practice, i) => {
                const PracticeIcon = i === 0 ? Megaphone : Clapperboard;
                return (
                  <li key={practice.id}>
                    <HoverCard
                      as="div"
                      className="flex h-full flex-col border border-hairline bg-base p-6 [transition:border-color_220ms,box-shadow_220ms,transform_220ms] hover:-translate-y-0.5 hover:border-accent hover:shadow-[0_14px_40px_-26px_rgba(11,95,255,0.5)]"
                    >
                      <h3 className="flex items-center gap-3 text-h4 text-primary [line-height:var(--lh-heading)]">
                        <PracticeIcon
                          aria-hidden="true"
                          className="size-5 shrink-0 text-accent"
                        />
                        {practice.name}
                      </h3>

                      <p className="mt-3 text-small text-secondary [line-height:var(--lh-body)]">
                        {practice.question}
                      </p>

                      {/* Every one of these is a routed page. There is no
                          text-only capability any more — see the note above. */}
                      <ul className="mt-5 flex-1 space-y-2">
                        {practice.services.map((service) => (
                          <li key={service.href} className="flex items-start gap-2">
                            <span
                              aria-hidden="true"
                              className="mt-2 size-1 shrink-0 rounded bg-accent transition-colors"
                            />
                            <Link
                              to={service.href}
                              className="text-small text-secondary underline-offset-4 transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                            >
                              {service.label}
                            </Link>
                          </li>
                        ))}
                      </ul>

                      <Link
                        to={practice.services[0]?.href ?? '/services'}
                        className="mt-6 inline-flex items-center gap-2 text-small font-medium text-accent-strong transition-colors [min-height:var(--touch-min)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                      >
                        Explore {practice.name}
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
