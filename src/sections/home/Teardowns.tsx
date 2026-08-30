import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { Button, Container, Eyebrow, Heading, Icon, Section } from '../../components/ui';
import { TEARDOWNS } from '../../data/teardowns';
import { TEARDOWNS_SECTION } from '../../data/home';
import { Reveal } from '../../components/motion/Reveal';

/**
 * 08 TEARDOWNS — wireframe.md §08. Dark (--ink).
 *
 * The proof engine. §34.1(4): "one asset doing five jobs. Three to five must be
 * live on day one."
 *
 * EMPTY STATE. wireframe.md §08 says this section "has no acceptable empty
 * state" — meaning the SITE MAY NOT LAUNCH without it, not that a placeholder
 * is acceptable. §20.3 governs what to render meanwhile: "an empty proof slot
 * is removed from the layout, not filled with a placeholder ... never 'case
 * studies coming soon'" — the Beyond Agents error §2.8 identifies as the most
 * damaging pattern in the whole research set.
 *
 * So while data/teardowns.ts is empty the section unmounts. Populating it is a
 * Phase 5 deliverable and is the launch gate. See implementation.md §5.4.
 */
export function Teardowns() {
  if (TEARDOWNS.length === 0) return null;

  return (
    <Section tone="ink" aria-labelledby="teardowns-heading">
      <Container>
        <Reveal>
          <Eyebrow className="text-onpunct-2">{TEARDOWNS_SECTION.eyebrow}</Eyebrow>
          <Heading
            level={2}
            size="h2"
            id="teardowns-heading"
            className="mt-3 text-onpunct"
          >
            {TEARDOWNS_SECTION.headline}
          </Heading>

          {/* Three most recent, labelled by discipline (wireframe.md §08). */}
          <ul className="mt-16 grid gap-6 md:grid-cols-3">
            {TEARDOWNS.slice(0, 3).map((teardown) => (
              <li key={teardown.slug}>
                <article className="flex h-full flex-col border border-hairline [padding:var(--card-pad)]">
                  <p className="font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-onpunct-2">
                    {teardown.disciplineId.replace(/-/g, ' ')}
                  </p>
                  <h3 className="mt-4 flex-1 text-h4 text-onpunct [line-height:var(--lh-heading)]">
                    {teardown.subject}
                  </h3>
                  <Link
                    to={`/teardowns/${teardown.slug}`}
                    className="mt-8 inline-flex items-center gap-2 text-body text-blue-500 [min-height:var(--touch-min)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                  >
                    Read
                    <Icon icon={ArrowRight} />
                  </Link>
                </article>
              </li>
            ))}
          </ul>

          <div className="mt-12 flex flex-col gap-4 sm:flex-row">
            <Button href={TEARDOWNS_SECTION.primaryCta.href} variant="secondary">
              {TEARDOWNS_SECTION.primaryCta.label}
            </Button>
            <Button href={TEARDOWNS_SECTION.secondaryCta.href} variant="primary">
              {TEARDOWNS_SECTION.secondaryCta.label}
            </Button>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
