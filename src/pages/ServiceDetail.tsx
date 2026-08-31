import { ArrowRight } from 'lucide-react';
import { Link, useParams } from 'react-router';
import {
  Button,
  Container,
  Eyebrow,
  Heading,
  Icon,
  Rule,
  Section,
} from '../components/ui';
import { CtaSection } from '../sections/shared/CtaSection';
import { SpecialistStrip } from '../sections/shared/SpecialistStrip';
import { Accordion } from '../components/ui/Accordion';
import { DISCIPLINES } from '../data/disciplines';
import { PRACTICE_NAV } from '../data/navigation';
import { SERVICE_CTA, SERVICE_PRACTICE, getService } from '../data/services';
import { TEARDOWNS } from '../data/teardowns';
import { NotFound } from './NotFound';
import { Seo } from '../components/Seo';
import { serviceSchema, breadcrumbSchema, faqSchema } from '../lib/schema';
import type { PracticeId } from '../types/content';

/* ---------------------------------------------------------------------------
   SERVICE DETAIL — one component, seven routes, driven by data/services.ts.
   master.md §14 and §28.2.

   §14's template, in order:
     1 Hero — capability name as H1; outcome line as sub; primary CTA
       "Talk to a [discipline] specialist"
     2 The situation — what is true about this discipline in 2026
     3 What we actually do — 5–7 mechanism lines, technical, unfakeable
     4 Who does it — the owning discipline, WITH ITS BOUNDARY STATED
     5 How it connects — the two adjacent practices, and why this service
       underperforms without them
     6 Proof — related teardowns
     7 Questions — service-specific FAQs
     8 CTA

   §21.3 fixes the <h2> skeleton across all seven pages: "The situation · What
   we actually do · Who does it · How it connects · Proof · Questions.
   Consistency across seven pages creates a recognisable topical pattern."

   §14 on section 5: "this section is what makes the site an argument rather
   than a menu."
--------------------------------------------------------------------------- */

const PRACTICE_LABEL: Record<PracticeId, string> = {
  media: 'Media',
  studio: 'Studio',
};

