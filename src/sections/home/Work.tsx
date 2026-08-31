import { useRef } from 'react';
import { ArrowRight, BarChart3, PenTool, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router';
import { Button, Container, Eyebrow, Heading, Section } from '../../components/ui';
import { BrandIcon } from '../../components/media/BrandIcon';
import { CubeScene, type CubeHandle } from '../../components/motion/CubeScene';
import { useCubeScrollTimeline } from '../../hooks/useCubeScrollTimeline';
import { useTheme } from '../../hooks/useTheme';
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
  { kind: 'brand', name: 'YouTube' },
  { kind: 'lucide', Icon: PenTool },
  { kind: 'lucide', Icon: BarChart3 },
  { kind: 'lucide', Icon: ShoppingCart },
] as const;

export function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<CubeHandle>(null);
  const dark = useTheme() === 'dark';

  useCubeScrollTimeline(sectionRef, contentRef, cubeRef);

  return (
    <Section
      ref={sectionRef}
      tone="ink"
      aria-labelledby="work-heading"
      className="relative overflow-hidden"
    >
      {/* z-0 — behind everything, and it never takes a pointer event. */}
      <CubeScene ref={cubeRef} dark={dark} className="absolute inset-0 z-0" />

      <Container className="relative z-10">
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
            Compact bordered rows, not cards. Square corners, and the hover is a
            border, a whisper of glow and a 2px lift — never a filled row.
          */}
          <ul className="mt-12 grid gap-4 md:grid-cols-2">
            {WORK_CATEGORIES.map((item, i) => {
              const icon = ROW_ICONS[i];
              const number = String(i + 1).padStart(2, '0');
              return (
                <li key={item.id}>
                  <Link
                    to="/work"
                    className="group relative flex items-center gap-4 border border-line-dark p-5 [transition:border-color_280ms_ease,box-shadow_280ms_ease,transform_280ms_ease] hover:-translate-y-0.5 hover:border-blue-500/70 hover:shadow-[0_10px_30px_-20px_rgba(77,141,255,0.6)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                  >
                    <span className="inline-flex size-12 shrink-0 items-center justify-center border border-line-dark text-blue-500 [transition:border-color_280ms_ease] group-hover:border-blue-500/60">
                      {icon?.kind === 'brand' ? (
                        <BrandIcon name={icon.name} className="size-5" />
                      ) : icon ? (
                        <icon.Icon aria-hidden="true" className="size-5" />
                      ) : null}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline gap-3">
                        <span className="font-mono text-label text-blue-500">
                          {number}
                        </span>
                        <h3 className="text-h4 text-onpunct [line-height:var(--lh-heading)]">
                          {item.title}
                        </h3>
                      </span>
                      <span className="mt-2 block text-small text-onpunct-2 [line-height:var(--lh-body)]">
                        {item.body}
                      </span>
                    </span>

                    <ArrowRight
                      aria-hidden="true"
                      className="size-5 shrink-0 text-blue-500 transition-transform duration-[280ms] group-hover:translate-x-1"
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
