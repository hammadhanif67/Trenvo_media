import { Link, useParams } from 'react-router';
import { Container, Eyebrow, Heading, Prose, Rule, Section } from '../components/ui';
import { CtaSection } from '../sections/shared/CtaSection';
import { DISCIPLINES } from '../data/disciplines';
import { getTeardown, relatedTeardowns } from '../data/teardowns';
import { getService } from '../data/services';
import { NotFound } from './NotFound';
import { Seo } from '../components/Seo';
import { articleSchema, breadcrumbSchema } from '../lib/schema';

/**
 * /teardowns/:slug — master.md §14.
 *
 * §14's structure: "Subject and discipline label -> what was analysed and where
 * it was observed -> the specialist's read, structured as observation ->
 * hypothesis -> what we would test -> how we would measure it -> explicit
 * limits -> related service -> CTA."
 *
 * The body is rendered from a BLOCK LIST rather than hand-written markup, so
 * every published teardown has the same skeleton and no author can quietly drop
 * the section that makes it credible. Adding a section is a change here, once,
 * not in every article.
 *
 * §14 on the limits paragraph: "That limits paragraph is not a disclaimer — it
 * is a credibility device. Stating what you cannot know is the clearest signal
 * that everything else you said, you do know." It is therefore given its own
 * block rather than being set as small print.
 *
 * §25.3 gives long-form the narrow 720px container.
 */
export function TeardownDetail() {
  const { slug } = useParams<{ slug: string }>();
  const teardown = slug ? getTeardown(slug) : undefined;

  if (!teardown) return <NotFound />;

  const discipline = DISCIPLINES.find((d) => d.id === teardown.disciplineId);
  const service = getService(teardown.serviceSlug);
  const related = relatedTeardowns(teardown.slug);

  const blocks = [
    { h: 'The problem', b: teardown.problem },
    { h: 'What we observed', b: teardown.observation },
    { h: 'The analysis', b: teardown.analysis },
    { h: 'What we would change', b: teardown.whatWeWouldChange },
    { h: 'Why', b: teardown.why },
    { h: 'How we would measure it', b: teardown.howWeWouldMeasure },
    { h: 'What we would expect to move', b: teardown.expectedImpact },
  ];

  return (
    <>
      <Seo
        title={`${teardown.subject} | Trenvo Media`}
        description={teardown.summary}
        ogTitle={teardown.subject}
        ogType="article"
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
          <p className="mt-6 text-lead text-onpunct-2 [line-height:var(--lh-body)]">
            {teardown.summary}
          </p>
          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-onpunct-2">
                Category
              </dt>
              <dd className="mt-1 text-body text-onpunct">{teardown.category}</dd>
            </div>
            <div>
              <dt className="font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-onpunct-2">
                Observed
              </dt>
              <dd className="mt-1 text-body text-onpunct">
                {teardown.observedAt} —{' '}
                <time dateTime={teardown.datePublished}>{teardown.datePublished}</time>
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

      {/* §21.4 — every teardown links to the service it demonstrates, and to
          whatever is worth reading next. Contextual, not a link dump. */}
      <Section tone="surface" aria-labelledby="related-heading">
        <Container width="narrow">
          <h2
            id="related-heading"
            className="font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-secondary"
          >
            Read next
          </h2>

          {service && (
            <Link
              to={`/services/${service.slug}`}
              className="mt-4 block border border-hairline bg-base [padding:var(--card-pad)] hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <span className="font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-secondary">
                The service this demonstrates
              </span>
              <span className="mt-3 block text-h4 text-primary [line-height:var(--lh-heading)]">
                {service.name}
              </span>
              <span className="mt-2 block text-body text-secondary [line-height:var(--lh-body)]">
                {service.outcome}
              </span>
            </Link>
          )}

          {related.length > 0 && (
            <ul className="mt-6 grid gap-6 md:grid-cols-2">
              {related.map((t) => (
                <li key={t.slug}>
                  <Link
                    to={`/teardowns/${t.slug}`}
                    className="flex h-full flex-col border border-hairline bg-base [padding:var(--card-pad)] hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    <span className="font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-secondary">
                      Another teardown
                    </span>
                    <span className="mt-3 flex-1 text-h4 text-primary [line-height:var(--lh-heading)]">
                      {t.subject}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>

      <CtaSection
        headline="Want this done to your account?"
        body="Send the ad account and the page the traffic lands on. You get the same read, on your own creative, before anything is asked of you."
      />
    </>
  );
}
