import { useRef } from 'react';
import { ArrowRight, Search, Hammer, TrendingUp, FileBarChart } from 'lucide-react';
import { Container, Eyebrow, Heading, Icon, Section } from '../../components/ui';
import { LOOP } from '../../data/home';
import { useLoopStageScrub } from '../../hooks/useLoopStageScrub';

/**
 * 03 THE PROCESS — wireframe.md §03, master.md §6.3, §13 §3. Dark (--ink).
 *
 * Rebuilt to the reference: the four stages as a connected row of cards with a
 * return line beneath, so the loop is legible as a loop rather than as a list
 * of four paragraphs.
 *
 * §27.2 #2's scroll-scrub still drives the stages — see useLoopStageScrub for
 * why it is scrubbed but not pinned.
 *
 * The arrows and the return line are decorative and aria-hidden; the ordered
 * list underneath them is what carries the sequence for assistive technology,
 * which is why the markup is an <ol> and not a grid of divs.
 */

const ICONS = [Search, Hammer, TrendingUp, FileBarChart] as const;

export function LoopSection() {
  const ref = useRef<HTMLElement>(null);
  useLoopStageScrub(ref);

  return (
    <Section ref={ref} tone="ink" aria-labelledby="loop-heading">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[22rem_1fr] lg:gap-16">
          {/* -------- LEFT: the claim -------- */}
          <div>
            <Eyebrow className="text-blue-500">{LOOP.eyebrow}</Eyebrow>

            <Heading
              level={2}
              size="h2"
              id="loop-heading"
              className="mt-4 text-onpunct [text-wrap:balance]"
            >
              One loop. Four stages.{' '}
              <span className="text-blue-500">Run continuously.</span>
            </Heading>

            <p className="mt-5 max-w-[38ch] text-body text-onpunct-2 [line-height:var(--lh-body)]">
              Each stage hands the next one something specific. The last stage
              briefs the first, which is what makes it a loop rather than a
              checklist.
            </p>

            <a
              href={LOOP.cta.href}
              className="mt-8 inline-flex items-center gap-2 text-body text-blue-500 [min-height:var(--touch-min)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            >
              {LOOP.cta.label}
              <Icon icon={ArrowRight} />
            </a>
          </div>

          {/* -------- RIGHT: the four stages -------- */}
          <div>
            <ol className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {LOOP.stages.map((stage, i) => {
                const StageIcon = ICONS[i] ?? Search;
                return (
                  <li key={stage.id} data-loop-stage className="relative">
                    <div className="flex h-full flex-col border border-line-dark [padding:var(--card-pad)]">
                      <StageIcon aria-hidden="true" className="size-5 shrink-0 text-blue-500" />

                      <p className="mt-5 font-mono text-label uppercase tracking-[var(--tracking-label)] text-blue-500">
                        {stage.index}
                      </p>

                      <h3 className="mt-2 text-h4 text-onpunct [line-height:var(--lh-heading)]">
                        {stage.name}
                      </h3>

                      <p className="mt-3 flex-1 text-small text-onpunct-2 [line-height:var(--lh-body)]">
                        {stage.definition}
                      </p>

                      {stage.disciplines.length > 0 && (
                        <ul className="mt-5 flex flex-wrap gap-x-3 gap-y-2 border-t border-line-dark pt-4">
                          {stage.disciplines.map((d) => (
                            <li
                              key={d}
                              className="font-mono text-label uppercase tracking-[var(--tracking-label)] text-onpunct-2"
                            >
                              {d}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Decorative connector; the <ol> already carries the order. */}
                    {i < LOOP.stages.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute top-1/2 -right-4 hidden w-4 items-center justify-center text-blue-500 xl:flex"
                      >
                        <ArrowRight className="size-4" />
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>

            {/* The return path — what makes the row read as a loop. */}
            <div aria-hidden="true" className="mt-6 flex items-center gap-4">
              <span className="h-px flex-1 bg-line-dark" />
              <span className="font-mono text-label uppercase tracking-[var(--tracking-label)] text-onpunct-2">
                Data fuels the next loop
              </span>
              <span className="h-px flex-1 bg-line-dark" />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
