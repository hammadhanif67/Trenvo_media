import { Button, Container, Eyebrow, Heading, Section } from '../components/ui';
import { PRACTICE_NAV } from '../data/navigation';
import { Link } from 'react-router';
import { Seo } from '../components/Seo';

/**
 * 404 — wireframe.md §1.1 ("+ /404"), master.md §28.2 (`NotFound.tsx`).
 *
 * §11.1 principle 2: every route earns its existence. A 404 earns its by
 * getting a lost visitor back into the site rather than apologising, so it
 * carries the three practices — the structure §11.2 says the mega-menu exists
 * to teach someone who arrived on a deep page.
 */
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
          <p className="mt-6 max-w-[46ch] text-lead text-onpunct-2 [line-height:var(--lh-body)]">
            The link may be old, or the address may be mistyped. Everything we do sits
            inside three practices — start there.
          </p>
          <div className="mt-10">
            <Button href="/" variant="primary">
              Back to the homepage
            </Button>
          </div>
        </Container>
      </Section>

      <Section tone="paper">
        <Container>
          <div className="grid gap-8 md:grid-cols-3">
            {PRACTICE_NAV.map((practice) => (
              <div key={practice.id}>
                <h2 className="font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-secondary">
                  {practice.name}
                </h2>
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
    </>
  );
}
