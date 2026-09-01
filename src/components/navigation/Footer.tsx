import { Link } from 'react-router';
import { Mail } from 'lucide-react';
import { Container, Rule, Section } from '../ui';
import { Logo } from '../media/Logo';
import { SocialIcon, type SocialName } from '../media/SocialIcon';
import { cn } from '../../lib/cn';
import {
  COMPANY_FACTS,
  COMPANY_NAV,
  CONTACT_EMAIL,
  LEGAL_NAV,
  PRACTICE_NAV,
  REGION_LINE,
  RESOURCES_NAV,
  SOCIAL_LINKS,
  SOCIAL_NOT_SET,
  type NavLink,
} from '../../data/navigation';

/* ---------------------------------------------------------------------------
   FOOTER — master.md §26.2, §13 §12; wireframe.md §12

   Rebuilt to the reference's four-column layout with a contact block on the
   right. wireframe.md §1.3's required contents are all still here and in
   order: services grouped by practice, company, proof, legal, and the region +
   contact line.

   §21.4 — "Footer carries the full service list, grouped by practice." That is
   also what keeps click depth at two and leaves no orphans (§1.4), so the
   columns are generated from PRACTICE_NAV rather than hand-listed: a service
   cannot exist in the menu and be missing here.

   FOUR LINK COLUMNS: Media, Creative, Company, Resources. The first two are
   DERIVED from data/services.ts via PRACTICE_NAV, so a service cannot exist in
   the menu and be missing here.

   ⚠ NO NEWSLETTER FORM. The reference ends with an email capture. There is no
   mailing list, no sequence and no privacy notice written for one, so a field
   that looks like it subscribes you would collect an address with nowhere
   lawful to put it. The contact block points at the teardown offer and the real
   inbox instead — both of which lead somewhere.
--------------------------------------------------------------------------- */

function FooterColumn({ title, links }: { title: string; links: NavLink[] }) {
  return (
    <div>
      {/*
        h2, not h3. These are top-level groupings inside the footer landmark,
        and on a page whose body has no h2 — /legal/privacy, /legal/terms — an
        h3 here creates an h1 -> h3 skip. The audit caught exactly that.
      */}
      <h2 className="font-mono text-label uppercase tracking-[var(--tracking-label)] text-blue-500">
        {title}
      </h2>
      <ul className="mt-4 space-y-1">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              to={link.href}
              className="inline-flex items-center text-small text-onpunct-2 [min-height:var(--touch-min)] transition-colors hover:text-onpunct focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * A configured URL renders as a real external link; an unset one renders as
 * plain text, so the row is visually complete without ever pointing at a URL
 * that does not exist. `npm run audit` fails while any remain unset.
 */
function Social({ label, href }: { label: string; href: string }) {
  const shell =
    'inline-flex items-center justify-center border border-line-dark [min-height:var(--touch-min)] [min-width:var(--touch-min)]';

  if (href === SOCIAL_NOT_SET) {
    return (
      <li>
        <span className={cn(shell, 'text-onpunct-2/40')}>
          <SocialIcon name={label as SocialName} className="size-5" />
          <span className="sr-only">{label} — profile not published yet</span>
        </span>
      </li>
    );
  }

  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`Trenvo Media on ${label}`}
        className={cn(
          shell,
          'text-onpunct-2 transition-colors hover:border-blue-500 hover:text-onpunct',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500',
        )}
      >
        <SocialIcon name={label as SocialName} className="size-5" />
      </a>
    </li>
  );
}

export function Footer() {
  return (
    <Section
      as="footer"
      tone="ink"
      padding="none"
      /*
        The footer sets its OWN rhythm. §25.2's --section-pad-ink is 160px at
        this width, which on a footer reads as a large empty band under the
        copyright line rather than as breathing room. The reference footer is
        compact; this is 80px in and 40px out.
      */
      className="[padding-block:var(--s-20)_var(--s-10)]"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-[20rem_1fr] lg:gap-16">
          {/* -------- BRAND -------- */}
          <div>
            {/* The footer is always ink, so the reversed lockup is always right. */}
            <Logo variant="lockup" height={36} reversed />

            <p className="mt-6 max-w-[34ch] text-small text-onpunct-2 [line-height:var(--lh-body)]">
              We run paid media and creative production as one system, with a
              named specialist on every part of your account.
            </p>

            <ul className="mt-8 flex flex-wrap items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <Social key={social.label} label={social.label} href={social.href} />
              ))}
            </ul>
          </div>

          {/* -------- LINK COLUMNS -------- */}
          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Services grouped by practice — §21.4, wireframe.md §12. */}
            {PRACTICE_NAV.map((practice) => (
              <FooterColumn
                key={practice.id}
                title={practice.name}
                links={practice.services}
              />
            ))}

            <FooterColumn title="Company" links={COMPANY_NAV} />
            <FooterColumn title="Resources" links={RESOURCES_NAV} />
          </div>
        </div>

        <Rule tone="dark" className="mt-12" />

        {/* -------- CONTACT -------- */}
        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-3 text-h4 text-onpunct [min-height:var(--touch-min)] transition-colors hover:text-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            >
              <Mail aria-hidden="true" className="size-5 shrink-0 text-blue-500" />
              {CONTACT_EMAIL}
            </a>
            <p className="mt-3 text-small text-onpunct-2">{REGION_LINE}</p>

            {/*
              COMPANY FACTS, PRINTED ONLY WHEN VERIFIED.

              No registered entity, company number, address or founding year has
              been supplied to this repository, so none is stated. Each line
              renders only when COMPANY_FACTS carries a real value — see the
              note beside it in data/navigation.ts. An invented legal entity or
              address is the one category of fabrication with legal consequences
              attached, and a footer is exactly where it would go unchallenged.
            */}
            {(COMPANY_FACTS.legalName || COMPANY_FACTS.address) && (
              <address className="mt-3 text-small not-italic text-onpunct-2">
                {COMPANY_FACTS.legalName && <span className="block">{COMPANY_FACTS.legalName}</span>}
                {COMPANY_FACTS.registration && (
                  <span className="block">{COMPANY_FACTS.registration}</span>
                )}
                {COMPANY_FACTS.address && (
                  <span className="block">
                    {[
                      COMPANY_FACTS.address.street,
                      COMPANY_FACTS.address.locality,
                      COMPANY_FACTS.address.region,
                      COMPANY_FACTS.address.postalCode,
                      COMPANY_FACTS.address.country,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </span>
                )}
              </address>
            )}
          </div>

          <p className="max-w-[38ch] text-small text-onpunct-2 [line-height:var(--lh-body)]">
            Email reaches a specialist, not a queue. Or{' '}
            <Link
              to="/teardown"
              className="text-blue-500 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            >
              ask for a free teardown
            </Link>{' '}
            and get a written read on your ads before anything is asked of you.
          </p>
        </div>

        <Rule tone="dark" className="mt-10" />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-small text-onpunct-2">
            © {COMPANY_FACTS.founded ? `${COMPANY_FACTS.founded}–` : ''}
            {new Date().getFullYear()} Trenvo Media. All rights reserved.
          </p>
          <ul className="flex flex-wrap items-center gap-6">
            {LEGAL_NAV.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className="inline-flex items-center text-small text-onpunct-2 [min-height:var(--touch-min)] transition-colors hover:text-onpunct focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
