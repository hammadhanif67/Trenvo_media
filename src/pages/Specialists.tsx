import { Link } from 'react-router';
import { Container, Eyebrow, Heading, Rule, Section } from '../components/ui';
import { DisciplineLattice } from '../components/cards/DisciplineLattice';
import { CtaSection } from '../sections/shared/CtaSection';
import { BOUNDARY_LINE, DISCIPLINES } from '../data/disciplines';
import { SPECIALISTS } from '../data/specialists';
import { ASSIGNMENT_MODEL, HIRING_STANDARD } from '../data/process';
import { TEARDOWNS } from '../data/teardowns';
import { Seo } from '../components/Seo';
import { breadcrumbSchema } from '../lib/schema';

/**
 * /specialists — master.md §14, §10.
 *
 * §10 opens: "This is the differentiator. It is also the easiest section in the
 * entire site to get wrong, because the honest version and the dishonest
 * version look identical from a distance."
 *
 * §14's order: Hero -> why the industry claim is empty -> the six disciplines
 * with scope and boundary -> the assignment model -> the hiring standard ->
 * (when real) named specialists -> teardowns authored by discipline -> CTA.
 *
 * §7.2 Option C is the documented H1 for this page specifically.
 *
 * Nothing here invents a person. §10.2 lists three failure modes and fake
 * people is the first: "reverse-image-searchable, and fatal if found."
 */
export function Specialists() {
  return (
    <>
      <Seo
        schemas={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Specialists', path: '/specialists' },
          ]),
        ]}
      />

      <Section tone="ink" aria-labelledby="specialists-heading">
        <Container>
          <Eyebrow className="text-onpunct-2">The difference</Eyebrow>
          <Heading
            level={1}
            size="h1"
            id="specialists-heading"
            className="mt-3 text-onpunct"
          >
            Specialists on your account. Not a generalist with a dashboard.
          </Heading>
          <p className="mt-6 max-w-[52ch] text-lead text-onpunct-2 [line-height:var(--lh-body)]">
            Six disciplines, each with a stated boundary. You will know the name of every
            person who touches your account.
          </p>
        </Container>
      </Section>

      {/* §10.1 — why the industry claim is empty. */}
      <Section tone="paper" aria-labelledby="empty-claim-heading">
        <Container>
          <Heading level={2} size="h2" id="empty-claim-heading" className="max-w-[26ch]">
            Why &ldquo;top talent&rdquo; means nothing
          </Heading>
          <div className="mt-8 max-w-[62ch] space-y-6">
            <p className="text-body text-primary [line-height:var(--lh-body)]">
              Every agency asserts expertise. Almost none exposes how it is organised. The
              assertion has therefore lost all of its information value — a reader
              discounts &ldquo;top talent&rdquo; to zero automatically, and they are right
              to.
            </p>
            <p className="text-body text-primary [line-height:var(--lh-body)]">
              Structure is the only remaining way to make the claim mean anything. So
              instead of adjectives, below is the roster of disciplines, what each one
              owns, and — the part that is hard to fake — what each one is not allowed to
              touch.
            </p>
          </div>
        </Container>
      </Section>

      {/* The nine disciplines with scope and boundary (§10.3 Q1). */}
      <Section tone="surface" aria-labelledby="disciplines-heading">
        <Container>
          <Heading level={2} size="h2" id="disciplines-heading">
            Six disciplines
          </Heading>
          <p className="mt-6 max-w-[62ch] text-body text-secondary [line-height:var(--lh-body)]">
            Select a discipline to see what it owns and what it does not.
          </p>
          <div className="mt-12">
            <DisciplineLattice disciplines={DISCIPLINES} people={SPECIALISTS} />
          </div>
          <p className="mt-12 max-w-[62ch] text-body text-primary [line-height:var(--lh-body)]">
            {BOUNDARY_LINE}
          </p>
        </Container>
      </Section>

      {/* §10.3 Q2 — the assignment model. */}
      <Section tone="paper" aria-labelledby="assignment-heading">
        <Container>
          <Heading level={2} size="h2" id="assignment-heading">
            {ASSIGNMENT_MODEL.heading}
          </Heading>
          <ol className="mt-12 max-w-[72ch]">
            {ASSIGNMENT_MODEL.commitments.map((c, i) => (
              <li key={c} className="flex gap-6 border-t border-hairline py-6">
                <span className="font-mono text-label text-accent [letter-spacing:var(--tracking-label)]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-body text-primary [line-height:var(--lh-body)]">{c}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 max-w-[62ch] text-body text-secondary [line-height:var(--lh-body)]">
            {ASSIGNMENT_MODEL.note}
          </p>
        </Container>
      </Section>

      {/* §10.3 Q3 — the hiring standard. */}
      <Section tone="surface" aria-labelledby="standard-heading">
        <Container>
          <Heading level={2} size="h2" id="standard-heading">
            {HIRING_STANDARD.heading}
          </Heading>
          <ul className="mt-12 max-w-[72ch] space-y-6">
            {HIRING_STANDARD.items.map((item) => (
              <li
                key={item}
                className="border-l-2 border-accent pl-6 text-body text-primary [line-height:var(--lh-body)]"
              >
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-[62ch] text-small text-secondary [line-height:var(--lh-body)]">
            {HIRING_STANDARD.note}
          </p>

          <Rule className="mt-12" />

          {/*
            §10.3: "Do not write 'top 1%'. It is unverifiable, it is what
            everyone else writes, and a technical buyer reads it as noise."
            Saying so out loud is itself the differentiator.
          */}
          <p className="mt-8 max-w-[62ch] text-body text-secondary [line-height:var(--lh-body)]">
            You will not find a percentage on this page. There is no &ldquo;top 1%&rdquo;
            claim, because it is unverifiable and it is what everyone else writes.
          </p>
        </Container>
      </Section>

      {/*
        §10.3 Q4 — "Show me." Teardowns authored by discipline are the work
        sample. Unmounts while empty (§20.3) rather than promising work that
        does not exist yet.
      */}
      {TEARDOWNS.length > 0 && (
        <Section tone="ink" aria-labelledby="authored-heading">
          <Container>
            <Heading level={2} size="h2" id="authored-heading" className="text-onpunct">
              Their thinking, published
            </Heading>
            <ul className="mt-12 grid gap-6 md:grid-cols-3">
              {TEARDOWNS.slice(0, 3).map((t) => (
                <li key={t.slug}>
                  <Link
                    to={`/teardowns/${t.slug}`}
                    className="flex h-full flex-col border border-hairline [padding:var(--card-pad)] text-onpunct hover:border-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                  >
                    <span className="font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-onpunct-2">
                      {t.disciplineId.replace(/-/g, ' ')}
                    </span>
                    <span className="mt-4 flex-1 text-h4">{t.subject}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      <CtaSection
        headline="Tell us what you are building."
        body="Send the site, the ad account, and what is not working. You will get a specialist's read, not a sales deck."
      />
    </>
  );
}
