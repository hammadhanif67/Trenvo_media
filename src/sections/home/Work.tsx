import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { Button, Container, Eyebrow, Heading, Icon, Section } from '../../components/ui';
import { WORK } from '../../data/work';

/**
 * 09 RESULTS — wireframe.md §09, master.md §19, §20.3
 *
 * ⚠ THE REFERENCE SHOWS "+187%", "+203%", "+152%" ON THREE CASE-STUDY CARDS.
 * None of those is built. `WORK` is empty: no case study has been supplied, so
 * there is no result to report and inventing one is forbidden by §2.8 and by
 * the standing instruction on this project. §20.3 is blunt about it — "a
 * missing section is invisible; a fake one is fatal."
 *
 * What ships instead is the LAYOUT with its result slots visibly empty and
 * labelled as unpublished. That satisfies the brief's "clearly marked and easy
 * to replace" without a single fabricated number ever reaching a visitor.
 *
 * TO POPULATE: add entries to `data/work.ts`. The cards below are replaced by
 * real ones automatically, and §19.3's discriminated union makes attaching a
 * metric to a project a compile error rather than a review catch.
 */

/** Shown only while `WORK` is empty. Carries no numbers, by design. */
const AWAITING = [
  {
    id: 'a',
    sector: 'Paid social',
    label: 'Meta Ads engagement',
  },
  {
    id: 'b',
    sector: 'Paid search',
    label: 'Google Ads account build',
  },
  {
    id: 'c',
    sector: 'Creative production',
    label: 'Performance video engagement',
  },
];

export function Work() {
  const hasWork = WORK.length > 0;

  return (
    <Section tone="ink" aria-labelledby="work-heading">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow className="text-blue-500">Case studies</Eyebrow>
            <Heading
              level={2}
              size="h2"
              id="work-heading"
              className="mt-4 max-w-[22ch] text-onpunct [text-wrap:balance]"
            >
              Work we can show, when there is work to show.
            </Heading>
          </div>

          <div className="shrink-0">
            <Button href="/work" surface="dark" variant="secondary">
              View all case studies
            </Button>
          </div>
        </div>

        {hasWork ? (
          <ul className="mt-14 grid gap-6 md:grid-cols-3">
            {WORK.map((item) => (
              <li key={item.slug}>
                <Link
                  to={`/work/${item.slug}`}
                  className="card-surface group flex h-full flex-col border border-line-dark p-6 [transition:background-color_180ms,border-color_180ms] hover:border-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                >
                  {/*
                    §19.3 — the card reads PROJECT unless the study carries
                    measured metrics. The kind discriminator is what decides it,
                    so a project can never be dressed as a result here.
                  */}
                  <p className="font-mono text-label uppercase tracking-[var(--tracking-label)] text-blue-500">
                    {item.kind === 'result' ? 'Results' : 'Project'}
                  </p>
                  <h3 className="mt-3 text-h4 text-onpunct [line-height:var(--lh-heading)]">
                    {item.context}
                  </h3>
                  <p className="mt-3 flex-1 text-small text-onpunct-2 [line-height:var(--lh-body)]">
                    {item.diagnosis}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-small text-blue-500">
                    Read the project <Icon icon={ArrowRight} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <>
            <ul className="mt-14 grid gap-6 md:grid-cols-3">
              {AWAITING.map((slot) => (
                <li
                  key={slot.id}
                  className="card-surface flex h-full flex-col border border-dashed border-line-dark p-6"
                >
                  <p className="font-mono text-label uppercase tracking-[var(--tracking-label)] text-onpunct-2">
                    {slot.sector}
                  </p>

                  <p className="mt-6 text-h2 text-onpunct-2/40" aria-hidden="true">
                    &mdash;
                  </p>

                  <p className="mt-2 text-small text-onpunct-2 [line-height:var(--lh-body)]">
                    {slot.label}
                  </p>

                  <p className="mt-6 border-t border-line-dark pt-4 font-mono text-label uppercase tracking-[var(--tracking-label)] text-onpunct-2">
                    Not yet published
                  </p>
                </li>
              ))}
            </ul>

            <p className="mt-8 max-w-[62ch] text-small text-onpunct-2 [line-height:var(--lh-body)]">
              We publish a project once the client has approved it and the numbers can be
              traced to a source outside the ad platform. Until then these stay empty
              rather than carrying a figure nobody can check.
            </p>
          </>
        )}
      </Container>
    </Section>
  );
}
