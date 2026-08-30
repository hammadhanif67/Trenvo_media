import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { Container, Eyebrow, Heading, Icon, Section } from '../../components/ui';
import { PRACTICES } from '../../data/home';
import { Reveal } from '../../components/motion/Reveal';

/**
 * 04 THE THREE PRACTICES — wireframe.md §04. Light (--surface).
 *
 * wireframe.md §04: "Three equal cards. SERVICES APPEAR AS LISTS INSIDE
 * PRACTICES — NEVER AS EIGHT SEPARATE CARDS." That reframe is §34.1(1), "worth
 * more than every visual decision in this document".
 *
 * Card order: practice name (mono eyebrow) -> the question it owns (H3) ->
 * service list -> hairline -> one mechanism line -> link.
 *
 * Hover: "blue rule extends along the card's top edge, 180ms. No lift, no
 * shadow" (§27.2 #4). The capability list is text, not links — D6.
 */
export function Practices() {
  return (
    <Section tone="surface" aria-labelledby="practices-heading">
      <Container>
        <Reveal>
          <Eyebrow className="text-secondary">{PRACTICES.eyebrow}</Eyebrow>
          <Heading level={2} size="h2" id="practices-heading" className="mt-3">
            {PRACTICES.headline}
          </Heading>

          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {PRACTICES.cards.map((card) => (
              <article
                key={card.id}
                className="group relative flex flex-col border border-hairline bg-base [padding:var(--card-pad)]"
              >
                {/* §27.2 #4 — the blue rule extends on hover. Transform only. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-blue-600 transition-transform duration-[180ms] group-hover:scale-x-100"
                />

                <p className="font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-secondary">
                  {card.name}
                </p>

                <h3 className="mt-3 text-h3 font-semibold text-primary [letter-spacing:var(--tracking-heading)] [line-height:var(--lh-heading)]">
                  {card.question}
                </h3>

                <ul className="mt-6 space-y-2">
                  {card.capabilities.map((capability) => (
                    <li key={capability} className="text-body text-secondary">
                      {capability}
                    </li>
                  ))}
                </ul>

                <hr className="mt-8 w-12 border-0 border-t border-hairline" />

                <p className="mt-6 flex-1 text-body text-primary">{card.mechanism}</p>

                <Link
                  to={card.cta.href}
                  className="mt-8 inline-flex items-center gap-2 text-body text-accent-strong [min-height:var(--touch-min)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {card.cta.label}
                  <Icon icon={ArrowRight} />
                </Link>
              </article>
            ))}
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
