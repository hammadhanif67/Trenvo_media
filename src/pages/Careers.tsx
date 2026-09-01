import { Link } from 'react-router';
import { Container, Eyebrow, Heading, Rule, Section } from '../components/ui';
import { DISCIPLINES } from '../data/disciplines';
import { HIRING_STANDARD } from '../data/process';
import { CONTACT_EMAIL } from '../lib/site';
import { Seo } from '../components/Seo';
import { breadcrumbSchema } from '../lib/schema';

/**
 * /careers
 *
 * The footer's Company column links here, and a footer link that 404s is worse
 * than no link — so the page exists and says something true.
 *
 * ⚠ NO VACANCY IS ADVERTISED, because none has been supplied. Listing an
 * opening that does not exist wastes a real person's application, and a
 * "we're always hiring" page with no roles is the same lie in softer words.
 *
 * What this page does instead is publish the hiring STANDARD — which is already
 * documented, is genuinely unusual, and is the thing a good specialist actually
 * wants to know before applying. It reads from the same HIRING_STANDARD and
 * DISCIPLINES data as /about, so the two cannot contradict each other.
 *
 * ⚠ NO JobPosting SCHEMA. JobPosting markup with no real vacancy behind it is a
 * structured-data violation and would put the domain at risk. When a real role
 * exists, add it as data and emit the schema from it — never before.
 *
 * TO PUBLISH A ROLE: add an OPENINGS array with real, dated vacancies and
 * render it above "How we hire".
 */

const WHAT_IT_IS_LIKE = [
  {
    t: 'You practise one craft',
    b: 'Nobody here is a "digital marketer". You are a Meta Ads specialist, or an editor, or a creative strategist, and you are not asked to cover a discipline you do not practise.',
  },
  {
    t: 'Your boundary is published',
    b: 'What you own and what you do not is written on the website, where clients can read it. That protects you as much as it informs them.',
  },
  {
    t: 'You talk to the client',
    b: 'Directly. There is no account manager relaying your work back to you as a request you did not recognise.',
  },
  {
    t: 'Your thinking gets published',
    b: 'Teardowns carry the author’s discipline. The work you do here is visible work, not something absorbed into an agency byline.',
  },
];

export function Careers() {
  return (
    <>
      <Seo
        schemas={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Careers', path: '/careers' },
          ]),
        ]}
      />

      <Section tone="ink" aria-labelledby="careers-heading">
        <Container>
          <Eyebrow className="text-onpunct-2">Careers</Eyebrow>
          <Heading level={1} size="h1" id="careers-heading" className="mt-3 text-onpunct">
            We hire specialists, and we do not move them off their craft.
          </Heading>
          <p className="mt-6 max-w-[54ch] text-lead text-onpunct-2 [line-height:var(--lh-body)]">
            There is no open vacancy listed today. The standard below is what we hire
            against whenever there is, and it does not change between roles.
          </p>
        </Container>
      </Section>

      {/* The standard. */}
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
            The work test is the whole interview. There is no culture-fit round, no
            take-home that quietly ships to a client, and no unpaid trial project. You
            will be reviewed by somebody who does your discipline, because nobody else
            can tell whether the work is good.
          </p>
        </Container>
      </Section>

      {/* What working here is like. */}
      <Section tone="surface" aria-labelledby="like-heading">
        <Container>
          <Heading level={2} size="h2" id="like-heading">
            What it is like
          </Heading>
          <ul className="mt-12 grid gap-8 md:grid-cols-2">
            {WHAT_IT_IS_LIKE.map((item) => (
              <li
                key={item.t}
                className="border border-hairline bg-base [padding:var(--card-pad)]"
              >
                <h3 className="text-h4 text-primary [line-height:var(--lh-heading)]">
                  {item.t}
                </h3>
                <p className="mt-3 text-body text-secondary [line-height:var(--lh-body)]">
                  {item.b}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* The disciplines — derived, so a new discipline appears here too. */}
      <Section tone="paper" aria-labelledby="disciplines-heading">
        <Container>
          <Heading level={2} size="h2" id="disciplines-heading">
            The disciplines we hire into
          </Heading>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DISCIPLINES.map((d) => (
              <li
                key={d.id}
                className="border-t border-hairline pt-4 text-body text-primary [line-height:var(--lh-body)]"
              >
                {d.title}
              </li>
            ))}
          </ul>
          <p className="mt-12 max-w-[62ch] text-body text-secondary [line-height:var(--lh-body)]">
            Each of these has a published boundary —{' '}
            <Link
              to="/about#specialists"
              className="text-accent-strong underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              what it owns and what it does not
            </Link>{' '}
            — and that boundary is what you would be hired against.
          </p>
        </Container>
      </Section>

      {/* How to reach us. Not a form: an application is not a lead, and routing
          it through the sales endpoint would be the wrong inbox. */}
      <Section tone="surface" aria-labelledby="apply-heading">
        <Container width="narrow">
          <Heading level={2} size="h2" id="apply-heading">
            If that describes you
          </Heading>
          <p className="mt-6 text-body text-primary [line-height:var(--lh-body)]">
            Write to{' '}
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Specialist introduction')}`}
              className="text-accent-strong underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {CONTACT_EMAIL}
            </a>{' '}
            with the discipline you practise and one piece of work you would defend in a
            review. Not a CV of responsibilities — one thing you made, and why you made
            it that way.
          </p>
          <p className="mt-6 text-small text-secondary [line-height:var(--lh-body)]">
            We read every one, and we reply even when the answer is no. If there is no
            open role in your discipline we will say that rather than leave it open.
          </p>
        </Container>
      </Section>
    </>
  );
}
