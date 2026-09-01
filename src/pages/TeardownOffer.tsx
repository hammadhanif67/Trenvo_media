import { Link } from 'react-router';
import { Container, Eyebrow, Heading, Rule, Section } from '../components/ui';
import { LeadForm } from '../components/forms/LeadForm';
import { SERVICES } from '../data/services';
import { TEARDOWNS } from '../data/teardowns';
import { Seo } from '../components/Seo';
import { breadcrumbSchema, faqSchema } from '../lib/schema';
import type { Faq } from '../types/content';

/**
 * /teardown — THE OFFER. Singular, deliberately: /teardowns is the library of
 * published analyses, /teardown is the thing you can ask for.
 *
 * This is the site's PRIMARY conversion path and the header CTA points here
 * rather than at /contact. The reasoning is the standard one for a high
 * consideration service: a contact form asks a stranger to start a sales
 * process, while this asks them to accept something. It also qualifies harder,
 * because a prospect who will not send their ad account was never going to buy
 * an engagement that requires it.
 *
 * ⚠ WHAT THIS PAGE MUST NEVER DO
 *
 * It must not promise a result. The teardown is analysis, and the honest claim
 * is about what is DELIVERED — a written read, in a stated window — not about
 * what it will do to anyone's CPA. There is no number anywhere on this page,
 * and there must not be one until measured case studies exist.
 *
 * "Who it is NOT for" is not modesty. It is the most load-bearing block here:
 * it stops the wrong enquiry before it costs a specialist an hour, and it is
 * the only part a sceptical reader treats as evidence that the rest is true.
 */

const REVIEWED = [
  {
    t: 'Your ad account structure',
    b: 'How campaigns, ad sets and budgets are organised, and whether the structure lets you read what is actually happening.',
  },
  {
    t: 'The creative itself',
    b: 'Hooks, first frames, pacing, formats and what each variant is actually testing — if anything.',
  },
  {
    t: 'Your measurement',
    b: 'What you are optimising toward, whether that event is defined correctly, and whether the number you report can survive being checked.',
  },
  {
    t: 'The destination',
    b: 'What the page does with the traffic you paid for, and whether the message matches the ad that sent it.',
  },
];

const RECEIVE = [
  'A written read — what we found, in order of what it is costing you.',
  'The specific changes we would make, named, not a list of best practices.',
  'How we would measure whether each one worked, and over what window.',
  'What we could not tell from the outside, stated plainly.',
];

const FOR_YOU = [
  'You are already spending on paid acquisition, on Meta or Google or both.',
  'Performance has plateaued or is drifting the wrong way and you want a second read.',
  'Creative volume is your bottleneck and you suspect it.',
  'You can give read access to the ad account, or point us at live ads.',
];

const NOT_FOR_YOU = [
  'You are not running paid media yet — there is nothing to tear down, and we would be guessing.',
  'You want an SEO or content audit. We do not do either, and we will say so rather than take the work.',
  'You are collecting proposals for a procurement process. This is analysis, not a pitch document.',
  'You want a number you can put in a board deck. We do not have your data, so any number we gave you would be invented.',
];

/**
 * ⚠ THESE ARE GENUINELY ON THE PAGE, which is what makes the FAQPage schema
 * legitimate. §21.5: "ONLY FOR QUESTIONS GENUINELY ON THE PAGE." Removing one
 * from the render without removing it here would be the exact misuse that
 * triggers a manual action.
 */
const FAQS: Faq[] = [
  {
    question: 'Is it actually free, or is it a sales call?',
    answer:
      'It is free and it is written. There is no call required to receive it. If we think there is a fit we will say so at the end of the document, and you can ignore that part.',
  },
  {
    question: 'What access do you need?',
    answer:
      'Read access to the ad account is ideal. If you would rather not grant it, send links to live ads — the Meta Ad Library is public — plus the page the traffic lands on. We can work from either.',
  },
  {
    question: 'How long does it take?',
    answer:
      'We tell you the turnaround when we accept the request, and we commit to it in writing. We do not publish a blanket window, because it depends on how much account there is to read and we would rather state a real date than a marketing one.',
  },
  {
    question: 'What if you find nothing wrong?',
    answer:
      'Then we say that. It happens, and it is a useful thing to know. We would rather tell you the account is in good shape than invent a problem we can sell you the fix for.',
  },
  {
    question: 'Who writes it?',
    answer:
      'A specialist in the relevant discipline — the person who would do the work, not a salesperson summarising someone else. If it spans media and creative, more than one of them contributes and each is named.',
  },
  {
    question: 'What do you do with our data afterwards?',
    answer:
      'We use it to write the teardown and to reply to you. We do not add you to a list or a sequence. Access can be revoked the moment you have the document, and our privacy note says what is kept.',
  },
];

