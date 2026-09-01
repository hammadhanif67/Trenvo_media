import { Link } from 'react-router';
import { Container, Eyebrow, Heading, Prose, Section } from '../components/ui';
import { CONTACT_EMAIL } from '../lib/site';
import { COMPANY_FACTS } from '../data/navigation';
import { Seo } from '../components/Seo';

/**
 * /privacy, /terms and /dpa — master.md §11.3: "Required for international lead
 * capture."
 *
 * ⚠ THE BINDING LEGAL TEXT IS NOT DRAFTED HERE, AND MUST NOT BE.
 *
 * A privacy policy for a company selling into the US, UK, EU, GCC, Australia and
 * Canada engages GDPR, UK GDPR and several other regimes at once. Terms carry
 * contractual liability. A DPA is a contract between a controller and a
 * processor with statutorily required clauses. None of that is content a build
 * can invent: a fabricated policy is not a placeholder, it is a false legal
 * statement made to real visitors, and it is worse than an empty page because
 * it looks finished.
 *
 * What each page DOES publish is the set of operational facts that are already
 * true and already binding — how data actually moves through this site and this
 * business — plus an explicit note about what is outstanding and a working
 * route to a person. That is honest, it is useful to a buyer doing diligence,
 * and it does not pretend to be the executed document.
 *
 * ⚠ ALL THREE ARE noindex (see data/seo.ts). They must exist and be linked;
 * they have no business competing for a search result.
 *
 * PRE-LAUNCH GATE: counsel-reviewed text replaces `outstanding` on each page.
 */

export type LegalDocument = 'privacy' | 'terms' | 'dpa';

export interface LegalProps {
  document: LegalDocument;
}

interface LegalCopy {
  eyebrow: string;
  title: string;
  intro: string;
  /** What is already true and already operating. Verifiable today. */
  known: { t: string; b: string }[];
  /** What still requires legal review before it can be stated. */
  outstanding: string;
}

const COPY: Record<LegalDocument, LegalCopy> = {
  privacy: {
    eyebrow: 'Legal',
    title: 'Privacy',
    intro:
      'This describes what actually happens to data on this site and in an engagement. The counsel-reviewed policy replaces it before launch; nothing below will contradict it, because all of it is a description of how the site is built.',
    known: [
      {
        t: 'This site sets no analytics cookie, and no tracking cookie of any kind',
        b: 'There is no third-party tag, no tag manager, no advertising pixel and no cross-site identifier. That is why you have not been shown a consent banner — there is nothing to consent to. The only browser storage used is your light/dark theme preference, which never leaves your device.',
      },
      {
        t: 'What the contact form collects, and why',
        b: 'Your name, work email, company, website, spend band, what you need help with, and your message. All of it is used to reply to you and to write the analysis you asked for. None of it is used for anything else.',
      },
      {
        t: 'You are not added to a list',
        b: 'There is no newsletter, no drip sequence and no marketing automation on this site. Submitting the form starts a conversation with a person, not an enrolment.',
      },
      {
        t: 'Your data is not sold, and not shared for advertising',
        b: 'It reaches the specialist who replies to you and the tools needed to send that reply. It is not passed to a data broker, an ad platform or any partner.',
      },
      {
        t: 'Account access is read-only where possible, and revocable always',
        b: 'A teardown needs read access at most. You can revoke it the moment you have the document, and we will not ask why.',
      },
      {
        t: 'You own your ad accounts and your assets',
        b: 'They are created in your name and they stay with you if we stop working together. This is a commitment about ownership, not a data-protection technicality.',
      },
      {
        t: 'AI tools do not receive your personal data',
        b: 'Customer records, email lists and anything identifying an individual are never put into a generative tool. The AI policy sets out the full position.',
      },
    ],
    outstanding:
      'Still to be completed with counsel: the legal basis stated per processing purpose, retention periods, the named sub-processors, the international transfer mechanism, and the procedure for exercising access, correction and erasure rights.',
  },
  terms: {
    eyebrow: 'Legal',
    title: 'Terms',
    intro:
      'The executed terms of any engagement are agreed in writing before work begins, and they govern. What follows is the set of commitments that appear in every one of them, published here so you can read them before you are in a contract conversation.',
    known: [
      {
        t: 'You own the accounts and the assets',
        b: 'Throughout the engagement and after it. Accounts are created in your name. Nothing we build for you is held hostage to a renewal.',
      },
      {
        t: 'Scope is written down before work starts',
        b: 'One cycle of the loop at a time, with the disciplines assigned to it named and what each one owns stated in writing.',
      },
      {
        t: 'You are introduced to the people doing the work',
        b: 'By name, before work starts. If a specialist on your account changes, you are told who and why before the change takes effect.',
      },
      {
        t: 'Notice terms are agreed up front',
        b: 'You are never told the notice period at the moment you want to leave.',
      },
      {
        t: 'No commission on media spend',
        b: 'Spend is paid by you, directly to the platforms. We never invoice it and take no percentage of it, so we have no structural reason to recommend spending more.',
      },
      {
        t: 'We say no to work outside our practices',
        b: 'SEO, content marketing and standalone brand identity are refused rather than subcontracted quietly.',
      },
    ],
    outstanding:
      'Still to be completed with counsel: limitation of liability, indemnities, intellectual property warranties covering AI-assisted production, payment and late-payment terms, termination for cause, and the governing law and jurisdiction.',
  },
  dpa: {
    eyebrow: 'Legal',
    title: 'Data Processing Addendum',
    intro:
      'Where Trenvo Media processes personal data on your behalf — running your ad accounts, handling conversion data, working inside your analytics — you are the controller and we are the processor. A signed DPA governs that relationship. This page states the operational position it will reflect.',
    known: [
      {
        t: 'We process only on your documented instructions',
        b: 'The scope of an engagement is the instruction. We do not repurpose data from one client for another, and we do not use your data to build anything of our own.',
      },
      {
        t: 'Least data, not most',
        b: 'We ask for the minimum access that lets the work be done. Read access where read access is enough.',
      },
      {
        t: 'Personal data is not put into generative AI tools',
        b: 'Customer records, email lists and anything identifying an individual stay out of them entirely. Where a tool offers a training opt-out, it is switched off before the tool touches client work.',
      },
      {
        t: 'Sub-processors are named, not implied',
        b: 'Any platform or tool that will handle your data in the course of an engagement is named in the DPA before the engagement starts, and you are told before one changes.',
      },
      {
        t: 'Access ends when the engagement does',
        b: 'Account access is handed back or revoked at the end of an engagement. Because the accounts are yours and in your name, this is a permission change rather than a migration.',
      },
      {
        t: 'We assist with data subject requests',
        b: 'If a request reaches you that concerns data we process on your behalf, we help you answer it rather than telling you it is your problem.',
      },
    ],
    outstanding:
      'Still to be completed with counsel: the executable DPA itself, including the full sub-processor schedule, the technical and organisational measures annex, the international transfer mechanism and its standard contractual clauses, and breach notification timelines.',
  },
};