export function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? getService(slug) : undefined;

  // A slug outside the seven is a genuine 404, not an empty template.
  if (!service) return <NotFound />;

  const owningDisciplines = DISCIPLINES.filter((d) =>
    service.disciplineIds.includes(d.id),
  );
  const relatedTeardowns = TEARDOWNS.filter((t) => t.serviceSlug === service.slug);

  // §9.4 — which of the three practices this service sits in.
  const practiceLabel = PRACTICE_LABEL[SERVICE_PRACTICE[service.slug] ?? 'media'];

  return (
    <>
      <Seo
        schemas={[
          serviceSchema(service),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
            { name: service.name, path: `/services/${service.slug}` },
          ]),
          faqSchema(service.faqs),
        ]}
      />

      {/* 1 — Hero. §21.3: the H1 is the page's primary message, never the
          company name. */}
      <Section tone="ink" aria-labelledby="service-heading">
        <Container>
          <Eyebrow className="text-onpunct-2">{practiceLabel}</Eyebrow>
          <Heading level={1} size="h1" id="service-heading" className="mt-3 text-onpunct">
            {service.name}
          </Heading>
          <p className="mt-6 max-w-[46ch] text-lead text-onpunct-2 [line-height:var(--lh-body)]">
            {service.outcome}
          </p>
          <div className="mt-10">
            <Button href="/contact" variant="primary">
              {SERVICE_CTA[service.slug] ?? 'Start a project'}
            </Button>
          </div>
        </Container>
      </Section>

      {/* 2 — The situation. */}
      <Section tone="paper" aria-labelledby="situation-heading">
        <Container>
          <Heading level={2} size="h2" id="situation-heading">
            The situation
          </Heading>
          <p className="mt-8 max-w-[62ch] text-lead text-primary [line-height:var(--lh-body)]">
            {service.situation}
          </p>
        </Container>
      </Section>

      {/* 3 — What we actually do. §9.2: the mechanism lines are the
          differentiator and are unfakeable by a copywriter. */}
      <Section tone="surface" aria-labelledby="what-heading">
        <Container>
          <Heading level={2} size="h2" id="what-heading">
            What we actually do
          </Heading>
          <ul className="mt-12">
            {service.mechanisms.map((mechanism, i) => (
              <li key={mechanism}>
                {i > 0 && <Rule />}
                <div className="flex gap-6 py-6">
                  <span className="font-mono text-label text-accent [letter-spacing:var(--tracking-label)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="max-w-[62ch] text-body text-primary [line-height:var(--lh-body)]">
                    {mechanism}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* 4 — Who does it. §10.3: the boundary is the argument, so it is
          printed here rather than only on /specialists. */}
      <Section tone="paper" aria-labelledby="who-heading">
        <Container>
          <Heading level={2} size="h2" id="who-heading">
            Who does it
          </Heading>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {owningDisciplines.map((discipline) => (
              <article
                key={discipline.id}
                className="border border-hairline [padding:var(--card-pad)]"
              >
                <h3 className="font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-primary">
                  {discipline.title}
                </h3>
                <p className="mt-6 font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-secondary">
                  Owns
                </p>
                <ul className="mt-2 space-y-1">
                  {discipline.owns.map((o) => (
                    <li key={o} className="text-small text-primary">
                      {o}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-secondary">
                  Does not own
                </p>
                <ul className="mt-2 space-y-1">
                  {discipline.doesNotOwn.map((o) => (
                    <li key={o} className="text-small text-secondary">
                      {o}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {/* 5 — How it connects. §14: "what makes the site an argument rather than
          a menu". §21.4 requires descriptive anchors, not "click here". */}
      <Section tone="surface" aria-labelledby="connects-heading">
        <Container>
          <Heading level={2} size="h2" id="connects-heading">
            How it connects
          </Heading>
          <p className="mt-8 max-w-[62ch] text-body text-secondary [line-height:var(--lh-body)]">
            This service underperforms on its own. It is one stage of a loop, and the two
            practices below are the ones it depends on.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {service.connectsTo.map((practiceId) => {
              const practice = PRACTICE_NAV.find((p) => p.id === practiceId);
              if (!practice) return null;
              return (
                <article
                  key={practiceId}
                  className="border border-hairline bg-base [padding:var(--card-pad)]"
                >
                  <p className="font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-secondary">
                    {practice.name}
                  </p>
                  <h3 className="mt-3 text-h4 text-primary [line-height:var(--lh-heading)]">
                    {practice.question}
                  </h3>
                  <ul className="mt-6 space-y-2">
                    {practice.services.map((s) => (
                      <li key={s.href}>
                        <Link
                          to={s.href}
                          className="inline-flex items-center text-body text-accent-strong [min-height:var(--touch-min)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                        >
                          {s.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* 6 — Proof. Unmounts while empty (§20.3): an empty proof slot is
          removed, never filled with a placeholder. */}
      {relatedTeardowns.length > 0 && (
        <Section tone="ink" aria-labelledby="proof-heading">
          <Container>
            <Heading level={2} size="h2" id="proof-heading" className="text-onpunct">
              Proof
            </Heading>
            <ul className="mt-12 grid gap-6 md:grid-cols-3">
              {relatedTeardowns.slice(0, 3).map((t) => (
                <li key={t.slug}>
                  <Link
                    to={`/teardowns/${t.slug}`}
                    className="flex h-full flex-col border border-hairline [padding:var(--card-pad)] text-onpunct hover:border-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                  >
                    <span className="flex-1 text-h4">{t.subject}</span>
                    <span className="mt-6 inline-flex items-center gap-2 text-body text-blue-500">
                      Read <Icon icon={ArrowRight} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {/* 7 — Questions. Unmounts until Phase 5 supplies service FAQs. */}
      {service.faqs.length > 0 && (
        <Section tone="paper" aria-labelledby="questions-heading">
          <Container width="narrow" className="!px-0">
            <div className="[padding-inline:var(--gutter)]">
              <Heading level={2} size="h2" id="questions-heading">
                Questions
              </Heading>
              <Accordion className="mt-12" items={service.faqs} headingLevel={3} />
            </div>
          </Container>
        </Section>
      )}

      <SpecialistStrip tone="paper" />

      {/* 8 — CTA. */}
      <CtaSection
        headline="Tell us what you are building."
        body="Send the site, the ad account, and what is not working. You will get a specialist's read, not a sales deck."
        primaryLabel={SERVICE_CTA[service.slug]}
      />
    </>
  );
}
