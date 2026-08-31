import { useRef } from 'react';
import { ArrowRight, Search, Hammer, TrendingUp, FileBarChart } from 'lucide-react';
import { Container, Eyebrow, Heading, Icon, Section } from '../../components/ui';
import { LOOP } from '../../data/home';
import { useLoopStageScrub } from '../../hooks/useLoopStageScrub';
import { WebGLField } from '../../components/motion/WebGLField';
import { HoverCard } from '../../components/ui/HoverCard';

/**
 * 03 THE PROCESS — wireframe.md §03, master.md §6.3, §13 §3. Dark (--ink).
 *
 * Built to the supplied reference: a 2x2 grid of large cards, each with a solid
 * blue icon tile, its number in an outlined circle, and its disciplines as
 * bordered chips. An arrow sits between the columns, and a dashed path returns
 * from the last card round to the first, labelled where it crosses the bottom.
 *
 * THE RETURN PATH IS THE POINT. Four cards in a row read as a checklist; the
 * path is what makes the section legible as a loop, which is its whole claim.
 * It is drawn with dashed borders on a positioned box rather than as an SVG, so
 * it reflows with the grid instead of needing coordinates that would go stale.
 *
 * Everything decorative — the arrows, the path, the label — is aria-hidden. The
 * <ol> carries the sequence for assistive technology, and the section reads
 * correctly with no CSS at all.
 *
 * §27.2 #2's scroll-scrub still drives the stages; see useLoopStageScrub for
 * why it is scrubbed but not pinned.
 */

const ICONS = [Search, Hammer, TrendingUp, FileBarChart] as const;

export function LoopSection() {
  const ref = useRef<HTMLElement>(null);
  useLoopStageScrub(ref);

  return (
    <Section
      ref={ref}
      tone="ink"
      aria-labelledby="loop-heading"
      className="relative overflow-hidden"
    >
      {/*
        The one 3D moment on the site (§31.7). Behind the cards, never inside
        them — see WebGLField for the five conditions it satisfies.
      */}
      <WebGLField className="absolute inset-0 opacity-70" />

      {/* The soft blue bloom the reference carries in the lower left. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-32 size-[36rem] opacity-40 blur-[100px]"
        style={{
          background:
            'radial-gradient(circle at center, var(--blue-600), transparent 70%)',
        }}
      />

      <Container className="relative">
        <div className="grid gap-14 lg:grid-cols-[20rem_1fr] lg:gap-20">
          {/* -------- LEFT: the claim -------- */}
          <div>
            <Eyebrow className="text-blue-500">{LOOP.eyebrow}</Eyebrow>

            <Heading level={2} size="h2" id="loop-heading" className="mt-5 text-onpunct">
              One loop.
              <br />
              Four stages.
              <br />
              <span className="text-blue-500">Run continuously.</span>
            </Heading>

            <p className="mt-6 max-w-[34ch] text-body text-onpunct-2 [line-height:var(--lh-body)]">
              Each stage hands the next one something specific. The last stage briefs the
              first, which is what makes it a loop rather than a checklist.
            </p>

            <a
              href={LOOP.cta.href}
              className="mt-8 inline-flex items-center gap-2 text-body text-blue-500 [min-height:var(--touch-min)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            >
              {LOOP.cta.label}
              <Icon icon={ArrowRight} />
            </a>
          </div>

          {/* -------- RIGHT: the four stages, and the loop back -------- */}
          <div className="relative pb-16">
            <ol className="relative grid gap-6 sm:grid-cols-2">
              {LOOP.stages.map((stage, i) => {
                const StageIcon = ICONS[i] ?? Search;
                return (
                  <li key={stage.id} data-loop-stage className="relative">
                    <HoverCard
                      as="div"
                      className="card-surface flex h-full flex-col border border-line-dark bg-punct p-7"
                    >
                      {/* Solid blue tile, as the reference sets it. */}
                      <span className="inline-flex size-12 items-center justify-center rounded-[var(--radius-tile)] bg-blue-600 text-paper">
                        <StageIcon aria-hidden="true" className="size-6" />
                      </span>

                      <h3 className="mt-6 flex items-center gap-3 text-h3 text-onpunct transition-colors [line-height:var(--lh-heading)] group-hover:text-ink">
                        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-blue-500/60 font-mono text-label text-blue-500 transition-colors group-hover:border-ink/30 group-hover:text-ink">
                          {stage.index}
                        </span>
                        {stage.name}
                      </h3>

                      <p className="mt-4 flex-1 text-body text-onpunct-2 transition-colors [line-height:var(--lh-body)] group-hover:text-ink">
                        {stage.definition}
                      </p>

                      {stage.disciplines.length > 0 && (
                        <ul className="mt-6 flex flex-wrap gap-2 border-t border-line-dark pt-5 transition-colors group-hover:border-ink/15">
                          {stage.disciplines.map((d) => (
                            <li
                              key={d}
                              className="rounded-[8px] border border-line-dark px-3 py-2 font-mono text-label uppercase leading-none tracking-[var(--tracking-label)] text-onpunct-2 transition-colors group-hover:border-ink/25 group-hover:text-ink"
                            >
                              {d}
                            </li>
                          ))}
                        </ul>
                      )}
                    </HoverCard>

                    {/* Arrow between the two columns. Decorative. */}
                    {i % 2 === 0 && (
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute top-1/2 -right-3 z-10 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full border border-blue-500/50 bg-punct text-blue-500 sm:flex"
                      >
                        <ArrowRight className="size-4" />
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>

            {/*
              The return path: down the right, along the bottom and back up the
              left. Dashed borders on a positioned box, so it reflows with the
              grid rather than needing coordinates that would go stale.
            */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-[12%] top-[46%] bottom-0 rounded-b-[20px] border-r border-b border-l border-dashed border-blue-500/40"
            />

            {/* The label, sitting on the bottom of that path. */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 flex translate-y-1/2 justify-center"
            >
              <span className="card-surface border border-blue-500/40 bg-punct px-5 py-2 font-mono text-label uppercase tracking-[var(--tracking-label)] text-blue-500">
                Data fuels the next loop
              </span>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
