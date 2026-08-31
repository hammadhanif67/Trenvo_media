import { CircleDollarSign, EyeOff, Users, CheckCircle2 } from 'lucide-react';
import { Container, Eyebrow, Heading, Section } from '../../components/ui';
import { Reveal } from '../../components/motion/Reveal';
import { PROBLEM } from '../../data/home';

/* ---------------------------------------------------------------------------
   02 THE PROBLEM — wireframe.md §02, master.md §13 §2

   Rebuilt to the reference: headline with one word in accent, a lead line,
   three problem cards, and a highlight box that resolves them.

   §13 §2 asked for the three points "written as a quotation the visitor has
   heard before". The quotations are kept — they are the sharpest part of the
   section — but each now sits under a named problem, so the section reads as a
   diagnosis rather than as three disconnected complaints.

   Nothing here claims a client, a number or a result. It describes a structural
   problem, which is a claim about how the industry is organised rather than
   about anyone's performance.
--------------------------------------------------------------------------- */

const ICONS = [CircleDollarSign, EyeOff, Users] as const;

export function Problem() {
  return (
    <Section tone="paper" aria-labelledby="problem-heading">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-[46rem] text-center">
            <Eyebrow className="text-accent">{PROBLEM.eyebrow}</Eyebrow>

            <Heading level={2} size="h2" id="problem-heading" className="mt-4 text-primary">
              {PROBLEM.headline}{' '}
              <span className="text-accent">{PROBLEM.headlineAccent}</span>{' '}
              {PROBLEM.headlineRest}
            </Heading>

            <p className="mx-auto mt-5 max-w-[52ch] text-body text-secondary [line-height:var(--lh-body)]">
              {PROBLEM.lead}
            </p>
          </div>

          <ul className="mt-14 grid gap-6 md:grid-cols-3">
            {PROBLEM.cards.map((card, i) => {
              const Icon = ICONS[i] ?? CircleDollarSign;
              return (
                <li
                  key={card.id}
                  className="flex h-full flex-col border border-hairline bg-base [padding:var(--card-pad)]"
                >
                  <Icon aria-hidden="true" className="size-6 shrink-0 text-accent" />

                  <h3 className="mt-5 text-h4 text-primary [line-height:var(--lh-heading)]">
                    {card.title}
                  </h3>

                  <p className="mt-3 flex-1 text-small text-secondary [line-height:var(--lh-body)]">
                    {card.body}
                  </p>

                  <figure className="mt-6 border-t border-hairline pt-4">
                    <blockquote className="text-small text-primary">
                      &ldquo;{card.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-2 font-mono text-label uppercase tracking-[var(--tracking-label)] text-secondary">
                      {card.source}
                    </figcaption>
                  </figure>
                </li>
              );
            })}
          </ul>

          {/* The resolution. Blue-tinted so it reads as the answer, not a fourth problem. */}
          <div /*
              accent/6 rather than --blue-50: the theme is driven by
              [data-theme], not Tailwind's `dark:` variant, so a fixed light
              blue would stay light on the dark surface. An alpha of the accent
              tints correctly on both.
            */
            className="mt-8 flex items-start gap-4 border border-accent/25 bg-accent/6 [padding:var(--card-pad)]">
            <CheckCircle2 aria-hidden="true" className="mt-1 size-6 shrink-0 text-accent" />
            <div>
              <p className="text-h4 text-primary [line-height:var(--lh-heading)]">
                {PROBLEM.closing.title}
              </p>
              <p className="mt-2 text-small text-secondary [line-height:var(--lh-body)]">
                {PROBLEM.closing.body}
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
