import { Link } from 'react-router';
import { Button, Container, Eyebrow, Heading, Section } from '../components/ui';
import { PRACTICE_NAV, PRIMARY_CTA } from '../data/navigation';
import { Seo } from '../components/Seo';

/**
 * 404 — the branded not-found page.
 *
 * ⚠ THIS PAGE HAS TO EXIST AS A FILE, not just as a route.
 *
 * `path: '*'` in the router catches an unmatched CLIENT-SIDE navigation, but a
 * static host never reaches React for an unknown URL — it looks for a file,
 * fails, and serves its own grey default. So app/router.tsx gives this route a
 * `getStaticPaths` returning `/404`, and scripts/emit-404.mjs copies the
 * rendered page to dist/404.html, which is the filename Vercel, Netlify, S3
 * and nginx all look for.
 *
 * §11.1 principle 2: every route earns its existence. A 404 earns its by
 * getting a lost visitor back into the site rather than apologising, so it
 * carries the practices, the proof routes and the offer — the structure §11.2
 * says the mega-menu exists to teach someone who arrived on a deep page.
 *
 * The page is noindex via data/seo.ts.
 */

const ROUTES = [
  { label: 'Services', href: '/services', b: 'Everything we do, in two practices.' },
  { label: 'Work', href: '/work', b: 'Builds, reels and campaigns.' },
  { label: 'Teardowns', href: '/teardowns', b: 'Our analysis of real, public ads.' },
  { label: 'Process', href: '/process', b: 'How the loop actually runs.' },
  { label: 'About', href: '/about', b: 'Who does the work, and what each one owns.' },
  { label: 'Contact', href: '/contact', b: 'Talk to the people who would do it.' },
];

export function NotFound() {
  return (
    <>
      <Seo />

      <Section tone="ink" aria-labelledby="notfound-heading">
        <Container>
          <Eyebrow className="text-onpunct-2">404</Eyebrow>
          <Heading
            level={1}
            size="h1"
            id="notfound-heading"
            className="mt-3 text-onpunct"
          >
            That page does not exist.
          </Heading>
          {/*
            ⚠ "three practices" was wrong here for as long as this page existed
            — there are two, and there have been since the Engineering practice
            was removed. It now reads from PRACTICE_NAV, which is derived from
            the service taxonomy, so it cannot go stale again.
          */}
          <p className="mt-6 max-w-[48ch] text-lead text-onpunct-2 [line-height:var(--lh-body)]">
            The link may be old, or the address may be mistyped. Everything we do sits
            inside {PRACTICE_NAV.length} practices — start there, or go straight to the
            thing most people come here for.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button href={PRIMARY_CTA.href} variant="primary">
              {PRIMARY_CTA.label}
            </Button>
            <Button href="/" variant="secondary">
              Back to the homepage
            </Button>
          </div>
        </Container>
      </Section>

      {/* The practices and their services, derived from data/services.ts. */}
      <Section tone="paper" aria-labelledby="practices-heading">
        <Container>
          <h2
            id="practices-heading"
            className="font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-secondary"
          >
            What we do
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {PRACTICE_NAV.map((practice) => (
              <div key={practice.id}>
                <h3 className="text-h4 text-primary [line-height:var(--lh-heading)]">
                  {practice.name}
                </h3>
                <ul className="mt-4 space-y-1">
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
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Every top-level destination, so a lost visitor has one obvious next
          click whatever they were originally looking for. */}
      <Section tone="surface" aria-labelledby="elsewhere-heading">
        <Container>
          <h2
            id="elsewhere-heading"
            className="font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-secondary"
          >
            Or go here
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ROUTES.map((route) => (
              <li key={route.href}>
                <Link
                  to={route.href}
                  className="flex h-full flex-col border border-hairline bg-base [padding:var(--card-pad)] hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <span className="text-h4 text-primary [line-height:var(--lh-heading)]">
                    {route.label}
                  </span>
                  <span className="mt-2 text-body text-secondary [line-height:var(--lh-body)]">
                    {route.b}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
