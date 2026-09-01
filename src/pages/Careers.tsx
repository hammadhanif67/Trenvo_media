import { Link } from 'react-router';
import { Container, Eyebrow, Heading, Rule, Section } from '../components/ui';
import { DISCIPLINES } from '../data/disciplines';
import { HIRING_STANDARD } from '../data/process';
import { SOCIAL_LINKS } from '../data/navigation';
import { CONTACT_EMAIL } from '../lib/site';
import { Seo } from '../components/Seo';
import { breadcrumbSchema } from '../lib/schema';

/**
 * /careers
 *
 * The footer's Company column links here, and a footer link that 404s is worse
 * than no link — so the page exists and says something true.
 *
 * ⚠ NO VACANCY IS RESTATED HERE, and that is deliberate.
 *
 * This page used to assert "There is no open vacancy listed today." That was
 * written when no role data had been supplied, and it had since become FALSE:
 * the company's LinkedIn page carries live hiring posts (a Paid Digital
 * Marketing Internship, a Video Editor (AI-Savvy), and a Creative Graphic
 * Designer / Video Editor). A careers page that denies openings the company is
 * publicly advertising costs it real applicants.
 *
 * The fix is not to mirror the vacancy list here, which would go stale the same
 * way. It is to point at the surface where roles are actually posted. Listing an
 * opening that does not exist wastes a real person's application; denying one
 * that does is the same failure pointed the other way.
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
  /* Undefined if the LinkedIn entry is ever removed; the block unmounts. */
  const linkedIn = SOCIAL_LINKS.find((social) => social.label === 'LinkedIn');

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
            Open roles are posted on our LinkedIn page. The standard below is what we
            hire against whenever there is one, and it does not change between roles.
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

          {/*
            Roles are advertised on LinkedIn, so that is where a candidate should
            look for what is actually open right now. Linking to the profile rather
            than restating a vacancy list here means this page cannot go stale
            against it — which is the failure it had before, claiming no openings
            while the LinkedIn page carried live hiring posts.

            Derived from SOCIAL_LINKS so it cannot drift from the footer, and it
            simply does not render if the LinkedIn entry is ever removed.
          */}
          {linkedIn && (
            <p className="mt-6 text-body text-primary [line-height:var(--lh-body)]">
              Current openings are posted on{' '}
              <a
                href={linkedIn.href}
                target="_blank"
                rel="noreferrer noopener"
                className="text-accent-strong underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                our LinkedIn page
                {/*
                  An sr-only SUFFIX, not an aria-label.

                  The footer's social links use aria-label because they contain
                  only an icon and have no visible text to override. This one is
                  a text link, and an aria-label like "Trenvo Media on LinkedIn"
                  would REPLACE the accessible name with a string that does not
                  contain the visible words "our LinkedIn page" — which breaks
                  WCAG 2.5.3 Label in Name for anyone driving the page by voice,
                  because saying "click our LinkedIn page" would no longer match.

                  Appending inside the link keeps the visible text at the start
                  of the accessible name and still warns that focus is about to
                  move to another tab (WCAG 3.2.5).
                */}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              . An introduction is worth sending either way — we keep them on file
              against the discipline you practise.
            </p>
          )}
        </Container>
      </Section>
    </>
  );
}
