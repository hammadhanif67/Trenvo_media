import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { Container, Eyebrow, Heading, Icon, Rule, Section } from '../components/ui';
import { LoopDiagram } from '../components/media/LoopDiagram';
import { CtaSection } from '../sections/shared/CtaSection';
import { SpecialistStrip } from '../sections/shared/SpecialistStrip';
import { PRACTICE_NAV } from '../data/navigation';
import { SERVICES_OVERVIEW, getService } from '../data/services';
import { Seo } from '../components/Seo';
import { breadcrumbSchema } from '../lib/schema';

/**
 * /services — master.md §14, the practice overview.
 *
 * §14's order: Hero ("Two practices. One loop.") -> the loop diagram, full
 * width -> three practice blocks, each expanding to its services -> "Why we do
 * not sell these separately" (the unbundling argument) -> what we do not offer
 * -> specialists strip -> CTA.
 *
 * §11.2 calls this the page the mega-menu's "THE LOOP" row points at, because
 * it is where the three-practice model is taught in full.
 */
export function Services() {
  return (
    <>
      <Seo
        schemas={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
          ]),
        ]}
      />
      <Section tone="ink" aria-labelledby="services-heading">
        <Container>
          <Heading level={1} size="h1" id="services-heading" className="text-onpunct">
            {SERVICES_OVERVIEW.headline}
          </Heading>
          <p className="mt-6 max-w-[52ch] text-lead text-onpunct-2 [line-height:var(--lh-body)]">
            {SERVICES_OVERVIEW.lead}
          </p>
          <div className="mt-16">
            <LoopDiagram mode="static" />
          </div>
        </Container>
      </Section>

      {/* Three practice blocks, each expanding to its services (§14). */}
      <Section tone="paper" aria-labelledby="practices-heading">
        <Container>
          <Heading level={2} size="h2" id="practices-heading">
            Two practices
          </Heading>

          <div className="mt-16">
            {PRACTICE_NAV.map((practice, i) => (
              <div key={practice.id}>
                {i > 0 && <Rule className="my-12" />}
                <div className="grid gap-8 lg:grid-cols-[20rem_1fr] lg:gap-16">
                  <div>
                    <Eyebrow className="text-secondary">{practice.name}</Eyebrow>
                    <h3 className="mt-3 text-h3 font-semibold text-primary [letter-spacing:var(--tracking-heading)] [line-height:var(--lh-heading)]">
                      {practice.question}
                    </h3>
                  </div>

                  <ul className="grid gap-6 sm:grid-cols-2">
                    {practice.services.map((link) => {
                      const service = getService(link.href.split('/').pop() ?? '');
                      return (
                        <li key={link.href}>
                          <Link
                            to={link.href}
                            /*
                              ⚠ §27.2 #4 specifies card hover as "Blue rule
                              extends 180ms, 1px border shift". Requested
                              instead: the whole card fills blue. The 180ms and
                              the "no lift, no shadow" half of #4 are kept.
                              Recorded in implementation.md §5.21.

                              --blue-600 LITERAL, not var(--accent). The accent
                              token resolves to --blue-500 in the dark theme,
                              and white on --blue-500 measures 3.2:1, which
                              fails AA. --blue-600 gives white 5.13:1 in BOTH
                              themes, so the fill is fixed rather than themed.

                              The transition names background-color and
                              border-color explicitly. `transition-colors` would
                              sweep outline-color in with them and animate the
                              focus ring, which §27.2 #10 forbids ("Instant —
                              never animated").

                              focus-visible mirrors hover so the affordance
                              exists for the keyboard, not just the mouse.
                            */
                            className="group flex h-full flex-col border border-hairline [padding:var(--card-pad)] [transition:background-color_180ms,border-color_180ms] hover:border-blue-600 hover:bg-blue-600 focus-visible:border-blue-600 focus-visible:bg-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                          >
                            <span className="text-h4 text-primary [line-height:var(--lh-heading)] group-hover:text-paper group-focus-visible:text-paper">
                              {link.label}
                            </span>
                            {service && (
                              <span className="mt-3 flex-1 text-body text-secondary [line-height:var(--lh-body)] group-hover:text-paper group-focus-visible:text-paper">
                                {service.outcome}
                              </span>
                            )}
                            <span className="mt-6 inline-flex items-center gap-2 text-small text-accent-strong group-hover:text-paper group-focus-visible:text-paper">
                              Explore <Icon icon={ArrowRight} />
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* The unbundling argument — §14, §8.4's final row. */}
      <Section tone="surface" aria-labelledby="unbundling-heading">
        <Container>
          <Heading level={2} size="h2" id="unbundling-heading" className="max-w-[24ch]">
            {SERVICES_OVERVIEW.unbundling.heading}
          </Heading>
          <div className="mt-8 max-w-[62ch] space-y-6">
            {SERVICES_OVERVIEW.unbundling.body.map((paragraph) => (
              <p
                key={paragraph}
                className="text-body text-primary [line-height:var(--lh-body)]"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </Container>
      </Section>

      {/* What we do not offer — §11.1 principle 5: no SEO anywhere, stated. */}
      <Section tone="paper" aria-labelledby="not-offered-heading">
        <Container>
          <Heading level={2} size="h2" id="not-offered-heading">
            {SERVICES_OVERVIEW.notOffered.heading}
          </Heading>
          <ul className="mt-12 grid gap-4 sm:grid-cols-3">
            {SERVICES_OVERVIEW.notOffered.items.map((item) => (
              <li
                key={item}
                className="border border-hairline [padding:var(--card-pad)] font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-secondary"
              >
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-[62ch] text-body text-primary [line-height:var(--lh-body)]">
            {SERVICES_OVERVIEW.notOffered.note}
          </p>
        </Container>
      </Section>

      <SpecialistStrip tone="surface" />

      <CtaSection
        headline="Tell us what you are building."
        body="Send the site, the ad account, and what is not working. You will get a specialist's read, not a sales deck."
      />
    </>
  );
}
