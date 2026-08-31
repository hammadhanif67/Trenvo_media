import { CircleDollarSign, EyeOff, Users, CheckCircle2 } from 'lucide-react';
import { Container, Eyebrow, Heading, Section } from '../../components/ui';
import { Reveal } from '../../components/motion/Reveal';
import { PROBLEM } from '../../data/home';

/* ---------------------------------------------------------------------------
   02 THE PROBLEM — wireframe.md §02, master.md §13 §2

   Built to the reference: everything centred, three borderless columns rather
   than bordered cards, and a tinted highlight box that resolves them.

   The three columns carry no border and no card surface on purpose — in the
   reference they float on the section background, which is what stops this
   reading as a third grid of boxes after the process and services grids.

   Nothing here claims a client, a number or a result. It describes how the
   industry is organised, not how anyone performed.
--------------------------------------------------------------------------- */

const ICONS = [CircleDollarSign, EyeOff, Users] as const;

export function Problem() {
  return (
    <Section tone="paper" aria-labelledby="problem-heading">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-[44rem] text-center">
            <Eyebrow className="text-secondary">{PROBLEM.eyebrow}</Eyebrow>

            <Heading
              level={2}
              size="h2"
              id="problem-heading"
              className="mt-4 text-primary [text-wrap:balance]"
            >
              {PROBLEM.headline}
              <br />
              <span className="text-accent">{PROBLEM.headlineAccent}</span>{' '}
              {PROBLEM.headlineRest}
            </Heading>

            <p className="mx-auto mt-5 max-w-[48ch] text-body text-secondary [line-height:var(--lh-body)]">
              {PROBLEM.lead}
            </p>
          </div>

          {/* Three columns, no borders — they sit on the section, not in boxes. */}
          <ul className="mx-auto mt-16 grid max-w-[62rem] gap-10 md:grid-cols-3 md:gap-12">
            {PROBLEM.cards.map((card, i) => {
              const Icon = ICONS[i] ?? CircleDollarSign;
              return (
                <li key={card.id}>
                  <span className="icon-tile">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>

                  <h3 className="mt-5 text-h4 text-primary [line-height:var(--lh-heading)]">
                    {card.title}
                  </h3>

                  <p className="mt-3 text-small text-secondary [line-height:var(--lh-body)]">
                    {card.body}
                  </p>
                </li>
              );
            })}
          </ul>

          {/* The resolution. Tinted, so it reads as the answer to the three above. */}
          <div className="card-surface mx-auto mt-16 flex max-w-[62rem] items-start gap-4 border border-accent/20 bg-accent/6 p-6">
            <CheckCircle2
              aria-hidden="true"
              className="mt-1 size-5 shrink-0 text-accent"
            />
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
