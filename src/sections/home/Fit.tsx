import { Container, Eyebrow, Heading, Section } from '../../components/ui';
import { FIT } from '../../data/home';
import { Reveal } from '../../components/motion/Reveal';

/**
 * 10 FIT — wireframe.md §10, master.md §8.4. Light (--surface).
 *
 * §34.1(8): "Publish what you refuse ... Publishing refusals costs revenue,
 * which is precisely why it is believed."
 *
 * wireframe.md §10: "The final 'do not' row is the most commercially aggressive
 * and most convincing statement on the site. Refusing the unbundled version of
 * your own service proves you believe the bundle is the product."
 *
 * "Blue left rule on the positive column, --line on the negative." No CTA —
 * this is a qualification section.
 */
export function Fit() {
  return (
    <Section tone="surface" aria-labelledby="fit-heading">
      <Container>
        <Reveal>
          <Eyebrow className="text-secondary">{FIT.eyebrow}</Eyebrow>
          <Heading level={2} size="h2" id="fit-heading" className="mt-3 max-w-[30ch]">
            {FIT.headline}
          </Heading>

          <div className="mt-16 grid gap-10 md:grid-cols-2 md:gap-12">
            {/* Blue left rule — the column you want to be in. */}
            <div className="border-l-2 border-accent pl-8">
              <h3 className="font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-primary">
                {FIT.positiveTitle}
              </h3>
              <ul className="mt-6 space-y-5">
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

            <div className="border-l border-hairline pl-8">
              <h3 className="font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-secondary">
                {FIT.negativeTitle}
              </h3>
              <ul className="mt-6 space-y-5">
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
        </Reveal>
      </Container>
    </Section>
  );
}
