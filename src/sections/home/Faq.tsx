import { Accordion } from '../../components/ui/Accordion';
import { Container, Eyebrow, Heading, Section } from '../../components/ui';
import { Reveal } from '../../components/motion/Reveal';
import { QUESTIONS } from '../../data/home';

/**
 * 11 QUESTIONS — wireframe.md §11, master.md §14
 *
 * Rebuilt to the reference's two-column layout: the claim on the left, the
 * accordion on the right.
 *
 * The answers are real answers to questions a buyer actually asks before a
 * first call — contract length, account ownership, time zones. That is what
 * makes this section worth indexing, and it is the section the FAQPage schema
 * in lib/schema.ts is built from, so the structured data and the visible text
 * are the same content rather than two versions of it.
 *
 * §30.2 — the accordion is a real disclosure widget: every panel is reachable
 * and operable from the keyboard, and the answers are in the HTML whether a
 * panel is open or not, so a crawler reads all of them.
 */
export function Faq() {
  return (
    <Section tone="surface" aria-labelledby="questions-heading">
      <Container>
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-[22rem_1fr] lg:gap-16">
            <div>
              <Eyebrow className="text-accent">{QUESTIONS.eyebrow}</Eyebrow>

              <Heading
                level={2}
                size="h2"
                id="questions-heading"
                className="mt-4 text-primary [text-wrap:balance]"
              >
                {QUESTIONS.headline}
              </Heading>

              <p className="mt-5 max-w-[36ch] text-body text-secondary [line-height:var(--lh-body)]">
                If something you need to know is not here, ask it on the call — we answer
                it the same way.
              </p>
            </div>

            <Accordion items={QUESTIONS.items} headingLevel={3} />
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
