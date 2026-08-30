import { Link, useParams } from 'react-router';
import { Container, Eyebrow, Heading, Prose, Rule, Section } from '../components/ui';
import { CtaSection } from '../sections/shared/CtaSection';
import { DISCIPLINES } from '../data/disciplines';
import { TEARDOWNS } from '../data/teardowns';
import { getService } from '../data/services';
import { NotFound } from './NotFound';
import { Seo } from '../components/Seo';
import { articleSchema, breadcrumbSchema } from '../lib/schema';

/**
 * /teardowns/:slug — master.md §14.
 *
 * §14's structure, verbatim: "Subject and discipline label -> what was analysed
 * and where it was observed -> the specialist's read, structured as
 * observation -> hypothesis -> what we would test -> how we would measure it ->
 * explicit limits -> related service -> CTA."
 *
 * §14 on the limits paragraph: "That limits paragraph is not a disclaimer — it
 * is a credibility device. Stating what you cannot know is the clearest signal
 * that everything else you said, you do know." It is therefore given its own
 * block rather than being set as small print.
 *
 * §25.3 gives long-form the narrow 720px container; §21.5 emits Article JSON-LD
 * at the SEO milestone from this same data.
 */
export function TeardownDetail() {
  const { slug } = useParams<{ slug: string }>();
  const teardown = TEARDOWNS.find((t) => t.slug === slug);

  if (!teardown) return <NotFound />;

  const discipline = DISCIPLINES.find((d) => d.id === teardown.disciplineId);
  const service = getService(teardown.serviceSlug);

  return (
    <>
      <Seo
        title={`${teardown.subject} | Trenvo Media`}
        description={teardown.observation.slice(0, 155)}
        ogTitle={teardown.subject}
        schemas={[
          articleSchema(teardown, discipline ? discipline.title : 'Trenvo Media'),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Teardowns', path: '/teardowns' },
            { name: teardown.subject, path: `/teardowns/${teardown.slug}` },
          ]),
        ]}
      />

      <Section tone="ink" aria-labelledby="teardown-heading">
        <Container width="narrow">
          <Eyebrow className="text-onpunct-2">
            {discipline ? discipline.title : 'Teardown'}
          </Eyebrow>
          <Heading
            level={1}
            size="h1"
            id="teardown-heading"
            className="mt-3 text-onpunct"
          >
            {teardown.subject}
          </Heading>
          <p className="mt-6 text-body text-onpunct-2 [line-height:var(--lh-body)]">
            {teardown.observedAt}
          </p>
          <p className="mt-2 font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-onpunct-2">
            <time dateTime={teardown.datePublished}>{teardown.datePublished}</time>
          </p>
        </Container>
      </Section>

      <Section tone="paper">
        <Container width="narrow">
          <article>
            {[
              { h: 'Observation', b: teardown.observation },
              { h: 'Hypothesis', b: teardown.hypothesis },
              { h: 'What we would test', b: teardown.whatWeWouldTest },
              { h: 'How we would measure it', b: teardown.howWeWouldMeasure },
            ].map((block, i) => (
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

            {/* §14 — the credibility device, not a disclaimer. */}
            <div className="mt-16 border-l-2 border-accent pl-6">
              <h2 className="font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-secondary">
                What we cannot know
              </h2>
              <Prose className="mt-4">
                <p>{teardown.limits}</p>
              </Prose>
            </div>
          </article>
        </Container>
      </Section>

      {/* §21.4 — every teardown links to the service it demonstrates. */}
      {service && (
        <Section tone="surface" aria-labelledby="related-heading">
          <Container width="narrow">
            <h2
              id="related-heading"
              className="font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-secondary"
            >
              The service this demonstrates
            </h2>
            <Link
              to={`/services/${service.slug}`}
              className="mt-4 block border border-hairline bg-base [padding:var(--card-pad)] hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <span className="text-h4 text-primary [line-height:var(--lh-heading)]">
                {service.name}
              </span>
              <span className="mt-2 block text-body text-secondary [line-height:var(--lh-body)]">
                {service.outcome}
              </span>
            </Link>
          </Container>
        </Section>
      )}

      <CtaSection
        headline="Want this done to your account?"
        body="Send the ad account and the page the traffic lands on. You will get the same read, on your own creative."
        primaryLabel="Get a teardown"
      />
    </>
  );
}
