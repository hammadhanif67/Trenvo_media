import { Link } from 'react-router';
import { Container, Eyebrow, Heading, Section } from '../components/ui';
import { CtaSection } from '../sections/shared/CtaSection';
import { WORK } from '../data/work';
import { TEARDOWNS } from '../data/teardowns';
import { Seo } from '../components/Seo';
import { breadcrumbSchema } from '../lib/schema';

/**
 * /work — master.md §14, §19.3, wireframe.md §09.
 *
 * §14: "Ships with an honest empty state or does not ship as a nav item."
 * implementation.md §1.2 approved that real samples exist, so the route ships;
 * they have not reached the build yet, so the grid is empty.
 *
 * §19.3 binds every card when it is populated: kind 'project', label PROJECT
 * never RESULT, and NO metrics — which the discriminated union in
 * types/content.ts enforces at compile time rather than in review.
 *
 * While empty this page states plainly what will appear and what will not,
 * rather than showing placeholders (§20.3). §19.4 explains why that is not a
 * hole: teardowns carry the same competence against public subjects, and are
 * the proof mechanism until case studies exist.
 */
export function Work() {
  const hasWork = WORK.length > 0;

  return (
    <>
      <Seo
        schemas={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Work', path: '/work' },
          ]),
        ]}
      />

      <Section tone="ink" aria-labelledby="work-heading">
        <Container>
          <Eyebrow className="text-onpunct-2">Work</Eyebrow>
          <Heading level={1} size="h1" id="work-heading" className="mt-3 text-onpunct">
            Selected work.
          </Heading>
          <p className="mt-6 max-w-[52ch] text-lead text-onpunct-2 [line-height:var(--lh-body)]">
            Craft samples, production reels and builds. Labelled for what they are.
          </p>
        </Container>
      </Section>

      {hasWork ? (
        <Section tone="paper" aria-labelledby="selected-heading">
          <Container>
            <Heading level={2} size="h2" id="selected-heading" className="sr-only">
              Selected work
            </Heading>
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {WORK.map((item) => (
                <li key={item.slug}>
                  <Link
                    to={`/work/${item.slug}`}
                    className="flex h-full flex-col border border-hairline [padding:var(--card-pad)] hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {/* §19.3 — PROJECT until real measured results exist. The
                        type, not this line, is what enforces it. */}
                    <span className="font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-secondary">
                      {item.kind === 'result' ? 'Result' : 'Project'}
                    </span>
                    <span className="mt-4 flex-1 text-h4 text-primary [line-height:var(--lh-heading)]">
                      {item.context}
                    </span>
                    <span className="mt-6 text-small text-secondary">
                      {item.client} · {item.timeframe}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : (
        <Section tone="paper" aria-labelledby="standard-heading">
          <Container>
            <Heading level={2} size="h2" id="standard-heading" className="max-w-[26ch]">
              What will appear here, and what will not
            </Heading>
            <div className="mt-12 grid gap-10 md:grid-cols-2">
              <div className="border-l-2 border-accent pl-6">
                <h3 className="font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-primary">
                  Will appear
                </h3>
                <ul className="mt-6 space-y-4 text-body text-primary [line-height:var(--lh-body)]">
                  <li>Real builds, reels and creative we produced</li>
                  <li>The diagnosis, the hypothesis and what was actually made</li>
                  <li>Which disciplines worked on it, and what each one owned</li>
                  <li>
                    Measured results — only once they are measured, with the method and
                    the window stated
                  </li>
                </ul>
              </div>
              <div className="border-l border-hairline pl-6">
                <h3 className="font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-secondary">
                  Will not appear
                </h3>
                <ul className="mt-6 space-y-4 text-body text-secondary [line-height:var(--lh-body)]">
                  <li>A percentage without an absolute baseline</li>
                  <li>A platform dashboard number presented as a business result</li>
                  <li>A composite or representative &ldquo;example client&rdquo;</li>
                  <li>
                    Before-and-after screenshots that are not genuinely before and after
                  </li>
                </ul>
              </div>
            </div>

            {/*
              §19.4 — teardowns are the proof mechanism until studies exist.
              This is not a consolation prize: a teardown is checkable against a
              public subject in a way a case study never is, because the reader
              can go and look at the ad themselves.
            */}
            <p className="mt-12 max-w-[62ch] text-body text-primary [line-height:var(--lh-body)]">
              Until there is measured work to show, our published teardowns carry the same
              reasoning against real, public subjects. They are the better test anyway:
              you can check the thinking yourself.
            </p>
            <p className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
              {TEARDOWNS.length > 0 && (
                <Link
                  to="/teardowns"
                  className="inline-flex items-center text-body text-accent-strong [min-height:var(--touch-min)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Read the published teardowns
                </Link>
              )}
              <Link
                to="/teardown"
                className="inline-flex items-center text-body text-accent-strong [min-height:var(--touch-min)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Request one on your own account
              </Link>
            </p>
          </Container>
        </Section>
      )}

      <CtaSection
        headline="See the thinking on your own account."
        body="A specialist reads your ads, your creative and the page they land on, and writes down what they would change and how they would measure it."
      />
    </>
  );
}
