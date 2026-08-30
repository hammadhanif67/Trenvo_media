import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Container, Eyebrow, Heading, Icon, Rule, Section } from '../../components/ui';
import { LOOP } from '../../data/home';
import { useLoopStageScrub } from '../../hooks/useLoopStageScrub';
import { Reveal } from '../../components/motion/Reveal';

/**
 * 03 THE LOOP — wireframe.md §03. Dark (--ink).
 *
 * Four dark sections were approved (implementation.md §1.1), and this is the
 * second: the hero states the argument, the loop teaches it.
 *
 * wireframe.md §03: "Discipline chips (monospace) under each stage tie the loop
 * to the specialist model before that section arrives."
 *
 * §27.2 #2's scroll-scrubbed progression is now implemented, in
 * useLoopStageScrub — scrubbed and reversible, but NOT pinned. The reason is
 * measured and recorded there and in implementation.md §5.18.
 */
export function LoopSection() {
  const ref = useRef<HTMLElement>(null);
  useLoopStageScrub(ref);

  return (
    <Section ref={ref} tone="ink" aria-labelledby="loop-heading">
      <Container>
        <Reveal>
          <Eyebrow className="text-onpunct-2">{LOOP.eyebrow}</Eyebrow>
          <Heading level={2} size="h2" id="loop-heading" className="mt-3 text-onpunct">
            {LOOP.headline}
          </Heading>

          <ol className="mt-16">
            {LOOP.stages.map((stage, i) => (
              <li key={stage.id} data-loop-stage>
                {i > 0 && <Rule tone="dark" />}
                <div className="grid gap-4 py-10 md:grid-cols-[auto_1fr] md:gap-12">
                  <div className="flex items-baseline gap-4 md:w-48">
                    <span className="font-mono text-label text-blue-500 [letter-spacing:var(--tracking-label)]">
                      {stage.index}
                    </span>
                    <h3 className="font-mono text-h4 uppercase text-onpunct [letter-spacing:var(--tracking-label)]">
                      {stage.name}
                    </h3>
                  </div>

                  <div>
                    <p className="max-w-[62ch] text-body text-onpunct-2 [line-height:var(--lh-body)]">
                      {stage.definition}
                    </p>
                    <ul className="mt-5 flex flex-wrap gap-x-3 gap-y-2">
                      {stage.disciplines.map((d) => (
                        <li
                          key={d}
                          className="border border-hairline px-3 py-2 font-mono text-label uppercase leading-none text-onpunct-2 [letter-spacing:var(--tracking-label)]"
                        >
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          {/* §17.2 — a navigation CTA, not a conversion one: the visitor is
            learning here, and pushing a conversion CTA into an education
            section "reads as desperate" (§17.2). */}
          <a
            href={LOOP.cta.href}
            className="mt-8 inline-flex items-center gap-2 text-body text-blue-500 [min-height:var(--touch-min)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          >
            {LOOP.cta.label}
            <Icon icon={ArrowRight} />
          </a>
        </Reveal>
      </Container>
    </Section>
  );
}
