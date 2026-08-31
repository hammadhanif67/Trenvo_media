import {
  ArrowRight,
  BarChart3,
  Database,
  FlaskConical,
  Sparkles,
  Target,
  UsersRound,
} from 'lucide-react';
import { Link } from 'react-router';
import { Container, Eyebrow, Heading, Icon, Section } from '../../components/ui';
import { Reveal } from '../../components/motion/Reveal';
import { PRINCIPLES, SPECIALISTS_SECTION } from '../../data/home';

/**
 * 05 HOW WE WORK — wireframe.md §05, master.md §13 §5
 *
 * Rebuilt to the reference's principles grid. Six items, because there are six
 * disciplines — the headline is a statement of fact, not a round number chosen
 * to look tidy.
 *
 * ⚠ The reference places a row of partner badges under this grid — Google
 * Partner, Meta Business Partner, TikTok Marketing Partner, LinkedIn, YouTube
 * Certified. None of those is built. Trenvo holds no such partnership or
 * certification, §2.8 forbids inventing one, and a fabricated badge is the
 * single most damaging thing that could go on this page. Recorded in
 * implementation.md §5.30.
 */

const ICONS = [Target, Database, Sparkles, FlaskConical, BarChart3, UsersRound] as const;

export function Specialists() {
  return (
    <Section tone="surface" aria-labelledby="specialists-heading">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-[46rem] text-center">
            <Eyebrow className="text-accent">Why it works</Eyebrow>

            <Heading
              level={2}
              size="h2"
              id="specialists-heading"
              className="mt-4 text-primary [text-wrap:balance]"
            >
              Six disciplines. One outcome:{' '}
              <span className="text-accent">growth.</span>
            </Heading>

            <p className="mx-auto mt-5 max-w-[54ch] text-body text-secondary [line-height:var(--lh-body)]">
              {SPECIALISTS_SECTION.headline}
            </p>
          </div>

          <ul className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map((principle, i) => {
              const PrincipleIcon = ICONS[i] ?? Target;
              return (
                <li key={principle.id}>
                  <PrincipleIcon
                    aria-hidden="true"
                    className="size-6 shrink-0 text-accent"
                  />
                  <h3 className="mt-4 text-h4 text-primary [line-height:var(--lh-heading)]">
                    {principle.title}
                  </h3>
                  <p className="mt-2 text-small text-secondary [line-height:var(--lh-body)]">
                    {principle.body}
                  </p>
                </li>
              );
            })}
          </ul>

          <div className="mt-12 text-center">
            <Link
              to={SPECIALISTS_SECTION.cta.href}
              className="inline-flex items-center gap-2 text-body font-medium text-accent-strong [min-height:var(--touch-min)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {SPECIALISTS_SECTION.cta.label}
              <Icon icon={ArrowRight} />
            </Link>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
