import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { Container, Eyebrow, Heading, Icon, Section } from '../../components/ui';
import { BrandWordmark } from '../../components/media/BrandWordmark';
import { CLIENTS } from '../../data/clients';
import { TESTIMONIALS } from '../../data/testimonials';
import { TEARDOWNS } from '../../data/teardowns';
import { WORK } from '../../data/work';

/**
 * PROOF — the section that used to be "What our clients say".
 *
 * ⚠ WHAT WAS HERE BEFORE, AND WHY IT IS NOT.
 *
 * A six-card grid: five client brand names, each with a card reading "No quote
 * published yet", plus a sixth tile that was not a client at all because there
 * were only five names to fill a grid built for six.
 *
 * Every one of those cards was an empty proof slot dressed as proof. "No quote
 * published yet" does not read as candour to a stranger — it reads as a
 * testimonial section that could not find a testimonial, which is worse than
 * having no testimonial section. §20.3 is explicit: an empty proof slot is
 * REMOVED from the layout, not filled with a placeholder.
 *
 * WHAT REPLACED IT. Trenvo's proof today is not results, because there are no
 * measured ones to publish. It is checkable reasoning and checkable structure:
 * published analysis of real ads, published discipline boundaries, published
 * refusals, and an offer to do the same analysis on the reader's own account.
 * All four are true right now and all four are things a sceptic can verify —
 * which is more than a five-star card from a name they cannot find.
 *
 * SELF-FILLING, in the right order:
 *   · a real, attributed, permitted entry in data/testimonials.ts renders as a
 *     quote block above everything else
 *   · published teardowns and case studies replace the "how to check us" copy
 *     with actual links to them
 * Nothing here needs editing for either to happen.
 */

const WAYS_TO_CHECK = [
  {
    t: 'Read our analysis of somebody else’s ads',
    b: 'A teardown states what we observed, what we think is happening, what we would change and how we would measure it — against a real, public ad you can go and look at yourself.',
    href: '/teardowns',
    cta: 'Read the teardowns',
  },
  {
    t: 'Read what each discipline is not allowed to touch',
    b: 'Every discipline publishes its boundary. Any agency can list what it does; publishing what each specialist does NOT own is only possible if the boundaries actually exist.',
    href: '/about#specialists',
    cta: 'See the boundaries',
  },
  {
    t: 'Read what we turn down',
    b: 'SEO, content marketing, standalone brand identity, and media without the creative. Publishing refusals costs revenue, which is exactly why they are worth reading.',
    href: '/about',
    cta: 'What we refuse',
  },
  {
    t: 'Have it done to your own account',
    b: 'The same analysis, on your ads and your creative, written by the specialist who would do the work. Free, and nothing is asked of you first.',
    href: '/teardown',
    cta: 'Request a free teardown',
  },
];

export function Proof() {
  const hasQuotes = TESTIMONIALS.length > 0;
  const hasTeardowns = TEARDOWNS.length > 0;
  const hasWork = WORK.length > 0;

  return (
    <Section tone="paper" aria-labelledby="proof-heading">
      <Container>
        <header className="max-w-[46rem]">
          <Eyebrow className="text-accent">Proof</Eyebrow>
          <Heading
            level={2}
            size="h2"
            id="proof-heading"
            className="mt-4 text-primary [text-wrap:balance]"
          >
            Check us before you hire us<span className="text-accent">.</span>
          </Heading>
          <p className="mt-5 max-w-[62ch] text-body text-secondary [line-height:var(--lh-body)]">
            {hasWork
              ? 'Here is the work, and here is the reasoning behind it. Both are checkable.'
              : 'We are not going to show you a wall of five-star cards. Here are four things you can actually verify about how we work, today, before you talk to anyone.'}
          </p>
        </header>

        {/*
          REAL QUOTES ONLY. Renders when — and only when — data/testimonials.ts
          holds an entry with a real name, a real role and permission to
          publish. No stars: a star rating is an aggregate-rating signal that
          implies a review platform standing behind it, and there is none.
        */}
        {hasQuotes && (
          <ul className="mt-12 grid gap-6 md:grid-cols-2">
            {TESTIMONIALS.map((quote) => {
              const client = CLIENTS.find((c) => c.name === quote.brand);
              return (
                <li key={quote.id}>
                  <figure className="flex h-full flex-col border border-hairline bg-alt [padding:var(--card-pad)]">
                    <blockquote className="flex-1 text-lead text-primary [line-height:var(--lh-body)]">
                      {quote.quote}
                    </blockquote>
                    <figcaption className="mt-6 border-t border-hairline pt-4">
                      {client && (
                        <span className="mb-2 block">
                          <BrandWordmark brand={client} />
                        </span>
                      )}
                      <span className="block text-small font-medium text-primary">
                        {quote.name}
                      </span>
                      <span className="block text-small text-secondary">
                        {quote.role}
                      </span>
                    </figcaption>
                  </figure>
                </li>
              );
            })}
          </ul>
        )}

        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {WAYS_TO_CHECK.map((item, i) => {
            /*
              The teardown card only claims published teardowns exist when they
              do. While the library is empty it points at the offer instead —
              the one thing in this section that is deliverable today whatever
              else has been published.
            */
            const isTeardownLibrary = item.href === '/teardowns';
            if (isTeardownLibrary && !hasTeardowns) return null;

            return (
              <li key={item.href}>
                <article className="relative flex h-full flex-col border border-hairline [padding:var(--card-pad)] transition-colors hover:border-accent">
                  <span className="font-mono text-label text-accent [letter-spacing:var(--tracking-label)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-4 text-h4 text-primary [line-height:var(--lh-heading)]">
                    {item.t}
                  </h3>
                  <p className="mt-3 flex-1 text-body text-secondary [line-height:var(--lh-body)]">
                    {item.b}
                  </p>
                  <Link
                    to={item.href}
                    className="mt-6 inline-flex items-center gap-2 text-small font-medium text-accent-strong [min-height:var(--touch-min)] after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {item.cta}
                    <Icon icon={ArrowRight} />
                  </Link>
                </article>
              </li>
            );
          })}
        </ul>

        {/*
          THE HONEST NOTE. Saying out loud that there are no published results
          yet is a stronger position than quietly having none: a reader who
          notices the absence and is not told about it assumes the worst, and a
          reader who is told about it has just watched the site do the thing it
          claims to do.
        */}
        {!hasWork && (
          <p className="mt-12 max-w-[62ch] border-l-2 border-accent pl-6 text-body text-primary [line-height:var(--lh-body)]">
            We have no published case studies yet, and we are not going to invent
            some. When there are measured results to show, they will appear on{' '}
            <Link
              to="/work"
              className="text-accent-strong underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              the work page
            </Link>{' '}
            with the measurement method and the time window stated, or they will not
            appear at all.
          </p>
        )}
      </Container>
    </Section>
  );
}
