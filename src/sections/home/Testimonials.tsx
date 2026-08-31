import { Quote } from 'lucide-react';
import { Container, Eyebrow, Heading, Section } from '../../components/ui';
import { Reveal } from '../../components/motion/Reveal';
import { TESTIMONIALS } from '../../data/testimonials';

/**
 * TESTIMONIALS
 *
 * ⚠ THE REFERENCE SHOWS THREE FIVE-STAR REVIEWS from "Sarah J., CMO",
 * "Mark T., CEO" and "Ali R., Founder", one of them claiming leads scaled 203%
 * in 90 days. None of those people exist and none of that happened. They are
 * not built, and the brief is explicit about it too: do not fabricate client
 * names, companies, ratings, reviews or results.
 *
 * `TESTIMONIALS` is empty, so this renders the section's shell with a plain
 * statement of why it is empty. The moment a real, attributed, permitted quote
 * exists, adding it to the data file fills the grid and this note disappears.
 *
 * A star rating is deliberately NOT part of the component. Stars are an
 * aggregate-rating signal; rendering them without a real review platform behind
 * them is exactly the misleading structured data the brief rules out.
 */
export function Testimonials() {
  const hasTestimonials = TESTIMONIALS.length > 0;

  return (
    <Section tone="paper" aria-labelledby="testimonials-heading">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-[46rem] text-center">
            <Eyebrow className="text-accent">In their words</Eyebrow>
            <Heading
              level={2}
              size="h2"
              id="testimonials-heading"
              className="mt-4 text-primary [text-wrap:balance]"
            >
              What our clients say.
            </Heading>
          </div>

          {hasTestimonials ? (
            <ul className="mt-14 grid gap-6 md:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <li
                  key={t.id}
                  className="card-surface flex h-full flex-col border border-hairline bg-base p-6"
                >
                  <span className="icon-tile">
                    <Quote aria-hidden="true" className="size-5" />
                  </span>
                  <blockquote className="mt-5 flex-1 text-body text-primary [line-height:var(--lh-body)]">
                    {t.quote}
                  </blockquote>
                  <footer className="mt-6 border-t border-hairline pt-4">
                    <p className="text-small font-medium text-primary">{t.name}</p>
                    <p className="mt-1 text-small text-secondary">{t.role}</p>
                  </footer>
                </li>
              ))}
            </ul>
          ) : (
            <div className="card-surface mx-auto mt-12 max-w-[54ch] border border-hairline bg-base p-6 text-center">
              <Quote aria-hidden="true" className="mx-auto size-6 text-accent" />
              <p className="mt-5 text-body text-primary [line-height:var(--lh-body)]">
                We have not published a client quote yet.
              </p>
              <p className="mt-3 text-small text-secondary [line-height:var(--lh-body)]">
                When we do, it will carry a real name, a real company and that
                client&rsquo;s permission. Anything else is just copy we wrote about
                ourselves.
              </p>
            </div>
          )}
        </Reveal>
      </Container>
    </Section>
  );
}
