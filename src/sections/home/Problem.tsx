import { Container, Eyebrow, Heading, Section } from '../../components/ui';
import { PROBLEM } from '../../data/home';
import { Reveal } from '../../components/motion/Reveal';

/**
 * 02 THE PROBLEM — wireframe.md §02, master.md §13 §2. Light (--paper).
 *
 * wireframe.md §02: "Visible gaps between the three blocks — THE GAP IS THE
 * DESIGN. Hairline --line borders, no fill." That is why the grid uses a large
 * gap and each block is bordered rather than filled.
 *
 * §13 §2: "CTA: none — this section must not sell."
 */
export function Problem() {
  return (
    <Section tone="paper" aria-labelledby="problem-heading">
      <Container>
        <Reveal>
          <Eyebrow className="text-secondary">{PROBLEM.eyebrow}</Eyebrow>
          <Heading level={2} size="h2" id="problem-heading" className="mt-3 max-w-[24ch]">
            {PROBLEM.headline}
          </Heading>

          {/* The gap is the design — preserved vertically on mobile. */}
          <div className="mt-16 grid gap-8 md:grid-cols-3 md:gap-12">
            {PROBLEM.voices.map((voice) => (
              <div key={voice.source} className="border border-hairline p-8">
                <p className="font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-secondary">
                  {voice.source}
                </p>
                <blockquote className="mt-6">
                  <p className="text-h4 text-primary [line-height:var(--lh-heading)]">
                    &ldquo;{voice.quote}&rdquo;
                  </p>
                </blockquote>
              </div>
            ))}
          </div>

          <p className="mt-12 text-h3 font-semibold text-primary [letter-spacing:var(--tracking-heading)] [line-height:var(--lh-heading)]">
            {PROBLEM.closing}
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
