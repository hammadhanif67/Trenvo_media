import { Button, Container, Heading, Section } from '../../components/ui';
import { CLOSE } from '../../data/home';
import { PRIMARY_CTA } from '../../data/navigation';

/**
 * 12 CLOSE — wireframe.md §12, master.md §13 §12. Dark (--ink).
 *
 * §17.3: "TWO CTAS MAY SHARE A VIEWPORT ONLY IN THE HERO AND ONLY IN THE CLOSE
 * SECTION." This is that second exception.
 *
 * Rebuilt to the reference's centred composition. The secondary action points
 * at /services rather than at another conversion step: someone who has read the
 * whole page and not clicked the primary CTA is usually missing information,
 * not persuasion.
 */
export function Close() {
  return (
    <Section tone="ink" aria-labelledby="close-heading">
      <Container>
        <div className="mx-auto max-w-[40rem] text-center">
          <Heading
            level={2}
            size="h1"
            id="close-heading"
            className="text-onpunct [text-wrap:balance]"
          >
            {CLOSE.headline}
          </Heading>

          <p className="mx-auto mt-6 max-w-[46ch] text-lead text-onpunct-2 [line-height:var(--lh-body)]">
            {CLOSE.body}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href={PRIMARY_CTA.href} variant="primary">
              {PRIMARY_CTA.label}
            </Button>
            <Button href="/services" variant="secondary">
              View services
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
