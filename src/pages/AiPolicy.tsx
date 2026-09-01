import { Link } from 'react-router';
import { Container, Eyebrow, Heading, Rule, Section } from '../components/ui';
import { CtaSection } from '../sections/shared/CtaSection';
import { Seo } from '../components/Seo';
import { breadcrumbSchema } from '../lib/schema';

/**
 * /ai-policy
 *
 * Trenvo sells AI video production, which means the buyer's first real question
 * is not "can you" but "what exactly am I getting, and will anyone be able to
 * tell". Almost no agency answers that in writing. Answering it is the
 * differentiator, and it is also the thing that makes the AI Video service page
 * credible rather than a claim.
 *
 * ⚠ WHAT THIS PAGE MUST NOT BECOME
 *
 * It must not claim a certification, an audit, a compliance standard or a
 * regulatory alignment Trenvo does not hold. There is no ISO number here, no
 * "compliant with" anything, and no named framework. Everything below is a
 * description of practice — a thing the company does, which a client can
 * verify by working with it — rather than an accreditation, which they could
 * not.
 *
 * Every statement here is one the AI Video service page already commits to in
 * its mechanism lines. If those change, this changes with them.
 */

const WHERE_USED = [
  {
    t: 'Variant generation',
    b: 'Turning one approved concept into the twelve versions a paid account actually needs — different hooks, framings and objections. This is the main reason we use it: it makes iteration possible at a speed a shoot cannot match.',
  },
  {
    t: 'Synthetic presenters',
    b: 'Generated on-camera performers, where a concept calls for one and a live shoot is not justified by the spend. Always labelled to you, and never presented as a real customer.',
  },
  {
    t: 'Product scene composition',
    b: 'Placing a real product into generated environments, so a single product shoot can support many settings.',
  },
  {
    t: 'Localisation and voice',
    b: 'Language variants and voice-over for markets where producing separately would not be justified by the media budget behind them.',
  },
  {
    t: 'Analysis and drafting support',
    b: 'Summarising account data and drafting first-pass copy. A specialist decides what any of it means; the tool never decides anything.',
  },
];

const WHERE_NOT_USED = [
  'Anything presented as a real customer, a real review or a real testimonial. Ever.',
  'Anything implying an endorsement, a partnership or a person who does not exist.',
  'Generating a claim about a product. Claims come from the client and are their responsibility.',
  'Deciding where budget goes. Automation inside the ad platforms is supervised by a named specialist, which is most of what our media practice is for.',
  'Recreating a real person’s likeness or voice without their written permission.',
];

const HUMAN_REVIEW = [
  {
    t: 'Every asset gets an editorial pass',
    b: 'No generated output reaches an ad account unreviewed. A person watches it, in full, and is accountable for it going live.',
  },
  {
    t: 'The concept is human before the tool touches it',
    b: 'Variants differ by hypothesis — hook, offer framing, objection — and the hypothesis is written by a creative strategist. AI executes variants of an idea; it does not supply the idea.',
  },
  {
    t: 'Claims are checked against source',
    b: 'Anything a generated asset asserts about a product is checked against what the client has told us is true, because a generative model will produce a confident sentence either way.',
  },
  {
    t: 'A named person signs off',
    b: 'The AI Video Producer owns the pipeline; final editorial approval sits outside that discipline, on purpose. The boundary is published with every other one.',
  },
];

const DISCLOSURE = [
  'You are told which assets are synthetic, which are live-action, and which are a mix — asset by asset, not as a blanket note in a contract.',
  'Platform disclosure requirements are respected on every platform we run. Where a platform requires an AI-content declaration, it is made.',
  'A synthetic presenter is never labelled to your audience as a real customer, and never dressed as testimonial footage.',
  'If you would rather nothing synthetic ran on your account, say so and we will produce without it. It costs more and moves slower, and that is a legitimate trade to make.',
];

const DATA = [
  {
    t: 'Your data is not training data',
    b: 'We do not submit your account data, your customer data or your unreleased creative to a model provider for training. Where a tool offers a training opt-out, it is switched off before the tool is used on client work.',
  },
  {
    t: 'Least data, not most',
    b: 'Analysis is done on the smallest extract that answers the question. There is no reason for a model to see a customer list, so it does not.',
  },
  {
    t: 'Personal data stays out',
    b: 'Customer records, email lists and anything identifying an individual are not put into a generative tool at all.',
  },
  {
    t: 'You own the output',
    b: 'Assets produced for you are yours, on the same terms as everything else we make. What we cannot do is warrant that a generative model produced something wholly original, because no one honestly can — so anything at legal risk gets a human-produced alternative.',
  },
];

