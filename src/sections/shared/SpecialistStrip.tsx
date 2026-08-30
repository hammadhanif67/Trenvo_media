import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { Container, Icon, Section } from '../../components/ui';
import type { SectionTone } from '../../components/ui';
import { BOUNDARY_LINE } from '../../data/disciplines';

/**
 * SPECIALIST STRIP — master.md §28.2 (`sections/shared/SpecialistStrip`).
 *
 * §14 puts a specialists strip on /services, and §21.4 requires every service
 * page to link to /specialists with a descriptive anchor. This is that link,
 * carrying the boundary line so it says something rather than just pointing.
 */
export interface SpecialistStripProps {
  /**
   * Caller-controlled so the page's surface alternation holds. Two identical
   * adjacent tones read as one block and lose the visible structure §22.2
   * principle 4 asks for.
   */
  tone?: SectionTone;
}

export function SpecialistStrip({ tone = 'paper' }: SpecialistStripProps) {
  const dark = tone === 'ink';
  return (
    <Section tone={tone} padding="default">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <p
            className={`max-w-[62ch] text-body [line-height:var(--lh-body)] ${dark ? 'text-onpunct' : 'text-primary'}`}
          >
            {BOUNDARY_LINE}
          </p>
          <Link
            to="/specialists"
            className={`inline-flex shrink-0 items-center gap-2 text-body [min-height:var(--touch-min)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 ${dark ? 'text-blue-500 focus-visible:outline-blue-500' : 'text-accent-strong focus-visible:outline-accent'}`}
          >
            The specialists who do the work
            <Icon icon={ArrowRight} />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
