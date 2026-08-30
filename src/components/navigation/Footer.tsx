import { Link } from 'react-router';
import { Button, Container, Rule, Section } from '../ui';
import { Logo } from '../media/Logo';
import { SocialIcon, type SocialName } from '../media/SocialIcon';
import { cn } from '../../lib/cn';
import {
  COMPANY_NAV,
  CONTACT_EMAIL,
  LEGAL_NAV,
  PRACTICE_NAV,
  PRIMARY_CTA,
  PROOF_NAV,
  REGION_LINE,
  SOCIAL_LINKS,
  SOCIAL_NOT_SET,
  type NavLink,
} from '../../data/navigation';

/* ---------------------------------------------------------------------------
   FOOTER — master.md §26.2, §13 §12; wireframe.md §12

   wireframe.md §1.3: "Services (grouped by practice) · Company (About, Process,
   Specialists, Contact) · Proof (Work, Teardowns) · Legal · region + contact
   line." All of that is still here, in that order.

   §21.4 — "Footer carries the full service list, grouped by practice." That is
   also what keeps click depth at two and leaves no orphans (§1.4).

   The footer is ink. §22.2 principle 7 counts dark PAGE SECTIONS as
   punctuation — hero, loop, proof, close (implementation.md §1.1). The footer
   is chrome rather than a homepage section, and wireframe.md §12 draws it
   continuous with the ink close block above it.

   The brand block at the top and the social row are additions, requested.
   Neither asserts anything: the sign-off line is Trenvo's own positioning from
   §6.1, and the social row is discussed in data/navigation.ts. No client, logo,
   number or testimonial appears here. Recorded in implementation.md §5.18.
--------------------------------------------------------------------------- */

function FooterColumn({ title, links }: { title: string; links: NavLink[] }) {
  return (
    <div>
      <h2 className="font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-blue-500">
        {title}
      </h2>
      <ul className="mt-4 space-y-1">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              to={link.href}
              className="group inline-flex items-center text-small text-onpunct-2 [min-height:var(--touch-min)] transition-colors hover:text-onpunct focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
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
 * One social entry. A configured URL renders as a real external link; an unset
 * one renders as plain text, so the row is visually complete without ever
 * pointing at a URL that does not exist.
 */
function Social({ label, href }: { label: string; href: string }) {
  const shell =
    'inline-flex items-center justify-center border border-hairline [min-height:var(--touch-min)] [min-width:var(--touch-min)]';

  if (href === SOCIAL_NOT_SET) {
    return (
      <li>
        <span
          className={cn(shell, 'text-onpunct-2/40')}
          title={`${label} — profile not published yet`}
        >
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
    <Section as="footer" tone="ink">
      <Container>
        {/*
          BRAND BLOCK — the footer opens with the lockup and the §6.1 positioning
          line rather than dropping straight into link columns, so the page ends
          on the brand instead of on a sitemap.
        */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            {/* The footer is always ink, so the reversed lockup is always right. */}
            <Logo variant="lockup" height={40} reversed />
            <p className="mt-6 text-h4 text-onpunct [text-wrap:balance]">
              Media, creative and engineering run as one accountable loop —
              with a named specialist on every part of your account.
            </p>
          </div>

          <div className="shrink-0">
            <Button href={PRIMARY_CTA.href} surface="dark">
              {PRIMARY_CTA.label}
            </Button>
          </div>
        </div>

        <Rule tone="dark" className="mt-14" />

        <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-3 lg:grid-cols-5">
          {/* Services grouped by practice — §21.4, wireframe.md §12. */}
          {PRACTICE_NAV.map((practice) => (
            <FooterColumn
              key={practice.id}
              title={practice.name}
              links={practice.services}
            />
          ))}
          <FooterColumn title="Company" links={COMPANY_NAV} />
          <FooterColumn title="Proof" links={PROOF_NAV} />
        </div>

        <Rule tone="dark" className="mt-16" />

        {/* CONTACT + SOCIAL — the two things a visitor at the end of the page
            is actually looking for, given equal weight on one line. */}
        <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-2">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex w-fit items-center text-h4 text-onpunct [min-height:var(--touch-min)] transition-colors hover:text-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            >
              {CONTACT_EMAIL}
            </a>
            <p className="text-small text-onpunct-2">{REGION_LINE}</p>
          </div>

          <div>
            <h2 className="font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-blue-500">
              Follow
            </h2>
            <ul className="mt-4 flex flex-wrap items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <Social key={social.label} label={social.label} href={social.href} />
              ))}
            </ul>
          </div>
        </div>

        <Rule tone="dark" className="mt-12" />

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-small text-onpunct-2">
            © {new Date().getFullYear()} Trenvo Media
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