export function AiPolicy() {
  return (
    <>
      <Seo
        schemas={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'AI policy', path: '/ai-policy' },
          ]),
        ]}
      />

      <Section tone="ink" aria-labelledby="ai-heading">
        <Container>
          <Eyebrow className="text-onpunct-2">AI policy</Eyebrow>
          <Heading level={1} size="h1" id="ai-heading" className="mt-3 text-onpunct">
            Where we use AI, where people decide, and how you are told.
          </Heading>
          <p className="mt-6 max-w-[56ch] text-lead text-onpunct-2 [line-height:var(--lh-body)]">
            We sell AI video production, so you are entitled to know exactly what that
            means before you buy it. This is that answer, in writing, rather than a
            sentence in a contract.
          </p>
        </Container>
      </Section>

      {/* The position. */}
      <Section tone="paper" aria-labelledby="position-heading">
        <Container>
          <Heading level={2} size="h2" id="position-heading" className="max-w-[28ch]">
            AI is a production capability, not a positioning claim
          </Heading>
          <div className="mt-8 max-w-[62ch] space-y-6">
            <p className="text-body text-primary [line-height:var(--lh-body)]">
              The reason to produce with AI is not that it costs less. It is that a
              concept can be tested in days instead of quarters, in twelve variants
              instead of one, before anyone commits a budget to a shoot.
            </p>
            <p className="text-body text-primary [line-height:var(--lh-body)]">
              That is a real advantage and it is narrow. It does not make the creative
              better, it does not replace the person who decides what to test, and it
              does not make a bad hypothesis worth running twelve times. We use AI where
              it makes iteration possible, and people where it makes the work good.
            </p>
            <p className="text-body text-primary [line-height:var(--lh-body)]">
              Read this page alongside{' '}
              <Link
                to="/services/ai-video"
                className="text-accent-strong underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                the AI Video service
              </Link>{' '}
              — every commitment here is one that page&rsquo;s mechanism lines already
              make.
            </p>
          </div>
        </Container>
      </Section>

      {/* Where it is used, and where it is not. */}
      <Section tone="surface" aria-labelledby="where-heading">
        <Container>
          <Heading level={2} size="h2" id="where-heading">
            Where AI is used
          </Heading>
          <ul className="mt-12 grid gap-8 md:grid-cols-2">
            {WHERE_USED.map((item, i) => (
              <li key={item.t} className="border-t border-hairline pt-6">
                <span className="font-mono text-label text-accent [letter-spacing:var(--tracking-label)]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 text-h4 text-primary [line-height:var(--lh-heading)]">
                  {item.t}
                </h3>
                <p className="mt-3 max-w-[52ch] text-body text-secondary [line-height:var(--lh-body)]">
                  {item.b}
                </p>
              </li>
            ))}
          </ul>

          <Rule className="mt-16" />

          <h3 className="mt-12 text-h3 font-semibold text-primary [letter-spacing:var(--tracking-heading)] [line-height:var(--lh-heading)]">
            Where it is not, under any circumstances
          </h3>
          <ul className="mt-8 max-w-[72ch] space-y-4">
            {WHERE_NOT_USED.map((item) => (
              <li
                key={item}
                className="border-l border-hairline pl-6 text-body text-secondary [line-height:var(--lh-body)]"
              >
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Human review. */}
      <Section tone="paper" aria-labelledby="review-heading">
        <Container>
          <Heading level={2} size="h2" id="review-heading">
            Where a human reviews
          </Heading>
          <ul className="mt-12 grid gap-8 md:grid-cols-2">
            {HUMAN_REVIEW.map((item) => (
              <li
                key={item.t}
                className="border border-hairline [padding:var(--card-pad)]"
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

      {/* Disclosure. */}
      <Section tone="surface" aria-labelledby="disclosure-heading">
        <Container>
          <Heading level={2} size="h2" id="disclosure-heading" className="max-w-[28ch]">
            How AI-generated creative is disclosed
          </Heading>
          <p className="mt-8 max-w-[62ch] text-body text-secondary [line-height:var(--lh-body)]">
            Our disclosure philosophy is short: the client always knows, the platform
            always knows where it requires to, and the audience is never deceived about
            whether a person is real.
          </p>
          <ul className="mt-12 max-w-[72ch] space-y-6">
            {DISCLOSURE.map((item) => (
              <li
                key={item}
                className="border-l-2 border-accent pl-6 text-body text-primary [line-height:var(--lh-body)]"
              >
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Data and privacy. */}
      <Section tone="paper" aria-labelledby="data-heading">
        <Container>
          <Heading level={2} size="h2" id="data-heading">
            Data and privacy principles
          </Heading>
          <ul className="mt-12 grid gap-8 md:grid-cols-2">
            {DATA.map((item) => (
              <li
                key={item.t}
                className="border border-hairline [padding:var(--card-pad)]"
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

          {/*
            ⚠ NO CERTIFICATION IS CLAIMED, and saying so is part of the point.
            A policy page is exactly where an unearned compliance badge would
            go unchallenged.
          */}
          <p className="mt-12 max-w-[62ch] border-l-2 border-hairline pl-6 text-body text-secondary [line-height:var(--lh-body)]">
            This is a description of how we work, not a certification. We hold no AI
            audit, no compliance accreditation and no regulatory approval, and we will
            not imply otherwise. What we will do is answer a specific question about a
            specific tool, in writing, whenever you ask one. The{' '}
            <Link
              to="/dpa"
              className="text-accent-strong underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              data processing addendum
            </Link>{' '}
            covers the contractual side.
          </p>
        </Container>
      </Section>

      <CtaSection
        headline="Ask us something specific."
        body="If there is a tool, a model or a disclosure rule you need a straight answer on before you can work with us, ask. We would rather answer it now than in a contract review."
      />
    </>
  );
}
