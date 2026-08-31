import { useRef } from 'react';
import { ArrowRight, Search, Hammer, TrendingUp, FileBarChart } from 'lucide-react';
import { Container, Eyebrow, Heading, Icon, Section } from '../../components/ui';
import { LOOP } from '../../data/home';
import { useLoopStageScrub } from '../../hooks/useLoopStageScrub';
import { WebGLField } from '../../components/motion/WebGLField';
import { HoverCard } from '../../components/ui/HoverCard';

/**
 * 03 HOW WE WORK — wireframe.md §03, master.md §6.3, §13 §3. Dark (--ink).
 *
 * Rebuilt after the previous version was reported broken. What was wrong, and
 * what replaced it:
 *
 *  · CARDS WERE UNEQUAL. Their heights came from their content, so Make and
 *    Learn — which carry four discipline chips — grew taller than Read and Run.
 *    `auto-rows-fr` plus `h-full` makes every row an equal track, so all four
 *    cards are the same width AND the same height by construction rather than
 *    by luck.
 *
 *  · THE DASHED RETURN PATH IS GONE. It was absolutely positioned across the
 *    grid, which is what pushed Run and Learn under the section edge and made
 *    the layout read as clipped. The loop is stated by the copy and the arrows
 *    now, not drawn over the content.
 *
 *  · NO RADIUS, and no icon tile. The icon sits inline to the left of the
 *    stage title; the filled block above it was pure decoration costing ~64px
 *    of card height, which is what made the cards read as bulky.
 *
 *  · HOVER NO LONGER FLIPS THE SURFACE. Turning one card white while its
 *    neighbours stayed dark broke the grid's read and fought the theme. Hover is
 *    a border, a soft glow and a 2px lift; the card keeps its surface, its text
 *    colour and the active theme.
 *
 * LAYOUT IS GRID, DECORATION IS ABSOLUTE. Both the two-column split and the 2x2
 * card grid are CSS Grid. The only absolutely positioned things left are the
 * arrows and the background wash.
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
      {/* The one 3D moment on the site (§31.7) — behind the grid, never in it. */}
      <WebGLField className="absolute inset-0 opacity-60" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-40 size-[34rem] opacity-35 blur-[110px]"
        style={{
          background:
            'radial-gradient(circle at center, var(--blue-600), transparent 70%)',
        }}
      />

      <Container className="relative">
        {/* 31% / 69%, as specified. */}
        <div className="grid gap-14 lg:grid-cols-[31fr_69fr] lg:items-start lg:gap-16">
          {/* -------- LEFT -------- */}
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

          {/*
            2 x 2 from sm up, one column on mobile. `auto-rows-fr` is what
            guarantees equal heights: each row becomes a track of the same size,
            so a card carrying four chips cannot outgrow one carrying two.
          */}
          <ol className="grid auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6">
            {LOOP.stages.map((stage, i) => {
              const StageIcon = ICONS[i] ?? Search;
              return (
                <li key={stage.id} data-loop-stage className="relative">
                  <HoverCard
                    as="div"
                    className="flex h-full flex-col border border-line-dark bg-punct p-6 [transition:border-color_220ms,box-shadow_220ms,transform_220ms] hover:-translate-y-0.5 hover:border-blue-500/70 hover:shadow-[0_0_0_1px_rgba(77,141,255,0.18),0_14px_40px_-24px_rgba(77,141,255,0.55)]"
                  >
                    {/*
                      Icon inline, on the left of the title, with no block
                      behind it. The filled tile above the heading was costing
                      roughly 64px of card height for decoration and pushing the
                      real content down — which is what made the cards bulky.
                    */}
                    <h3 className="flex items-center gap-3 text-h4 text-onpunct [line-height:var(--lh-heading)]">
                      <StageIcon
                        aria-hidden="true"
                        className="size-5 shrink-0 text-blue-500"
                      />
                      <span>
                        <span className="font-mono text-blue-500">{stage.index}.</span>{' '}
                        {stage.name}
                      </span>
                    </h3>

                    <p className="mt-4 flex-1 text-small text-onpunct-2 [line-height:var(--lh-body)]">
                      {stage.definition}
                    </p>

                    {stage.disciplines.length > 0 && (
                      <ul className="mt-5 flex flex-wrap gap-2 border-t border-line-dark pt-4">
                        {stage.disciplines.map((d) => (
                          <li
                            key={d}
                            className="border border-line-dark px-2 py-2 font-mono text-label uppercase leading-none tracking-[var(--tracking-label)] text-onpunct-2"
                          >
                            {d}
                          </li>
                        ))}
                      </ul>
                    )}
                  </HoverCard>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