export function TeardownOffer() {
  return (
    <>
      <Seo
        schemas={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Free teardown', path: '/teardown' },
          ]),
          faqSchema(FAQS),
        ]}
      />

      <Section tone="ink" aria-labelledby="offer-heading">
        <Container>
          <Eyebrow className="text-onpunct-2">The first step</Eyebrow>
          <Heading level={1} size="h1" id="offer-heading" className="mt-3 text-onpunct">
            A free teardown of your ads, your creative and the page they land on.
          </Heading>
          <p className="mt-6 max-w-[56ch] text-lead text-onpunct-2 [line-height:var(--lh-body)]">
            A specialist reads your account and writes down what they found, what they
            would change, and how they would measure whether it worked. No call, no deck,
            and nothing asked of you first.
          </p>
        </Container>
      </Section>

      {/* What it is. */}
      <Section tone="paper" aria-labelledby="what-heading">
        <Container>
          <Heading level={2} size="h2" id="what-heading" className="max-w-[26ch]">
            What a teardown is
          </Heading>
          <div className="mt-8 grid gap-10 lg:grid-cols-2">
            <div className="max-w-[62ch] space-y-6">
              <p className="text-body text-primary [line-height:var(--lh-body)]">
                It is the same analysis we publish{' '}
                <Link
                  to="/teardowns"
                  className="text-accent-strong underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  as public teardowns
                </Link>
                , done on your account instead of somebody else&rsquo;s. You can read
                those first and decide whether the thinking is worth having pointed at
                you.
              </p>
              <p className="text-body text-primary [line-height:var(--lh-body)]">
                It is not an audit template with your logo on it, and it is not a
                proposal wearing a different hat. It is a document that says what we
                found and what we would do, written by the specialist who would do it.
              </p>
              <p className="text-body text-primary [line-height:var(--lh-body)]">
                We do this because it is the honest version of a sales process. You get
                to see how we think before you pay us anything, and we get to see whether
                the account is one we can actually help.
              </p>
            </div>

            <div className="border-l-2 border-accent pl-6">
              <h3 className="font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-primary">
                What you receive
              </h3>
              <ul className="mt-6 space-y-4">
                {RECEIVE.map((item) => (
                  <li
                    key={item}
                    className="text-body text-primary [line-height:var(--lh-body)]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <Rule className="my-8" />
              <h3 className="font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-secondary">
                Turnaround
              </h3>
              {/*
                ⚠ NO WINDOW IS PROMISED HERE. A response-time commitment is a
                REAL trust signal precisely because it is falsifiable — which is
                why an invented one is worse than none. The commitment is made
                per request, in writing, when the request is accepted.
              */}
              <p className="mt-3 text-body text-secondary [line-height:var(--lh-body)]">
                We commit to a date in writing when we accept the request, and we hold to
                it. We do not publish a blanket window, because it depends on how much
                account there is to read.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* What gets reviewed. */}
      <Section tone="surface" aria-labelledby="reviewed-heading">
        <Container>
          <Heading level={2} size="h2" id="reviewed-heading">
            What gets reviewed
          </Heading>
          <ul className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {REVIEWED.map((item, i) => (
              <li key={item.t} className="border-t border-hairline pt-6">
                <span className="font-mono text-label text-accent [letter-spacing:var(--tracking-label)]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 text-h4 text-primary [line-height:var(--lh-heading)]">
                  {item.t}
                </h3>
                <p className="mt-3 text-body text-secondary [line-height:var(--lh-body)]">
                  {item.b}
                </p>
              </li>
            ))}
          </ul>

          <p className="mt-12 max-w-[62ch] text-body text-secondary [line-height:var(--lh-body)]">
            Which of those get the most attention depends on what you are running. The
            disciplines behind each are the same ones we sell —{' '}
            {SERVICES.map((service, i) => (
              <span key={service.slug}>
                {i > 0 && (i === SERVICES.length - 1 ? ' and ' : ', ')}
                <Link
                  to={`/services/${service.slug}`}
                  className="text-accent-strong underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {service.name}
                </Link>
              </span>
            ))}
            .
          </p>
        </Container>
      </Section>

      {/* Who it is for, and who it is not. */}
      <Section tone="paper" aria-labelledby="fit-heading">
        <Container>
          <Heading level={2} size="h2" id="fit-heading" className="max-w-[30ch]">
            Who this is for, and who it is not
          </Heading>
          <div className="mt-12 grid gap-10 md:grid-cols-2">
            <div className="border-l-2 border-accent pl-6">
              <h3 className="font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-primary">
                Ask for one if
              </h3>
              <ul className="mt-6 space-y-4">
                {FOR_YOU.map((item) => (
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
                Do not ask for one if
              </h3>
              <ul className="mt-6 space-y-4">
                {NOT_FOR_YOU.map((item) => (
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

      {/* THE FORM. `id` is the target every "Request a free teardown" CTA
          anchors to when it is already on this page. */}
      <Section tone="surface" aria-labelledby="request-heading" id="request">
        <Container width="narrow">
          <Heading level={2} size="h2" id="request-heading">
            Request your teardown
          </Heading>
          <p className="mt-6 max-w-[56ch] text-body text-secondary [line-height:var(--lh-body)]">
            Seven fields. The last one is the useful one — tell us what you already think
            is wrong, and we will tell you whether we agree.
          </p>
          <LeadForm
            intent="teardown"
            formName="teardown-offer"
            submitLabel="Request a free teardown"
            className="mt-12"
          />
        </Container>
      </Section>

      {/* The questions. Genuinely rendered, which is what makes the FAQPage
          schema above legitimate. */}
      <Section tone="paper" aria-labelledby="faq-heading">
        <Container width="narrow">
          <Heading level={2} size="h2" id="faq-heading">
            Before you ask
          </Heading>
          <dl className="mt-12">
            {FAQS.map((faq, i) => (
              <div key={faq.question} className={i > 0 ? 'mt-8 border-t border-hairline pt-8' : ''}>
                <dt className="text-h4 text-primary [line-height:var(--lh-heading)]">
                  {faq.question}
                </dt>
                <dd className="mt-3 max-w-[62ch] text-body text-secondary [line-height:var(--lh-body)]">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>

          {TEARDOWNS.length > 0 && (
            <p className="mt-12 text-body text-primary [line-height:var(--lh-body)]">
              Want to see the format first?{' '}
              <Link
                to="/teardowns"
                className="text-accent-strong underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Read a published teardown
              </Link>
              .
            </p>
          )}
        </Container>
      </Section>
    </>
  );
}
