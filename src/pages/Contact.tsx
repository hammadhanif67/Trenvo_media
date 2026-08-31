import { Container, Eyebrow, Heading, Section } from '../components/ui';
import { CONTACT_EMAIL, REGION_LINE } from '../data/navigation';
import { Seo } from '../components/Seo';
import { breadcrumbSchema } from '../lib/schema';

/**
 * /contact — master.md §14, §15.4.
 *
 * §14: "Two paths on one page: Start a project (qualified form) and Get a
 * teardown (lighter form). Response-time commitment stated. What happens next,
 * in three steps. No phone number unless it will genuinely be answered."
 *
 * TWO GAPS, both handled rather than faked. See implementation.md §5.9.
 *
 * 1. NO SUBMISSION ENDPOINT EXISTS (Part 8, P1). §28.4 mandates a zero-server
 *    static deploy and no backend has been chosen. Shipping a form that
 *    silently discards a qualified lead would be worse than shipping none, so
 *    this page uses the documented email as the mechanism and states exactly
 *    what to send. The §15.4 field lists become the "what to include" lists —
 *    the same qualifying information, asked for in a way that works today.
 *
 * 2. NO RESPONSE TIME IS DOCUMENTED. §20.2 item 9 counts a response-time
 *    commitment in the launch trust stack, but no window appears in either
 *    document. §20.1 rates it a REAL trust signal because it is "immediately
 *    falsifiable" — which is exactly why an invented one would be a false
 *    signal. It is absent until the business states it.
 *
 * §14's "no phone number unless it will genuinely be answered" is honoured by
 * there being none.
 */

/** §15.4 — the qualified path. The spend band is the most important field. */
const PROJECT_FIELDS = [
  'Your name and work email',
  'Company URL',
  'Monthly media spend band',
  'Primary market',
  'What is not working',
  'Timeline',
];

/** §15.4 — the low-friction path. Value is delivered before anything is asked. */
const TEARDOWN_FIELDS = [
  'Your name and work email',
  'Company URL',
  'A link to the ad account or the ad library entry (optional)',
];

const NEXT_STEPS = [
  {
    i: '01',
    t: 'We read it',
    b: 'A specialist in the relevant practice reads the account, the creative and the page.',
  },
  {
    i: '02',
    t: 'We reply with a read',
    b: 'What we found and what we would change — not a sales deck.',
  },
  {
    i: '03',
    t: 'You decide',
    b: 'If it is a fit, we scope the first cycle. If it is not, we say so.',
  },
];

export function Contact() {
  return (
    <>
      <Seo
        schemas={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Contact', path: '/contact' },
          ]),
        ]}
      />

      <Section tone="ink" aria-labelledby="contact-heading">
        <Container>
          <Eyebrow className="text-onpunct-2">Contact</Eyebrow>
          <Heading level={1} size="h1" id="contact-heading" className="mt-3 text-onpunct">
            Tell us what you are building.
          </Heading>
          <p className="mt-6 max-w-[52ch] text-lead text-onpunct-2 [line-height:var(--lh-body)]">
            Two ways in. One asks for more because it is scoping real work; the other
            gives you something before it asks for anything.
          </p>
        </Container>
      </Section>

      <Section tone="paper" aria-labelledby="paths-heading">
        <Container>
          <Heading level={2} size="h2" id="paths-heading" className="sr-only">
            How to get in touch
          </Heading>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Tier 1 — §17.2. Higher friction, because qualification is the point. */}
            <article className="flex flex-col border-l-2 border-accent bg-alt [padding:var(--card-pad)]">
              <h3 className="text-h3 font-semibold text-primary [letter-spacing:var(--tracking-heading)] [line-height:var(--lh-heading)]">
                Start a project
              </h3>
              <p className="mt-4 text-body text-secondary [line-height:var(--lh-body)]">
                For brands already spending on paid acquisition. Include:
              </p>
              <ul className="mt-6 flex-1 space-y-3">
                {PROJECT_FIELDS.map((f) => (
                  <li
                    key={f}
                    className="text-body text-primary [line-height:var(--lh-body)]"
                  >
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=Start%20a%20project`}
                className="mt-8 inline-flex w-fit items-center bg-blue-600 px-6 text-small font-medium text-paper [min-height:var(--touch-min)] [padding:var(--btn-pad-primary)] hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Email us to start
              </a>
            </article>

            {/* Tier 2 — §17.2's artefact CTA. Lower friction by design. */}
            <article className="flex flex-col border border-hairline [padding:var(--card-pad)]">
              <h3 className="text-h3 font-semibold text-primary [letter-spacing:var(--tracking-heading)] [line-height:var(--lh-heading)]">
                Get a teardown
              </h3>
              <p className="mt-4 text-body text-secondary [line-height:var(--lh-body)]">
                A specialist read of your ads and your creative. Include:
              </p>
              <ul className="mt-6 flex-1 space-y-3">
                {TEARDOWN_FIELDS.map((f) => (
                  <li
                    key={f}
                    className="text-body text-primary [line-height:var(--lh-body)]"
                  >
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=Teardown%20request`}
                className="mt-8 inline-flex w-fit items-center border border-hairline px-6 text-small font-medium text-primary [min-height:var(--touch-min)] [padding:var(--btn-pad-secondary)] hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Email us for a teardown
              </a>
            </article>
          </div>

          <p className="mt-12 text-body text-secondary [line-height:var(--lh-body)]">
            Either way, write to{' '}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-accent-strong underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {CONTACT_EMAIL}
            </a>
            . {REGION_LINE}.
          </p>
        </Container>
      </Section>

      {/* §14 — what happens next, in three steps. */}
      <Section tone="surface" aria-labelledby="next-heading">
        <Container>
          <Heading level={2} size="h2" id="next-heading">
            What happens next
          </Heading>
          <ol className="mt-12 grid gap-8 md:grid-cols-3">
            {NEXT_STEPS.map((s) => (
              <li key={s.i} className="border-t border-hairline pt-6">
                <span className="font-mono text-label text-accent [letter-spacing:var(--tracking-label)]">
                  {s.i}
                </span>
                <h3 className="mt-4 text-h4 text-primary [line-height:var(--lh-heading)]">
                  {s.t}
                </h3>
                <p className="mt-3 text-body text-secondary [line-height:var(--lh-body)]">
                  {s.b}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>
    </>
  );
}
