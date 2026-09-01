import type { ReactNode } from 'react';
import {
  CircleDollarSign,
  EyeOff,
  Users,
  Check,
  Search,
  Hammer,
  TrendingUp,
  FileBarChart,
} from 'lucide-react';
import { Container, Heading, Section } from '../../components/ui';
import { Reveal } from '../../components/motion/Reveal';
import { PROBLEM } from '../../data/home';

/* ---------------------------------------------------------------------------
   02 THE PROBLEM — wireframe.md §02, master.md §13 §2

   Built to the supplied reference: a ruled centred eyebrow, a two-line heading
   with one word in accent, two lines of supporting copy, three cards in a
   JOINED grid, and a tinted resolution panel with a blue left edge.

   The three cards reuse `.disc-card` from the six-principle grid, so the two
   grids on this page share one border treatment and one hover behaviour rather
   than being two similar-looking things maintained separately.

   ⚠ THE CHAIN IN THE RESOLUTION PANEL. The reference labels it Paid Media,
   Creative, Analytics, CRO. Analytics and CRO are not Trenvo services — CRO
   went with the Engineering practice — so labelling them here would advertise
   work that is not sold. It carries the four loop stages instead: documented in
   §6.3, already the subject of section 03, and true.
--------------------------------------------------------------------------- */

const CARD_ICONS = [CircleDollarSign, EyeOff, Users] as const;
const CHAIN_ICONS = [Search, Hammer, TrendingUp, FileBarChart] as const;

function RuledLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-4">
      <span aria-hidden="true" className="h-px w-10 bg-hairline sm:w-16" />
      {children}
      <span aria-hidden="true" className="h-px w-10 bg-hairline sm:w-16" />
    </div>
  );
}

export function Problem() {
  return (
    <Section tone="paper" aria-labelledby="problem-heading">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-[52rem] text-center">
            <RuledLabel>
              <p className="font-mono text-label uppercase tracking-[var(--tracking-label)] text-accent">
                {PROBLEM.eyebrow}
              </p>
            </RuledLabel>

            <Heading
              level={2}
              size="h2"
              align="center"
              id="problem-heading"
              className="mt-6 text-primary [text-wrap:balance]"
            >
              {PROBLEM.headline}
              <br />
              <span className="text-accent">{PROBLEM.headlineAccent}</span>{' '}
              {PROBLEM.headlineRest}
            </Heading>

            <p className="mx-auto mt-5 max-w-[52ch] text-body text-secondary [line-height:var(--lh-body)]">
              {PROBLEM.lead}
            </p>
          </div>

          {/* Joined grid — the same treatment as the six-principle grid. */}
          <ul className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {PROBLEM.cards.map((card, i) => {
              const Icon = CARD_ICONS[i] ?? CircleDollarSign;
              const number = String(i + 1).padStart(2, '0');
              return (
                <li
                  key={card.id}
                  className="disc-card flex flex-col border border-hairline bg-base p-6"
                >
                  <div className="flex items-center gap-4">
                    <span className="disc-card__icon inline-flex size-12 shrink-0 items-center justify-center bg-accent/10 text-accent">
                      <Icon aria-hidden="true" className="size-6" />
                    </span>

                    <div>
                      <p className="font-mono text-h4 leading-none text-accent">
                        {number}
                      </p>
                      <span
                        aria-hidden="true"
                        className="disc-card__rule mt-2 block h-px w-6 bg-accent"
                      />
                    </div>
                  </div>

                  <h3 className="mt-6 text-h3 text-primary [line-height:var(--lh-heading)]">
                    {card.title}
                  </h3>

                  <p className="mt-3 text-small text-secondary [line-height:var(--lh-body)]">
                    {card.body}
                  </p>
                </li>
              );
            })}
          </ul>

          {/*
            The resolution. A blue left edge and a tinted field, so it reads as
            the answer to the three cards rather than as a fourth problem.
          */}
          <div className="mt-8 grid gap-8 border border-l-4 border-hairline border-l-accent bg-accent/6 p-6 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12 lg:p-8">
            <div className="flex items-start gap-4">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-paper">
                <Check aria-hidden="true" className="size-5" />
              </span>

              <div>
                <p className="text-h4 text-primary [line-height:var(--lh-heading)]">
                  {PROBLEM.closing.title}{' '}
                  <span className="text-accent">{PROBLEM.closing.titleAccent}</span>
                </p>
                <p className="mt-2 max-w-[46ch] text-small text-secondary [line-height:var(--lh-body)]">
                  {PROBLEM.closing.body}
                </p>
              </div>
            </div>

            {/*
              The four stages as one connected run. Decorative — section 03 is
              where the loop is actually explained; this only shows that the
              four sit on one line rather than in separate contracts.
            */}
            {/*
              ⚠ THIS ROW OVERFLOWED THE VIEWPORT ON PHONES.

              It is a nowrap flex row of fixed-width columns, and it sits in a
              grid track. A grid item defaults to `min-width: auto`, so the
              track cannot shrink below the row's intrinsic width and the whole
              card grows instead. Measured at 320px: the row demanded 316px
              (4 x w-16 + 3 connectors + gaps) inside a 275px content box, so
              the card reported scrollWidth 340 against clientWidth 275 and the
              last stage was clipped 44px past the right edge.

              It did not show up as a horizontal scrollbar because globals.css
              sets `html { overflow-x: clip }` — which suppresses the scrollport
              rather than the overflow. The symptom was silently truncated text
              instead, which is exactly what the reported screenshot shows.

              Two changes, both scoped to small screens:
                · `min-w-0` lets the grid track shrink to the space available
                  rather than being pinned to the row's intrinsic width
                · the columns step down one size below `sm`, which brings the
                  requirement to 252px and fits 320px with room to spare

              Desktop is untouched: `sm:w-20` still governs from 640px up.
            */}
            <ul
              aria-hidden="true"
              className="flex min-w-0 items-start justify-center gap-2 border-t border-accent/20 pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12"
            >
              {PROBLEM.closing.chain.map((step, i) => {
                const ChainIcon = CHAIN_ICONS[i] ?? Search;
                return (
                  <li key={step} className="flex items-start">
                    <div className="flex w-12 flex-col items-center gap-2 sm:w-20">
                      <span className="inline-flex size-12 items-center justify-center rounded-full border border-accent/30 bg-base text-accent">
                        <ChainIcon className="size-5" />
                      </span>
                      <span className="text-center text-label text-secondary">
                        {step}
                      </span>
                    </div>

                    {i < PROBLEM.closing.chain.length - 1 && (
                      <span className="mt-5 block w-3 border-t border-dashed border-accent/40 sm:w-4" />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
