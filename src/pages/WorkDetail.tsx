import { Link, useParams } from 'react-router';
import { Container, Eyebrow, Heading, Prose, Rule, Section } from '../components/ui';
import { CtaSection } from '../sections/shared/CtaSection';
import { getCaseStudy } from '../data/work';
import { getService } from '../data/services';
import { DISCIPLINES } from '../data/disciplines';
import { NotFound } from './NotFound';
import { Seo } from '../components/Seo';
import { breadcrumbSchema, caseStudySchema } from '../lib/schema';

/**
 * /work/:slug — THE CASE STUDY TEMPLATE.
 *
 * data/work.ts is empty, so getStaticPaths pre-renders nothing and this
 * component ships as structure waiting for content. That is the point: the
 * architecture for the first real case study exists and is typed, so publishing
 * one is a data edit rather than a build.
 *
 * ⚠ THE HONESTY RULES ARE IN THE TYPE, NOT IN THIS FILE.
 *
 * types/content.ts makes CaseStudy a discriminated union: a `kind: 'project'`
 * study CANNOT carry metrics (`metrics?: never`) and a `kind: 'result'` study
 * MUST. So the label below is not a naming convention anybody has to remember —
 * a study that says RESULT without measured results does not compile.
 *
 * Every Metric additionally requires `method` and `window` (§19.2 block 7:
 * "only real, only measured, with the measurement method stated and the time
 * window given"), which is why the results table prints both underneath every
 * figure rather than treating them as optional footnotes.
 */
export function WorkDetail() {
  const { slug } = useParams<{ slug: string }>();
  const study = slug ? getCaseStudy(slug) : undefined;

  if (!study) return <NotFound />;

  const disciplines = DISCIPLINES.filter((d) => study.disciplineIds.includes(d.id));
  const services = study.serviceSlugs
    .map(getService)
    .filter((s): s is NonNullable<typeof s> => s !== undefined);

  const blocks = [
    { h: 'The objective', b: study.objective },
    { h: 'The starting point', b: study.startingPoint },
    { h: 'What we found', b: study.diagnosis },
    { h: 'What we believed would change it', b: study.hypothesis },
    { h: 'The strategy', b: study.strategy },
    { h: 'The media', b: study.media },
    { h: 'How it was tested', b: study.testDesign },
    { h: 'How it was measured', b: study.measurement },
  ];

  return (
    <>
      <Seo
        title={`${study.context} | Trenvo Media`}
        description={study.diagnosis.slice(0, 155)}
        ogTitle={study.context}
        ogType="article"
        schemas={[
          caseStudySchema(study, study.datePublished),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Work', path: '/work' },
            { name: study.context, path: `/work/${study.slug}` },
          ]),
        ]}
      />

      <Section tone="ink" aria-labelledby="study-heading">
        <Container width="narrow">
          {/* §19.3 — PROJECT unless there are measured results. */}
          <Eyebrow className="text-onpunct-2">
            {study.kind === 'result' ? 'Result' : 'Project'}
          </Eyebrow>
          <Heading level={1} size="h1" id="study-heading" className="mt-3 text-onpunct">
            {study.context}
          </Heading>

          <dl className="mt-10 grid gap-6 sm:grid-cols-3">
            <div>
              <dt className="font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-onpunct-2">
                Client
              </dt>
              <dd className="mt-1 text-body text-onpunct">
                {study.client}
                {/*
                  An anonymised client says so. A reader who assumes a named
                  client and later learns otherwise has been misled, even where
                  nothing false was written.
                */}
                {study.anonymised && (
                  <span className="mt-1 block text-small text-onpunct-2">
                    Named client withheld at their request.
                  </span>
                )}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-onpunct-2">
                Timeframe
              </dt>
              <dd className="mt-1 text-body text-onpunct">{study.timeframe}</dd>
            </div>
            <div>
              <dt className="font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-onpunct-2">
                Disciplines
              </dt>
              <dd className="mt-1 text-body text-onpunct">
                {disciplines.map((d) => d.title).join(', ')}
              </dd>
            </div>
          </dl>
        </Container>
      </Section>

      <Section tone="paper">
        <Container width="narrow">
          <article>
            {blocks.map((block, i) => (
              <div key={block.h}>
                {i > 0 && <Rule className="my-10" />}
                <h2 className="font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-secondary">
                  {block.h}
                </h2>
                <Prose className="mt-4">
                  <p>{block.b}</p>
                </Prose>
              </div>
            ))}
          </article>
        </Container>
      </Section>

      {/* §19.2 block 4 — "the actual creative, the actual page. Shown, not
          described." Dimensions are explicit so nothing shifts as it loads. */}
      {study.built.length > 0 && (
        <Section tone="surface" aria-labelledby="built-heading">
          <Container>
            <Heading level={2} size="h2" id="built-heading">
              What we made
            </Heading>
            <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {study.built.map((item) => (
                <li key={item.src}>
                  <img
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                    decoding="async"
                    className="w-full border border-hairline"
                  />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {/* §19.2 block 7. Only reachable on a 'result' study, by the type. */}
      {study.kind === 'result' && (
        <Section tone="paper" aria-labelledby="result-heading">
          <Container>
            <Heading level={2} size="h2" id="result-heading">
              The result
            </Heading>
            <ul className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {study.metrics.map((metric) => (
                <li
                  key={metric.label}
                  className="border-t border-hairline pt-6"
                >
                  <p className="font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-secondary">
                    {metric.label}
                  </p>
                  <p className="mt-3 text-h3 font-semibold text-primary [letter-spacing:var(--tracking-heading)]">
                    {metric.value}
                  </p>
                  {/* Required by the type, printed without exception. A number
                      whose method and window are not stated is not publishable. */}
                  <p className="mt-4 text-small text-secondary [line-height:var(--lh-body)]">
                    <span className="font-medium">Measured by:</span> {metric.method}
                  </p>
                  <p className="mt-2 text-small text-secondary [line-height:var(--lh-body)]">
                    <span className="font-medium">Over:</span> {metric.window}
                  </p>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {/* §19.2 block 8 — real, attributed, with permission. */}
      {study.quote && (
        <Section tone="ink" aria-labelledby="quote-heading">
          <Container width="narrow">
            <h2 id="quote-heading" className="sr-only">
              What the client said
            </h2>
            <blockquote className="text-h3 text-onpunct [line-height:var(--lh-heading)]">
              {study.quote.quote}
            </blockquote>
            <p className="mt-6 text-body text-onpunct-2">{study.quote.attribution}</p>
          </Container>
        </Section>
      )}

      {/* Internal linking — the services this study used, and the tools. */}
      <Section tone="surface" aria-labelledby="used-heading">
        <Container>
          <Heading level={2} size="h2" id="used-heading">
            What this used
          </Heading>
          <div className="mt-12 grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-secondary">
                Services
              </h3>
              <ul className="mt-4 space-y-2">
                {services.map((service) => (
                  <li key={service.slug}>
                    <Link
                      to={`/services/${service.slug}`}
                      className="inline-flex items-center text-body text-accent-strong [min-height:var(--touch-min)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-secondary">
                Tools
              </h3>
              <ul className="mt-4 space-y-2">
                {study.tools.map((tool) => (
                  <li key={tool} className="text-body text-secondary">
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      <CtaSection
        headline="Want this read on your account?"
        body="A specialist reads your ads, your creative and the page they land on, and writes down what they would change and how they would measure it."
      />
    </>
  );
}
