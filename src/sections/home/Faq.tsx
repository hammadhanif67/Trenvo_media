import { Accordion } from '../../components/ui/Accordion';
import { Container, Eyebrow, Heading, Section } from '../../components/ui';
import { QUESTIONS } from '../../data/home';
import { Reveal } from '../../components/motion/Reveal';

/**
 * 11 QUESTIONS — wireframe.md §11. Light (--paper).
 *
 * §13 §11: "kill the objections that stop an international enquiry."
 * Single-open accordion, real buttons, keyboard operable (§26.2, §30.2).
 *
 * FAQPage JSON-LD is specified by §21.5 and wireframe.md §11. It is emitted at
 * the SEO milestone (M11) from this same data, so the questions on the page and
 * the questions in the schema cannot drift — §21.5 allows the schema "only for
 * questions genuinely on the page".
 */
export function Faq() {
  return (
    <Section tone="paper" aria-labelledby="questions-heading">
      <Container width="narrow" className="!px-0">
        <Reveal>
          <div className="[padding-inline:var(--gutter)]">
            <Eyebrow className="text-secondary">{QUESTIONS.eyebrow}</Eyebrow>
            <Heading level={2} size="h2" id="questions-heading" className="mt-3">
              {QUESTIONS.headline}
            </Heading>

            <Accordion className="mt-12" items={QUESTIONS.items} headingLevel={3} />
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
