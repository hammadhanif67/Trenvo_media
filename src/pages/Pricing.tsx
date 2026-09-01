import { Link } from 'react-router';
import { Container, Eyebrow, Heading, Rule, Section } from '../components/ui';
import { CtaSection } from '../sections/shared/CtaSection';
import { PRACTICES, servicesInPractice } from '../data/services';
import { Seo } from '../components/Seo';
import { breadcrumbSchema } from '../lib/schema';

/**
 * /pricing
 *
 * ⚠ THERE ARE NO NUMBERS ON THIS PAGE, AND THAT IS DELIBERATE.
 *
 * No band, currency, minimum or engagement fee has been supplied to this
 * repository — PROCESS_GAPS in data/process.ts records exactly that gap. §20.1
 * counts published engagement bands as a REAL trust signal precisely because
 * they are a checkable commitment, which is why an invented one is not a weak
 * signal but a false one. A prospect who is quoted something different on the
 * call has learned the site lies.
 *
 * So this page publishes what IS true and IS useful: how an engagement is
 * structured, what actually drives its cost, and what we will tell you before
 * you ask. That is more decision-useful to a real buyer than a "from $X"
 * number they would discount anyway, and it is honest.
 *
 * ⚠ TO PUBLISH REAL BANDS: add them to data/process.ts and render them in the
 * "What it costs" section below, replacing the note. Do not add a band here
 * that has not been agreed by the business.
 */

const DRIVERS = [
  {
    t: 'How much creative the account consumes',
    b: 'Variant volume is the single largest cost line in a paid social engagement, and it scales with spend rather than with account count. An account burning through fifteen concepts a month costs more to feed than one running four.',
  },
  {
    t: 'How many platforms are in scope',
    b: 'Meta and Google are separate disciplines with separate specialists. Running both is not twice the work, but it is not the same as running one.',
  },
  {
    t: 'The state of your measurement',
    b: 'If conversion definitions and signal integrity need rebuilding before spend decisions can be trusted, that is real work and it happens first. If they are already sound, it does not.',
  },
  {
    t: 'Whether production is in scope',
    b: 'We can run media against creative you already have. It works less well, and we will say so — but the engagement is smaller.',
  },
];

const COMMITMENTS = [
  'A stated minimum engagement, agreed before week one rather than quoted per enquiry.',
  'The disciplines assigned to your account, named, with what each one owns in writing.',
  'Notice terms agreed up front. You are never told the notice period at the point you want to leave.',
  'You own the ad accounts and the assets. They are created in your name and they stay with you.',
  'No media commission on spend. We are not paid more for spending more of your money.',
];

export function Pricing() {
  return (
    <>
      <Seo
        schemas={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Pricing', path: '/pricing' },
          ]),
        ]}
      />

      <Section tone="ink" aria-labelledby="pricing-heading">
        <Container>
          <Eyebrow className="text-onpunct-2">Pricing</Eyebrow>
          <Heading level={1} size="h1" id="pricing-heading" className="mt-3 text-onpunct">
            What an engagement costs, and what decides it.
          </Heading>
          <p className="mt-6 max-w-[54ch] text-lead text-onpunct-2 [line-height:var(--lh-body)]">
            A retainer, scoped to one cycle of the loop at a time. No commission on
            media spend, and no percentage of your budget.
          </p>
        </Container>
      </Section>

      {/* How it is structured. */}
      <Section tone="paper" aria-labelledby="structure-heading">
        <Container>
          <Heading level={2} size="h2" id="structure-heading">
            How an engagement is structured
          </Heading>
          <div className="mt-8 max-w-[62ch] space-y-6">
            <p className="text-body text-primary [line-height:var(--lh-body)]">
              A month is a cycle of the loop: read the account, make the creative the
              diagnosis called for, run it, and attribute what happened back to the
              decisions that caused it.{' '}
              <Link
                to="/process"
                className="text-accent-strong underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                The process page describes each stage
              </Link>
              .
            </p>
            <p className="text-body text-primary [line-height:var(--lh-body)]">
              You are billed a flat retainer for that cycle, with the disciplines assigned
              to it named in the scope. Media spend is paid by you, directly to the
              platforms — we never invoice it and we take no percentage of it.
            </p>
            <p className="text-body text-primary [line-height:var(--lh-body)]">
              That last point matters more than it sounds. An agency paid a percentage of
              spend has a structural reason to recommend spending more, and every
              conversation about scaling back is one it is paid to lose.
            </p>
          </div>
        </Container>
      </Section>

      {/* What drives the number. */}
      <Section tone="surface" aria-labelledby="drivers-heading">
        <Container>
          <Heading level={2} size="h2" id="drivers-heading">
            What drives the number
          </Heading>
          <ul className="mt-12 grid gap-8 md:grid-cols-2">
            {DRIVERS.map((d, i) => (
              <li key={d.t} className="border-t border-hairline pt-6">
                <span className="font-mono text-label text-accent [letter-spacing:var(--tracking-label)]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 text-h4 text-primary [line-height:var(--lh-heading)]">
                  {d.t}
                </h3>
                <p className="mt-3 max-w-[52ch] text-body text-secondary [line-height:var(--lh-body)]">
                  {d.b}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* What we commit to. */}
      <Section tone="paper" aria-labelledby="commitments-heading">
        <Container>
          <Heading level={2} size="h2" id="commitments-heading">
            What we commit to, before you ask
          </Heading>
          <ul className="mt-12 max-w-[72ch] space-y-6">
            {COMMITMENTS.map((item) => (
              <li
                key={item}
                className="border-l-2 border-accent pl-6 text-body text-primary [line-height:var(--lh-body)]"
              >
                {item}
              </li>
            ))}
          </ul>

          <Rule className="mt-12" />

          {/*
            THE HONEST GAP. Stated as a position rather than hidden — a page
            that quietly omits price reads as evasive, and a page that explains
            why does not.
          */}
          <div className="mt-8 max-w-[62ch]">
            <h3 className="text-h4 text-primary [line-height:var(--lh-heading)]">
              Why there is no number on this page
            </h3>
            <p className="mt-3 text-body text-secondary [line-height:var(--lh-body)]">
              Because the honest one depends on the four things above, and a
              &ldquo;from&rdquo; figure that nobody actually pays is worth less than
              nothing — you would discount it, and rightly. Ask for a teardown and the
              scope conversation that follows comes with a real number attached to a real
              piece of work.
            </p>
          </div>
        </Container>
      </Section>

      {/* What is inside the scope — derived from the taxonomy, so a service
          added to the site appears here without a second edit. */}
      <Section tone="surface" aria-labelledby="scope-heading">
        <Container>
          <Heading level={2} size="h2" id="scope-heading">
            What can sit inside a cycle
          </Heading>
          <div className="mt-12 grid gap-10 md:grid-cols-2">
            {PRACTICES.map((practice) => (
              <div key={practice.id}>
                <h3 className="font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-secondary">
                  {practice.name}
                </h3>
                <p className="mt-3 max-w-[46ch] text-body text-secondary [line-height:var(--lh-body)]">
                  {practice.summary}
                </p>
                <ul className="mt-6 space-y-2">
                  {servicesInPractice(practice.id).map((service) => (
                    <li key={service.slug}>
                      <Link
                        to={`/services/${service.slug}`}
                        className="inline-flex items-center text-body text-accent-strong [min-height:var(--touch-min)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                      >
                        {service.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <CtaSection
        headline="Get the analysis before the quote."
        body="A specialist reads your ads, your creative and the page they land on, and writes down what they would change. The scope conversation is easier when there is something specific to scope."
      />
    </>
  );
}
