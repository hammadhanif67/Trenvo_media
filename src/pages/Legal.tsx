import { Container, Eyebrow, Heading, Prose, Section } from '../components/ui';
import { CONTACT_EMAIL } from '../data/navigation';
import { Seo } from '../components/Seo';

/**
 * /legal/privacy and /legal/terms — master.md §11.3.
 *
 * §11.3 lists both as launch routes: "Required for international lead capture."
 *
 * ⚠ THE CONTENT OF THESE PAGES IS NOT DRAFTED HERE, AND MUST NOT BE.
 *
 * A privacy policy for a company selling into the US, UK, EU, GCC, Australia
 * and Canada carries GDPR, UK GDPR and several other regimes. Terms carry
 * contractual liability. Neither document exists in master.md or wireframe.md,
 * and neither is content a build can invent: a fabricated privacy policy is not
 * a placeholder, it is a false legal statement made to real visitors.
 *
 * So the routes exist — the footer links to them and a 404 from the footer
 * would be worse — and each states plainly what is outstanding, names the real
 * commitment that IS documented (§10.3, §16.2: the client owns the accounts and
 * the assets), and gives a working contact route for data questions.
 *
 * These pages are a gate on launch, alongside the teardowns. Recorded in
 * implementation.md §5.9.
 */

export type LegalDocument = 'privacy' | 'terms';

export interface LegalProps {
  document: LegalDocument;
}

const COPY: Record<LegalDocument, { title: string; intro: string; known: string[] }> = {
  privacy: {
    title: 'Privacy',
    intro:
      'This policy is being prepared with counsel before launch. Trenvo works with brands in the US, UK, EU, GCC, Australia and Canada, so it has to be right across several regimes rather than adapted from a template.',
    known: [
      'You own your ad accounts and your assets. They are created in your name and they stay with you if we stop working together.',
      'We ask for the minimum needed to give you a specialist read: your work email, your site, and access to the accounts being reviewed.',
      'Analytics on this site are cookieless by default, which is why you have not been shown a consent banner.',
    ],
  },
  terms: {
    title: 'Terms',
    intro:
      'These terms are being prepared with counsel before launch. Engagement bands, notice periods and the terms of an engagement are agreed in writing before any work begins.',
    known: [
      'You own your ad accounts and your assets, throughout the engagement and after it.',
      'Every discipline the work requires is assigned a named individual, introduced before work starts.',
      'If a specialist on your account changes, you are told who and why before the change takes effect.',
    ],
  },
};

export function Legal({ document }: LegalProps) {
  const copy = COPY[document];

  return (
    <>
      <Seo />

      <Section tone="ink" aria-labelledby="legal-heading">
        <Container width="narrow">
          <Eyebrow className="text-onpunct-2">Legal</Eyebrow>
          <Heading level={1} size="h1" id="legal-heading" className="mt-3 text-onpunct">
            {copy.title}
          </Heading>
        </Container>
      </Section>

      <Section tone="paper">
        <Container width="narrow">
          <Prose>
            <p>{copy.intro}</p>
            <p>
              Rather than publish a template that does not describe how we actually
              operate, here is what is already true and already binding in every
              engagement:
            </p>
          </Prose>

          <ul className="mt-8 space-y-5">
            {copy.known.map((item) => (
              <li
                key={item}
                className="border-l-2 border-accent pl-6 text-body text-primary [line-height:var(--lh-body)]"
              >
                {item}
              </li>
            ))}
          </ul>

          <Prose className="mt-10">
            <p>
              For any question about data we hold, write to{' '}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and a person will
              answer it.
            </p>
          </Prose>
        </Container>
      </Section>
    </>
  );
}
