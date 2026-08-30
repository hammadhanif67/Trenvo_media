import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { Container, Eyebrow, Heading, Icon, Section } from '../../components/ui';
import { DisciplineLattice } from '../../components/cards/DisciplineLattice';
import { BOUNDARY_LINE, DISCIPLINES } from '../../data/disciplines';
import { SPECIALISTS } from '../../data/specialists';
import { SPECIALISTS_SECTION } from '../../data/home';
import { Reveal } from '../../components/motion/Reveal';

/**
 * 05 SPECIALISTS — wireframe.md §05, master.md §13 §5. Light (--paper).
 *
 * wireframe.md §05: "Monospace discipline labels in a structured lattice — NO
 * FACES, NO BIOS, NO HEADCOUNT." and "The boundary is the proof."
 *
 * Empty-state rule (§13 §5): "the grid shows disciplines, never empty
 * person-cards. Real people are added into the same component when they exist."
 * SPECIALISTS is empty by design (§10.2) and the lattice handles both states.
 */
export function Specialists() {
  return (
    <Section tone="paper" aria-labelledby="specialists-heading">
      <Container>
        <Reveal>
          <Eyebrow className="text-secondary">{SPECIALISTS_SECTION.eyebrow}</Eyebrow>
          <Heading
            level={2}
            size="h2"
            id="specialists-heading"
            className="mt-3 max-w-[30ch]"
          >
            {SPECIALISTS_SECTION.headline}
          </Heading>

          <p className="mt-6 text-body text-secondary">{SPECIALISTS_SECTION.hint}</p>

          <div className="mt-12">
            <DisciplineLattice disciplines={DISCIPLINES} people={SPECIALISTS} />
          </div>

          <p className="mt-12 max-w-[62ch] text-body text-primary [line-height:var(--lh-body)]">
            {BOUNDARY_LINE}
          </p>

          <Link
            to={SPECIALISTS_SECTION.cta.href}
            className="mt-8 inline-flex items-center gap-2 text-body text-accent-strong [min-height:var(--touch-min)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {SPECIALISTS_SECTION.cta.label}
            <Icon icon={ArrowRight} />
          </Link>
        </Reveal>
      </Container>
    </Section>
  );
}
