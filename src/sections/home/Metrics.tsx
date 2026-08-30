import { Container, Eyebrow, Heading, Section } from '../../components/ui';
import { MEASUREMENT } from '../../data/home';
import { Reveal } from '../../components/motion/Reveal';

/**
 * 07 WHAT WE MEASURE — wireframe.md §07. Light (--paper).
 *
 * §13 §7 calls this "the most important non-obvious section on the page": it
 * "proves competence without claiming a single result ... unlike a stat counter
 * it cannot be faked by a competitor without the knowledge." It is the honest
 * replacement for the animated counter §2.7 warns against.
 *
 * wireframe.md §07: "Rendered as a technical table, monospace, dense,
 * deliberately unglamorous." No CTA.
 *
 * §29.2: "Tables (MetricTable) become STACKED DEFINITION ROWS below 768px —
 * never horizontally scrolling tables on mobile." Implemented as a real <table>
 * whose rows become blocks under 768px, so the semantics survive the reflow.
 */
export function Metrics() {
  return (
    <Section tone="paper" aria-labelledby="measure-heading">
      <Container>
        <Reveal>
          <Eyebrow className="text-secondary">{MEASUREMENT.eyebrow}</Eyebrow>
          <Heading level={2} size="h2" id="measure-heading" className="mt-3">
            {MEASUREMENT.headline}
          </Heading>

          <table className="mt-16 w-full border-collapse text-left">
            <thead className="hidden md:table-header-group">
              <tr className="border-b border-hairline">
                <th
                  scope="col"
                  className="w-56 py-4 pr-6 font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-secondary font-medium"
                >
                  {MEASUREMENT.columns.metric}
                </th>
                <th
                  scope="col"
                  className="w-40 py-4 pr-6 font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-secondary font-medium"
                >
                  {MEASUREMENT.columns.owner}
                </th>
                <th
                  scope="col"
                  className="py-4 font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-secondary font-medium"
                >
                  {MEASUREMENT.columns.usage}
                </th>
              </tr>
            </thead>

            <tbody>
              {MEASUREMENT.rows.map((row) => (
                <tr
                  key={row.metric}
                  className="block border-b border-hairline py-6 md:table-row md:py-0"
                >
                  <th
                    scope="row"
                    className="block py-0 pr-6 text-left font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-primary font-medium md:table-cell md:py-6 md:align-top"
                  >
                    {row.metric}
                  </th>
                  <td className="block pr-6 pt-2 font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-secondary md:table-cell md:py-6 md:pt-6 md:align-top">
                    {row.ownedByLabel}
                  </td>
                  <td className="block pt-3 text-body text-secondary [line-height:var(--lh-body)] md:table-cell md:py-6 md:pt-6 md:align-top">
                    {row.howWeUseIt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </Container>
    </Section>
  );
}
