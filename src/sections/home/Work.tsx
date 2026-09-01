import { useRef } from 'react';
import { ArrowRight, BarChart3, Clapperboard, PenTool, Sparkles } from 'lucide-react';
import { Link } from 'react-router';
import { Button, Container, Eyebrow, Heading, Section } from '../../components/ui';
import { BrandIcon } from '../../components/media/BrandIcon';
import { CubeScene, type CubeHandle } from '../../components/motion/CubeScene';
import { useCubeScrollTimeline } from '../../hooks/useCubeScrollTimeline';
import { WORK_CATEGORIES } from '../../data/home';

/**
 * 09 CASE STUDIES — wireframe.md §09, master.md §19, §20.3
 *
 * ⚠ NO NUMBERS. `WORK` is empty: no case study has been supplied, so there is
 * no result to report, and inventing one is forbidden by §2.8 and by the
 * standing instruction on this project. §20.3 — "a missing section is
 * invisible; a fake one is fatal." The section states plainly why the rows
 * carry no figures, which is a stronger claim than a number nobody can check.
 *
 * The six rows are the CATEGORIES work would be published under. Compact
 * bordered rows rather than cards, square, and each links to /work — the page
 * carrying the same honest empty state.
 *
 * ONE VIEWPORT TALL, CONTENT CENTRED. The section is `min-h-svh` with the
 * composition centred inside it rather than sitting under 160px of section
 * padding. Two reasons: a pinned section that is taller than the viewport can
 * never sit flush — its bottom is cut off for the whole pin — and centring is
 * what closes the dead band that opened under the rows when the content rose.
 * That is why this is the one section that takes `padding="none"` and sets its
 * own rhythm (§26.1's stated exception). The pinned breakpoints take one step
 * LESS padding than §25.2's ink default for a measured reason: at 64px the
 * composition came to 827px, which does not fit an 800px viewport, and the pin
 * refuses to run when it cannot sit flush. 48px brings it to 795px, so
 * MacBook-class laptops keep the choreography.
 *
 * THE CUBE IS NOT IN THE LAYOUT. It is a WebGL object inside an absolutely
 * positioned, `pointer-events: none`, `aria-hidden` canvas behind the content.
 * It has no DOM box, so it cannot push or reflow anything, and the content's
 * scroll movement is a separate GSAP tween — see useCubeScrollTimeline for why
 * the two are deliberately on independent tracks.
 */

/**
 * The three platform rows use their real marks — lucide dropped its brand
 * icons, so they come from `brandMarks.ts` (nominative use, no partnership
 * implied). The other three are generic concepts, so a lucide glyph is right.
 */
const ROW_ICONS = [
  { kind: 'brand', name: 'Meta' },
  { kind: 'brand', name: 'GoogleAds' },
  { kind: 'lucide', Icon: BarChart3 },
  { kind: 'lucide', Icon: PenTool },
  { kind: 'lucide', Icon: Sparkles },
  { kind: 'lucide', Icon: Clapperboard },
] as const;

export function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<CubeHandle>(null);

  useCubeScrollTimeline(sectionRef, contentRef, cubeRef);

  return (
    <Section
      ref={sectionRef}
      tone="ink"
      padding="none"
      aria-labelledby="work-heading"
      className="relative flex min-h-svh items-center overflow-hidden [padding-block:var(--section-pad-ink)] lg:[padding-block:var(--s-12)]"
    >
      {/* z-0 — behind everything, and it never takes a pointer event. */}
      <CubeScene ref={cubeRef} className="absolute inset-0 z-0" />

      {/*
        THE SCRIM, z-1: an ink veil between the cube and the copy.

        The cube finishes its travel in the middle of the frame, which is where
        the text is, and additive blending stacks — measured without this layer
        the copy sat at 1.23:1. The veil is what buys the section its contrast
        back: 5.24:1 for body text and 13.4:1 for headings, measured by
        compositing the whole rendered scene under the real text rectangles across
        eight cube rotations. See CUBE_INTENSITY in CubeScene.

        `bg-punct` rather than a literal, because it has to be whatever colour
        the section already is, and `pointer-events: none` so it stays invisible
        to the mouse.
      */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] bg-punct/70" />

      <Container className="relative z-10 w-full">
        <div ref={contentRef}>
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <Eyebrow className="text-blue-500">Case studies</Eyebrow>

              <Heading
                level={2}
                size="h2"
                id="work-heading"
                className="mt-4 max-w-[20ch] text-onpunct"
              >
                Work we can show, when there is work to{' '}
                <span className="text-blue-500">show.</span>
              </Heading>

              <p className="mt-6 max-w-[62ch] text-body text-onpunct-2 [line-height:var(--lh-body)]">
                We publish a project once the client has approved it and the numbers can
                be traced to a source outside the ad platform. Until then these stay empty
                rather than carrying a figure nobody can check.
              </p>
            </div>

            <div className="shrink-0">
              <Button href="/work" surface="dark" variant="secondary">
                View all case studies
              </Button>
            </div>
          </div>

          {/*
            Compact bordered rows, not cards. Square corners, and the hover — a
            flip to white — lives in `.work-row` in globals.css so it belongs to
            THIS section only and cannot leak into the discipline cards, whose
            hover is a different design.

            EVERY ROW IS THE SAME HEIGHT, and it takes two things. `li` is a
            flex box and the link fills it — a grid item stretches, but the link
            INSIDE it did not, which is why one row measured 101px against its
            neighbour's 125px. And `grid-auto-rows: 1fr` levels the rows to each
            other, so a two-line body does not make its row taller than the rest
            at any width, single-column included.
          */}
          <ul className="mt-12 grid gap-4 [grid-auto-rows:1fr] md:grid-cols-2">
            {WORK_CATEGORIES.map((item, i) => {
              const icon = ROW_ICONS[i];
              const number = String(i + 1).padStart(2, '0');
              return (
                <li key={item.id} className="flex">
                  {/*
                    EVERY ROW LINKS TO ITS OWN SERVICE PAGE, not all six to
                    /work. They used to point at /work regardless, so six
                    distinct rows were six copies of one link — and three of the
                    rows named things with no page behind them at all. Each row
                    now carries a `serviceSlug` that must exist in
                    data/services.ts, checked by scripts/validate-routes.mjs.
                  */}
                  <Link
                    to={`/services/${item.serviceSlug}`}
                    className="work-row group relative flex w-full items-start gap-4 lg:items-center border border-line-dark p-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                  >
                    <span className="work-row__icon inline-flex size-12 shrink-0 items-center justify-center border border-line-dark text-blue-500">
                      {icon?.kind === 'brand' ? (
                        <BrandIcon name={icon.name} className="size-5" />
                      ) : icon ? (
                        <icon.Icon aria-hidden="true" className="size-5" />
                      ) : null}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline gap-3">
                        <span className="work-row__num font-mono text-label text-blue-500">
                          {number}
                        </span>
                        <h3 className="work-row__title text-h4 text-onpunct [line-height:var(--lh-heading)]">
                          {item.title}
                        </h3>
                      </span>
                      <span className="work-row__body mt-2 block text-small text-onpunct-2 [line-height:var(--lh-body)]">
                        {item.body}
                      </span>
                    </span>

                    <ArrowRight
                      aria-hidden="true"
                      className="work-row__arrow size-5 shrink-0 text-blue-500"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
