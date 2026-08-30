import { Button, Container, Heading, Section } from '../../components/ui';
import { CLOSE } from '../../data/home';
import { PRIMARY_CTA, SECONDARY_CTA } from '../../data/navigation';
import { Reveal } from '../../components/motion/Reveal';

/**
 * 12 CLOSE — wireframe.md §12, master.md §13 §12. Dark (--ink).
 *
 * The fourth and last dark section (implementation.md §1.1): the hero states
 * the argument, the loop teaches it, the teardowns prove it, the close asks for
 * the decision.
 *
 * §24.3: "Alignment: Left, always. No centred paragraphs; CENTRED HEADLINES
 * ONLY IN THE CLOSE SECTION." This is that one exception, and it is why Heading
 * exposes className rather than hard-coding alignment.
 *
 * §17.3 — the second of only two viewports allowed to pair both conversion CTAs.
 */
export function Close() {
  return (
    <Section tone="ink" aria-labelledby="close-heading">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-[46ch] text-center">
            <Heading
              level={2}
              size="h2"
              id="close-heading"
              className="!text-center text-onpunct"
            >
              {CLOSE.headline}
            </Heading>

            <p className="mt-6 text-lead text-onpunct-2 [line-height:var(--lh-body)]">
              {CLOSE.body}
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Button href={PRIMARY_CTA.href} variant="primary">
                {PRIMARY_CTA.label}
              </Button>
              <Button href={SECONDARY_CTA.href} variant="secondary">
                {SECONDARY_CTA.label}
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
