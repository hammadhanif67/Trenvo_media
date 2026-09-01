import { Link } from 'react-router';
import { Container, Eyebrow, Heading, Rule, Section } from '../components/ui';
import { DisciplineLattice } from '../components/cards/DisciplineLattice';
import { CtaSection } from '../sections/shared/CtaSection';
import { BOUNDARY_LINE, DISCIPLINES } from '../data/disciplines';
import { SPECIALISTS } from '../data/specialists';
import { ASSIGNMENT_MODEL, HIRING_STANDARD } from '../data/process';
import { TEARDOWNS } from '../data/teardowns';
import { REGION_LINE } from '../data/navigation';
import { FIT } from '../data/home';
import { Seo } from '../components/Seo';
import { breadcrumbSchema } from '../lib/schema';

/**
 * /about — THE COMPANY AND TEAM AUTHORITY PAGE.
 *
 * ⚠ THIS PAGE ABSORBED /specialists.
 *
 * The two pages argued the same position in different words. /about said "we
 * removed the seam by running the whole loop ourselves, with a named specialist
 * accountable for each part"; /specialists said "specialists on your account,
 * not a generalist with a dashboard". A visitor reading both learned nothing
 * the second time, and the split meant neither page could answer "who are these
 * people and how do they work" in one place — the actual question an About page
 * exists to answer.
 *
 * /specialists now 301s here (vercel.json), and the discipline lattice lives
 * under #specialists so the old inbound anchor still lands on the right block.
 *
 * §14 is explicit about what this page must NOT contain: "No stock office
 * photography, no invented milestones, no founding legend." There is no
 * headcount, no founding date and no milestone here, because none is
 * documented and none may be invented (§20.1).
 *
 * §10.2's first failure mode is fake people — "reverse-image-searchable, and
 * fatal if found". data/specialists.ts is empty, so the lattice shows the
 * DISCIPLINES and their boundaries and no person at all. Adding a real
 * specialist there fills it; nothing here needs editing for that.
 */
