import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { Container, Eyebrow, Heading, Icon, Section } from '../../components/ui';
import { HOW_IT_STARTS } from '../../data/home';
import { Reveal } from '../../components/motion/Reveal';

/**
 * 06 HOW A PROJECT STARTS — wireframe.md §06. Light (--surface).
 *
 * §13 §6: removes the largest objection to a new supplier — "what actually
 * happens if I say yes?" wireframe.md §06: "Each step states what Trenvo needs,
 * what Trenvo does, and by when — specificity is the trust mechanism."
 *
 * wireframe.md §06: "Monospace step numerals; horizontal connector rule on
 * desktop, vertical on mobile."
 */
export function HowItStarts() {
  return (
    <Section tone="surface" aria-labelledby="start-heading">
      <Container>
        <Reveal>
          <Eyebrow className="text-secondary">{HOW_IT_STARTS.eyebrow}</Eyebrow>
          <Heading level={2} size="h2" id="start-heading" className="mt-3 max-w-[26ch]">
            {HOW_IT_STARTS.headline}
          </Heading>

          <ol className="mt-16 grid gap-10 md:grid-cols-4 md:gap-6">
            {HOW_IT_STARTS.steps.map((step) => (
              <li key={step.index} className="relative">
                {/* The connector rule: horizontal on desktop, vertical on mobile. */}
                <div className="border-t border-hairline pt-5 md:pt-6">
                  <span className="font-mono text-label text-accent [letter-spacing:var(--tracking-label)]">
                    {step.index}
                  </span>
                  <p className="mt-4 text-h4 text-primary [line-height:var(--lh-heading)]">
                    {step.body}
                  </p>
                  <p className="mt-4 font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-secondary">
                    {step.label}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-12 text-small text-secondary">
            {HOW_IT_STARTS.timeBoundaryNote}
          </p>

          <Link
            to={HOW_IT_STARTS.cta.href}
            className="mt-8 inline-flex items-center gap-2 text-body text-accent-strong [min-height:var(--touch-min)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {HOW_IT_STARTS.cta.label}
            <Icon icon={ArrowRight} />
          </Link>
        </Reveal>
      </Container>
    </Section>
  );
}