export function Legal({ document }: LegalProps) {
  const copy = COPY[document];

  return (
    <>
      {/* noindex comes from data/seo.ts, which marks all three routes. */}
      <Seo />

      <Section tone="ink" aria-labelledby="legal-heading">
        <Container width="narrow">
          <Eyebrow className="text-onpunct-2">{copy.eyebrow}</Eyebrow>
          <Heading level={1} size="h1" id="legal-heading" className="mt-3 text-onpunct">
            {copy.title}
          </Heading>
        </Container>
      </Section>

      <Section tone="paper">
        <Container width="narrow">
          <Prose>
            <p>{copy.intro}</p>
          </Prose>

          <h2 className="mt-12 font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-secondary">
            What is already true
          </h2>
          <ul className="mt-8 space-y-8">
            {copy.known.map((item) => (
              <li key={item.t} className="border-l-2 border-accent pl-6">
                <h3 className="text-h4 text-primary [line-height:var(--lh-heading)]">
                  {item.t}
                </h3>
                <p className="mt-2 text-body text-secondary [line-height:var(--lh-body)]">
                  {item.b}
                </p>
              </li>
            ))}
          </ul>

          {/*
            ⚠ THE OUTSTANDING NOTE IS NOT A PLACEHOLDER APOLOGY.

            It is a specific, checkable list of what a lawyer still has to
            supply. A buyer doing diligence reads this and knows exactly what
            they are and are not being shown, which is a far better position
            than a generic policy that turns out to describe nothing.
          */}
          <h2 className="mt-16 font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-secondary">
            What is still with counsel
          </h2>
          <p className="mt-4 max-w-[62ch] text-body text-secondary [line-height:var(--lh-body)]">
            {copy.outstanding}
          </p>

          <Prose className="mt-12">
            <p>
              For any question about data we hold, or to ask for the current draft of
              this document, write to{' '}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and a person will
              answer it.
            </p>
            <p>
              See also our{' '}
              <Link to="/ai-policy">AI policy</Link>, which covers how AI is used in
              production and what happens to data around it.
            </p>
          </Prose>

          {/*
            The legal entity is printed only when it has been verified. An
            invented company name on a legal page is the single worst
            fabrication available on this site.
          */}
          {COMPANY_FACTS.legalName && (
            <p className="mt-12 text-small text-secondary">
              {COMPANY_FACTS.legalName}
              {COMPANY_FACTS.registration && ` · ${COMPANY_FACTS.registration}`}
            </p>
          )}
        </Container>
      </Section>
    </>
  );
}
