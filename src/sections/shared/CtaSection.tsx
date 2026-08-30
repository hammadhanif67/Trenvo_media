import { Button, Container, Heading, Section } from '../../components/ui';
import type { SectionTone } from '../../components/ui';
import { PRIMARY_CTA, SECONDARY_CTA } from '../../data/navigation';

/**
 * CTA SECTION — master.md §26.2 (`CTASection`, `tone: ink | paper`).
 *
 * §17.3 pairs both conversion CTAs only in the hero and the close, "where the
 * pairing is intentional and hierarchically distinct (solid blue vs. outlined)".
 * This is the close block for every page other than the homepage.
 */
export interface CtaSectionProps {
  tone?: SectionTone;
  headline: string;
  body?: string;
  primaryLabel?: string;
}

export function CtaSection({
  tone = 'ink',
  headline,
  body,
  primaryLabel,
}: CtaSectionProps) {
  const dark = tone === 'ink';

  return (
    <Section tone={tone} aria-labelledby="cta-heading">
      <Container>
        <div className="max-w-[46ch]">
          <Heading
            level={2}
            size="h2"
            id="cta-heading"
            className={dark ? 'text-onpunct' : ''}
          >
            {headline}
          </Heading>
          {body && (
            <p
              className={`mt-6 text-lead [line-height:var(--lh-body)] ${dark ? 'text-onpunct-2' : 'text-secondary'}`}
            >
              {body}
            </p>
          )}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button href={PRIMARY_CTA.href} variant="primary">
              {primaryLabel ?? PRIMARY_CTA.label}
            </Button>
            <Button href={SECONDARY_CTA.href} variant="secondary">
              {SECONDARY_CTA.label}
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
