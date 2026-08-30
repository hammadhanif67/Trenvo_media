import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { Container, Eyebrow, Heading, Icon, Section } from '../../components/ui';
import { WORK } from '../../data/work';
import { WORK_SECTION } from '../../data/home';
import { Reveal } from '../../components/motion/Reveal';

/**
 * 09 WORK — wireframe.md §09. Light (--paper).
 *
 * EMPTY-STATE RULE, verbatim from wireframe.md §09: "if there is genuinely
 * nothing to show at launch, THIS SECTION IS REMOVED ENTIRELY. No placeholders,
 * no stock, no 'coming soon'." §13 §9: "A missing section is invisible; a fake
 * one is fatal."
 *
 * Cards are labelled PROJECT, never RESULT, until real measured results exist
 * (§19.3). The discriminated union in types/content.ts makes rendering a metric
 * on a project a compile error rather than a review catch.
 */
export function Work() {
  if (WORK.length === 0) return null;

  return (
    <Section tone="paper" aria-labelledby="work-heading">
      <Container>
        <Reveal>
          <Eyebrow className="text-secondary">{WORK_SECTION.eyebrow}</Eyebrow>
          <Heading level={2} size="h2" id="work-heading" className="mt-3">
            {WORK_SECTION.headline}
          </Heading>

          {/* wireframe.md §09 — horizontal scroller with scroll-snap, keyboard
            navigable. The progress rail arrives with SnapScroller at the motion
            pass (§27.2 #7); the scroll region itself is usable now. */}
          {/*
          wireframe.md §09 requires this scroller to be keyboard-navigable, and
          a scrollable region must be focusable for that to be true. jsx-a11y
          flags a bare tabIndex on a <ul>; role="region" with a name is what
          makes it legitimate rather than a stray tab stop — the container is a
          real landmark a keyboard user scrolls, not a fake control.
        */}
          <ul
            className="mt-16 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4"
            role="region"
            tabIndex={0}
            aria-label="Selected work"
          >
            {WORK.map((item) => (
              <li key={item.slug} className="w-80 shrink-0 snap-start">
                <article className="flex h-full flex-col border border-hairline [padding:var(--card-pad)]">
                  {/* §19.3 — the label is PROJECT until results are real. */}
                  <p className="font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-secondary">
                    {item.kind === 'result' ? 'Result' : 'Project'}
                  </p>
                  <h3 className="mt-4 flex-1 text-h4 text-primary [line-height:var(--lh-heading)]">
                    {item.context}
                  </h3>
                </article>
              </li>
            ))}
          </ul>

          <Link
            to={WORK_SECTION.cta.href}
            className="mt-8 inline-flex items-center gap-2 text-body text-accent-strong [min-height:var(--touch-min)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {WORK_SECTION.cta.label}
            <Icon icon={ArrowRight} />
          </Link>
        </Reveal>
      </Container>
    </Section>
  );
}