export function About() {
  return (
    <>
      <Seo
        schemas={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
          ]),
        ]}
      />

      <Section tone="ink" aria-labelledby="about-heading">
        <Container>
          <Eyebrow className="text-onpunct-2">About</Eyebrow>
          <Heading level={1} size="h1" id="about-heading" className="mt-3 text-onpunct">
            We exist because the seam costs more than the work.
          </Heading>
          <p className="mt-6 max-w-[52ch] text-lead text-onpunct-2 [line-height:var(--lh-body)]">
            Most brands buy media from one company and creative from another. Trenvo runs
            both, as one system, with one owner and one number.
          </p>
        </Container>
      </Section>

      {/* Why Trenvo exists — §5.1, in first person. */}
      <Section tone="paper" aria-labelledby="why-heading">
        <Container>
          <Heading level={2} size="h2" id="why-heading">
            Why we exist
          </Heading>
          <div className="mt-8 max-w-[62ch] space-y-6">
            <p className="text-body text-primary [line-height:var(--lh-body)]">
              When paid performance drops, the media buyer says the creative is fatigued
              and the creative supplier says the targeting is wrong. Both are usually
              right, which is exactly why nothing gets fixed.
            </p>
            <p className="text-body text-primary [line-height:var(--lh-body)]">
              The industry has words for this. &ldquo;Creative fatigue&rdquo; and
              &ldquo;post-click drop-off&rdquo; are both seam failures, described as if
              they were weather. They are not weather. They are what happens when
              separate suppliers each own a piece and none owns the number.
            </p>
            <p className="text-body text-primary [line-height:var(--lh-body)]">
              We removed the seam by running the whole loop ourselves — the creative, the
              media that distributes it, and the measurement that settles what worked —
              with a named specialist accountable for each part.{' '}
              <Link
                to="/process"
                className="text-accent-strong underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                The loop is described in full on the process page
              </Link>
              .
            </p>
          </div>
        </Container>
      </Section>

      {/* §10.1 — why the industry claim is empty. */}
      <Section tone="surface" aria-labelledby="empty-claim-heading">
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

      {/*
        THE SPECIALIST MODEL. `id="specialists"` is the landing target for the
        /specialists redirect and for every in-site link to the model.
        scroll-margin-top is applied globally to [id] in globals.css so the
        sticky header does not cover the heading.
      */}
      <Section tone="paper" aria-labelledby="disciplines-heading" id="specialists">
        <Container>
          <Eyebrow className="text-secondary">The specialist model</Eyebrow>
          <Heading level={2} size="h2" id="disciplines-heading" className="mt-3">
            {DISCIPLINES.length} disciplines, each with a published boundary
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

          {/*
            ⚠ NAMED PEOPLE ARE NOT INVENTED HERE.

            §10.2: fake team members are "reverse-image-searchable, and fatal if
            found". data/specialists.ts is an empty array and the lattice
            renders the disciplines without people until it is not.

            TO ADD THE REAL TEAM: append to SPECIALISTS in data/specialists.ts
            with a real name and the matching disciplineId. Each name then
            appears against its discipline in the lattice above, and this note
            is what should be deleted at the same time.
          */}
          {SPECIALISTS.length === 0 && (
            <p className="mt-6 max-w-[62ch] text-small text-secondary [line-height:var(--lh-body)]">
              We publish the structure before we publish the roster. Names and
              credentials go up as each specialist agrees to be listed — you are
              introduced to whoever is assigned to your account before any work starts,
              either way.
            </p>
          )}
        </Container>
      </Section>

      {/* §10.3 Q2 — the assignment model: how the company actually works. */}
      <Section tone="surface" aria-labelledby="assignment-heading">
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
      <Section tone="paper" aria-labelledby="standard-heading">
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

          <p className="mt-8 max-w-[62ch] text-body text-secondary [line-height:var(--lh-body)]">
            You will not find a percentage on this page. There is no &ldquo;top 1%&rdquo;
            claim, because it is unverifiable and it is what everyone else writes.{' '}
            <Link
              to="/careers"
              className="text-accent-strong underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              How we hire
            </Link>
            .
          </p>
        </Container>
      </Section>

      {/* How we operate internationally — §14, §7.3. */}
      <Section tone="surface" aria-labelledby="international-heading">
        <Container>
          <Heading level={2} size="h2" id="international-heading">
            How we work internationally
          </Heading>
          <div className="mt-8 max-w-[62ch] space-y-6">
            <p className="text-body text-primary [line-height:var(--lh-body)]">
              {REGION_LINE}.
            </p>
            <p className="text-body text-primary [line-height:var(--lh-body)]">
              You have direct contact with the specialists doing the work rather than an
              account manager relaying messages, and the daily overlap window is agreed in
              writing before a project starts.
            </p>
            <p className="text-body text-primary [line-height:var(--lh-body)]">
              We write in plain, international English. No regional idiom, no agency
              poetry — the person reading may be in Dubai, Berlin, London, Toronto or
              Sydney.
            </p>
          </div>
        </Container>
      </Section>

      {/*
        WHO WE ARE AND ARE NOT FOR — §8.4, §34.1(8).

        Reads from the same FIT data the homepage renders, so the two can never
        say different things about who Trenvo will turn down.
      */}
      <Section tone="paper" aria-labelledby="fit-heading">
        <Container>
          <Heading level={2} size="h2" id="fit-heading" className="max-w-[30ch]">
            {FIT.headline}
          </Heading>
          <p className="mt-8 max-w-[62ch] text-body text-secondary [line-height:var(--lh-body)]">
            Publishing refusals costs revenue. That is precisely why they are worth
            reading.
          </p>
          <div className="mt-12 grid gap-10 md:grid-cols-2">
            <div className="border-l-2 border-accent pl-6">
              <h3 className="font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-primary">
                {FIT.positiveTitle}
              </h3>
              <ul className="mt-6 space-y-4">
                {FIT.positive.map((item) => (
                  <li
                    key={item}
                    className="text-body text-primary [line-height:var(--lh-body)]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-l border-hairline pl-6">
              <h3 className="font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-secondary">
                {FIT.negativeTitle}
              </h3>
              <ul className="mt-6 space-y-4">
                {FIT.negative.map((item) => (
                  <li
                    key={item}
                    className="text-body text-secondary [line-height:var(--lh-body)]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
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
        headline="Start with a teardown, not a call."
        body="Send the ad account or the ads, and the page the traffic lands on. You get a specialist's read of what we would change and how we would measure it — before anything is asked of you."
      />
    </>
  );
}
