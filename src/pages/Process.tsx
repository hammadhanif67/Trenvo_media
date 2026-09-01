import { Container, Eyebrow, Heading, Rule, Section } from '../components/ui';
import { CtaSection } from '../sections/shared/CtaSection';
import { SpecialistStrip } from '../sections/shared/SpecialistStrip';
import { LOOP } from '../data/home';
import { FORECAST, LOOP_OPERATIONAL, PROCESS_HERO, WEEK_ONE } from '../data/process';
import { Seo } from '../components/Seo';
import { breadcrumbSchema } from '../lib/schema';

/**
 * /process — master.md §14.
 *
 * §11.3 justifies the route: it "removes the largest new-supplier objection".
 * §16.2 maps three of its blocks straight onto the objection table.
 *
 * FOUR blocks §14 specifies are absent: week-one time boundaries, the reporting
 * cadence, engagement bands, and what happens if it is not working. None is
 * documented anywhere. They are recorded in data/process.ts PROCESS_GAPS and
 * in implementation.md §5.6 rather than filled with invented terms — §20.1
 * counts published bands as a REAL trust signal precisely because they are
 * checkable, and an invented one is not a weak signal but a false one.
 */
export function Process() {
  return (
    <>
      <Seo
        schemas={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Process', path: '/process' },
          ]),
        ]}
      />

      <Section tone="ink" aria-labelledby="process-heading">
        <Container>
          <Eyebrow className="text-onpunct-2">How we work</Eyebrow>
          <Heading level={1} size="h1" id="process-heading" className="mt-3 text-onpunct">
            {PROCESS_HERO.headline}
          </Heading>
          <p className="mt-6 max-w-[52ch] text-lead text-onpunct-2 [line-height:var(--lh-body)]">
            {PROCESS_HERO.lead}
          </p>
        </Container>
      </Section>

      {/* The four loop stages in operational detail (§6.3). */}
      <Section tone="paper" aria-labelledby="loop-detail-heading">
        <Container>
          <Heading level={2} size="h2" id="loop-detail-heading">
            {LOOP_OPERATIONAL.heading}
          </Heading>
          <p className="mt-6 max-w-[62ch] text-body text-secondary [line-height:var(--lh-body)]">
            {LOOP_OPERATIONAL.lead}
          </p>

          <ol className="mt-12">
            {LOOP.stages.map((stage, i) => (
              <li key={stage.id}>
                {i > 0 && <Rule />}
                <div className="grid gap-4 py-8 md:grid-cols-[12rem_1fr] md:gap-12">
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-label text-accent [letter-spacing:var(--tracking-label)]">
                      {stage.index}
                    </span>
                    <h3 className="font-mono text-h4 uppercase text-primary [letter-spacing:var(--tracking-label)]">
                      {stage.name}
                    </h3>
                  </div>
                  <div>
                    <p className="max-w-[62ch] text-body text-primary [line-height:var(--lh-body)]">
                      {stage.definition}
                    </p>
                    <ul className="mt-5 flex flex-wrap gap-x-3 gap-y-2">
                      {stage.disciplines.map((d) => (
                        <li
                          key={d}
                          className="border border-hairline px-3 py-2 font-mono text-label uppercase leading-none text-secondary [letter-spacing:var(--tracking-label)]"
                        >
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Week one (§13 §6). */}
      <Section tone="surface" aria-labelledby="week-one-heading">
        <Container>
          <Heading level={2} size="h2" id="week-one-heading">
            {WEEK_ONE.heading}
          </Heading>
          <ol className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {WEEK_ONE.steps.map((step) => (
              <li key={step.index} className="border-t border-hairline pt-6">
                <span className="font-mono text-label text-accent [letter-spacing:var(--tracking-label)]">
                  {step.index}
                </span>
                <h3 className="mt-4 text-h4 text-primary [line-height:var(--lh-heading)]">
                  {step.title}
                </h3>
                <p className="mt-4 text-body text-secondary [line-height:var(--lh-body)]">
                  {step.body}
                </p>
                <p className="mt-4 font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-secondary">
                  {step.label}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* §16.3 — the forecast device. A promise, not a history. */}
      <Section tone="paper" aria-labelledby="forecast-heading">
        <Container>
          <Heading level={2} size="h2" id="forecast-heading" className="max-w-[26ch]">
            {FORECAST.heading}
          </Heading>
          <div className="mt-8 max-w-[62ch] space-y-6">
            {FORECAST.body.map((p) => (
              <p key={p} className="text-body text-primary [line-height:var(--lh-body)]">
                {p}
              </p>
            ))}
          </div>
        </Container>
      </Section>

      {/*
        §14 assigns the assignment model and the hiring standard to
        /about#specialists, not here. They are linked rather than repeated: duplicate
        blocks across two routes weaken both and create the duplicate-content
        problem §21.1 exists to avoid.
      */}
      <SpecialistStrip tone="surface" />

      <CtaSection
        headline="Tell us what you are building."
        body="Send the site, the ad account, and what is not working. You will get a specialist's read, not a sales deck."
      />
    </>
  );
}
