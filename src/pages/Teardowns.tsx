import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { Container, Eyebrow, Heading, Icon, Section } from '../components/ui';
import { CtaSection } from '../sections/shared/CtaSection';
import { DISCIPLINES } from '../data/disciplines';
import { TEARDOWNS } from '../data/teardowns';
import { Seo } from '../components/Seo';
import { breadcrumbSchema } from '../lib/schema';

/**
 * /teardowns — master.md §14, §19.4, §34.1(4).
 *
 * §14's order: Hero ("We publish our thinking.") -> filter by discipline ->
 * teardown index -> "Get a teardown of your own" conversion block -> CTA.
 *
 * §34.1(4) calls this "one asset doing five jobs": proof, lead magnet, organic
 * strategy, social surface, and evidence of expertise.
 *
 * EMPTY STATE. The index is empty until Phase 5 writes the first teardowns.
 * §20.3 governs: an empty proof slot is removed, never filled with "coming
 * soon" — the Beyond Agents error §2.8 calls the most damaging pattern in the
 * research. So the index and the discipline filter unmount, and the page keeps
 * only what is true today: what a teardown is, and the offer to produce one.
 *
 * That offer is real and deliverable now, which is why it is not an empty state
 * dressed as content. §17.2 makes it the Tier 2 artefact CTA.
 */
export function Teardowns() {
  const hasTeardowns = TEARDOWNS.length > 0;

  // Only disciplines that actually authored something can be a filter.
  const activeDisciplines = DISCIPLINES.filter((d) =>
    TEARDOWNS.some((t) => t.disciplineId === d.id),
  );

  return (
    <>
      <Seo
        schemas={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Teardowns', path: '/teardowns' },
          ]),
        ]}
      />

      <Section tone="ink" aria-labelledby="teardowns-heading">
        <Container>
          <Eyebrow className="text-onpunct-2">Proof</Eyebrow>
          <Heading
            level={1}
            size="h1"
            id="teardowns-heading"
            className="mt-3 text-onpunct"
          >
            We publish our thinking. Read it before you hire us.
          </Heading>
          <p className="mt-6 max-w-[52ch] text-lead text-onpunct-2 [line-height:var(--lh-body)]">
            A teardown is a specialist reading a real, publicly visible ad or landing page
            and showing the reasoning they would apply to it.
          </p>
        </Container>
      </Section>

      {/* What a teardown contains — true today, and it sets the expectation
          the published ones will be held to (§14, /teardowns/:slug). */}
      <Section tone="paper" aria-labelledby="anatomy-heading">
        <Container>
          <Heading level={2} size="h2" id="anatomy-heading">
            What is in one
          </Heading>
          <ol className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                i: '01',
                t: 'Observation',
                b: 'What was analysed, and where it was observed.',
              },
              {
                i: '02',
                t: 'Hypothesis',
                b: 'What we believe is happening, stated so it can be wrong.',
              },
              {
                i: '03',
                t: 'What we would test',
                b: 'The specific change, not a list of best practices.',
              },
              {
                i: '04',
                t: 'How we would measure it',
                b: 'The metric that would settle it, and the window.',
              },
            ].map((step) => (
              <li key={step.i} className="border-t border-hairline pt-6">
                <span className="font-mono text-label text-accent [letter-spacing:var(--tracking-label)]">
                  {step.i}
                </span>
                <h3 className="mt-4 text-h4 text-primary [line-height:var(--lh-heading)]">
                  {step.t}
                </h3>
                <p className="mt-3 text-body text-secondary [line-height:var(--lh-body)]">
                  {step.b}
                </p>
              </li>
            ))}
          </ol>

          {/*
            §14: "That limits paragraph is not a disclaimer — it is a
            credibility device. Stating what you cannot know is the clearest
            signal that everything else you said, you do know."
          */}
          <p className="mt-12 max-w-[62ch] border-l-2 border-accent pl-6 text-body text-primary [line-height:var(--lh-body)]">
            Every teardown ends by stating its limits. We do not have the
            advertiser&rsquo;s data — it is a read from the outside, and it says so.
          </p>
        </Container>
      </Section>

      {/* Index + discipline filter. Both unmount while empty (§20.3). */}
      {hasTeardowns && (
        <Section tone="surface" aria-labelledby="index-heading">
          <Container>
            <Heading level={2} size="h2" id="index-heading">
              Published
            </Heading>

            {activeDisciplines.length > 0 && (
              <ul className="mt-8 flex flex-wrap gap-3" aria-label="Filter by discipline">
                {activeDisciplines.map((d) => (
                  <li
                    key={d.id}
                    className="border border-hairline px-3 py-2 font-mono text-label uppercase leading-none text-secondary [letter-spacing:var(--tracking-label)]"
                  >
                    {d.title}
                  </li>
                ))}
              </ul>
            )}

            <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {TEARDOWNS.map((t) => (
                <li key={t.slug}>
                  <Link
                    to={`/teardowns/${t.slug}`}
                    className="flex h-full flex-col border border-hairline bg-base [padding:var(--card-pad)] hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    <span className="font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-secondary">
                      {t.disciplineId.replace(/-/g, ' ')}
                    </span>
                    <span className="mt-4 flex-1 text-h4 text-primary [line-height:var(--lh-heading)]">
                      {t.subject}
                    </span>
                    <span className="mt-6 inline-flex items-center gap-2 text-body text-accent-strong">
                      Read <Icon icon={ArrowRight} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {/* §17.2 Tier 2 — the artefact CTA, and the strategic centre of the
          funnel. Real and deliverable today. */}
      <CtaSection
        tone="ink"
        headline="Get a teardown of your ads and landing page."
        body="Send the ad account or a link to the creative, and the page the traffic lands on. You will get a specialist's read of what we would change and how we would measure it."
        primaryLabel="Get a teardown"
      />
    </>
  );
}
