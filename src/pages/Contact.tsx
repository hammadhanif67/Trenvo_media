import { Link } from 'react-router';
import { Container, Eyebrow, Heading, Section } from '../components/ui';
import { LeadForm } from '../components/forms/LeadForm';
import { REGION_LINE } from '../data/navigation';
import { CONTACT_EMAIL } from '../lib/site';
import { Seo } from '../components/Seo';
import { breadcrumbSchema } from '../lib/schema';

/**
 * /contact — master.md §14, §15.4.
 *
 * ⚠ THIS PAGE USED TO BE TWO mailto: LINKS.
 *
 * It carried no form at all. The reasoning at the time was that no submission
 * endpoint existed and a form that silently discards a lead is worse than none
 * — which is correct as far as it goes, and the wrong conclusion. A mailto:
 * link loses everyone without a configured desktop mail client, which on mobile
 * is most visitors, and it cannot validate, qualify or be measured.
 *
 * The form now POSTs to /api/contact, which dispatches to whichever provider is
 * configured by environment variable, and falls back to a pre-filled email when
 * none is. Nothing is silently discarded and nothing is faked. See
 * api/contact.js and components/forms/LeadForm.tsx.
 *
 * TWO PATHS, and the LOWER-FRICTION ONE IS PRIMARY. §14 asks for both a
 * qualified path and a lighter one. The lighter one has its own page at
 * /teardown and is the header CTA; this page is for the buyer who is already
 * past that and wants to talk about the work.
 *
 * NO RESPONSE-TIME COMMITMENT IS PUBLISHED. §20.1 rates one a REAL trust signal
 * because it is "immediately falsifiable" — which is exactly why an invented
 * one would be a false signal. It stays absent until the business states it.
 *
 * §14's "no phone number unless it will genuinely be answered" is honoured by
 * there being none.
 */

const NEXT_STEPS = [
  {
    i: '01',
    t: 'A specialist reads it',
    b: 'Someone in the practice that owns your primary objective — not an account manager, and not an autoresponder.',
  },
  {
    i: '02',
    t: 'We reply with a read',
    b: 'What we would look at first and what we think is going on. Not a deck, and not a calendar link with nothing attached.',
  },
  {
    i: '03',
    t: 'You decide',
    b: 'If it is a fit, we scope the first cycle with the disciplines named. If it is not, we say so plainly.',
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
          <p className="mt-6 max-w-[54ch] text-lead text-onpunct-2 [line-height:var(--lh-body)]">
            Send the site, the ad account, and what is not working. You get a
            specialist&rsquo;s read, not a sales deck.
          </p>
        </Container>
      </Section>

      <Section tone="paper" aria-labelledby="form-heading">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
            <div>
              <Heading level={2} size="h2" id="form-heading">
                Start a conversation
              </Heading>
              <p className="mt-6 max-w-[56ch] text-body text-secondary [line-height:var(--lh-body)]">
                For brands already spending on paid acquisition. The spend band is the
                field that decides who reads this, so it is the one worth getting right.
              </p>
              <LeadForm
                intent="project"
                formName="contact-project"
                submitLabel="Start a conversation"
                className="mt-12"
              />
            </div>

            <aside className="lg:border-l lg:border-hairline lg:pl-12">
              {/*
                THE LOWER-FRICTION PATH, kept visible rather than buried. A
                visitor who is not ready to talk about an engagement should not
                have to leave to find the thing that asks less of them.
              */}
              <h3 className="text-h4 text-primary [line-height:var(--lh-heading)]">
                Not ready for that?
              </h3>
              <p className="mt-3 text-body text-secondary [line-height:var(--lh-body)]">
                Ask for a free teardown instead. A specialist read of your ads and your
                creative, written down, with nothing asked of you first.
              </p>
              <Link
                to="/teardown"
                className="mt-4 inline-flex items-center text-body text-accent-strong [min-height:var(--touch-min)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Request a free teardown
              </Link>

              <h3 className="mt-12 text-h4 text-primary [line-height:var(--lh-heading)]">
                Prefer email?
              </h3>
              <p className="mt-3 text-body text-secondary [line-height:var(--lh-body)]">
                Write to{' '}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-accent-strong underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {CONTACT_EMAIL}
                </a>
                . It reaches a specialist, not a queue.
              </p>

              <h3 className="mt-12 text-h4 text-primary [line-height:var(--lh-heading)]">
                Where we work
              </h3>
              <p className="mt-3 text-body text-secondary [line-height:var(--lh-body)]">
                {REGION_LINE}. The daily overlap window is agreed in writing before a
                project starts.
              </p>
            </aside>
          </div>
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
