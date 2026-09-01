import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { LazyMotion, domAnimation } from 'framer-motion';
import { Menu } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Button, Container, Icon } from '../ui';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Logo } from '../media/Logo';
import { SurfaceContext } from '../ui/surface';
import { MegaMenu } from './MegaMenu';
import { MobileNav } from './MobileNav';
import { useTheme } from '../../hooks/useTheme';
import { PRIMARY_CTA, PRIMARY_NAV, SECONDARY_CTA } from '../../data/navigation';
import { track } from '../../lib/analytics';

/* ---------------------------------------------------------------------------
   NAVBAR — master.md §26.2, §11.2, §15.1

   §15.1 desktop: "sticky header, transparent over the black hero, solidifying
   to white with a hairline border after 80px of scroll."

   §11.2: five items plus one action. Services is the mega-menu trigger; the
   other four are links. Process and Contact are deliberately not here.

   §31.4 requires Framer Motion behind LazyMotion with the domAnimation feature
   set — done once here, so both menus share it and neither pulls the full
   library into the initial bundle.
--------------------------------------------------------------------------- */

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  /*
    Publishes the header's real height as --header-h so the Services drawer can
    start exactly beneath it. Measured rather than hard-coded: the header grows
    when the browser's font size is larger, and a guessed value would leave a
    gap or overlap at those sizes. ResizeObserver keeps it correct across
    breakpoints and zoom without a resize listener.
  */
  const headerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const publish = () =>
      document.documentElement.style.setProperty(
        '--header-h',
        `${el.getBoundingClientRect().height}px`,
      );
    publish();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(publish);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  /*
   * No scroll state and no route check any more. The header used to paint ink
   * while the homepage sat unscrolled, per §15.1's "transparent over the black
   * hero ... solidifying after 80px". Overridden on request — see the block on
   * the <header> below and implementation.md §5.18.
   */

  /**
   * The header is not a Section, so it must apply §23.2's rule itself.
   *
   * In the dark theme the solid header is --ink-soft, so a --blue-600 filled
   * CTA would sit on a dark surface — exactly the pairing §23.2 forbids. The
   * header is dark exactly when the theme is, so the surface follows the theme.
   */
  const theme = useTheme();
  const isDark = theme === 'dark';
  const headerSurface = isDark ? 'dark' : 'light';

  return (
    <LazyMotion features={domAnimation} strict>
      <SurfaceContext.Provider value={headerSurface}>
        <header
          ref={headerRef}
          className={cn(
            'sticky top-0 z-50 w-full',
            // positioning context for the mega-menu panel
            'relative',
            /*
              ⚠ OVERRIDES master.md §15.1, which specifies a header
              "transparent over the black hero, solidifying to white ... after
              80px of scroll". That line was written before the site had a
              light/dark theme. With one, it produces a BLACK header at the top
              of the homepage even in the light theme, which reads as the theme
              having failed to apply — the defect reported. Requested fix: the
              theme decides the header, and nothing else does. Recorded in
              implementation.md §5.18.
            */
            isDark
              ? 'border-b border-hairline bg-punct'
              : 'border-b border-hairline bg-base',
          )}
        >
          <Container>
            <div className="flex items-center justify-between gap-6 py-4">
              <Link
                to="/"
                aria-label="Trenvo Media — home"
                className={cn(
                  'inline-flex items-center [min-height:var(--touch-min)]',
                  'focus-visible:outline-2 focus-visible:outline-offset-2',
                  isDark
                    ? 'focus-visible:outline-blue-500'
                    : 'focus-visible:outline-accent',
                )}
              >
                {/* The link carries the accessible name; the images are
                    decorative (§30.6). Reversed on the ink header. */}
                <Logo
                  variant="lockup"
                  height={28}
                  reversed={isDark}
                />
              </Link>

              {/* §29.1 — desktop nav and mega-menu on at 1024px. */}
              <nav aria-label="Primary" className="hidden items-center gap-2 lg:flex">
                <MegaMenu onDark={isDark} />
                {PRIMARY_NAV.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      'inline-flex items-center px-2 text-small font-medium',
                      '[min-height:var(--touch-min)] [min-width:var(--touch-min)]',
                      'focus-visible:outline-2 focus-visible:outline-offset-2',
                      isDark
                        ? 'text-onpunct-2 hover:text-onpunct focus-visible:outline-blue-500'
                        : 'text-secondary hover:text-primary focus-visible:outline-accent',
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-2">
                <ThemeToggle onDark={isDark} />

                {/* §17.3 — the persistent header action. */}
                {/*
                  Contact sits beside the CTA rather than in PRIMARY_NAV, so it
                  is one click from every page on desktop. The mobile drawer and
                  the sticky action bar carry it on small screens.
                */}
                <div className="hidden items-center gap-2 lg:flex">
                  <Link
                    to={SECONDARY_CTA.href}
                    onClick={() =>
                      track('nav_cta_click', {
                        location: 'header',
                        label: SECONDARY_CTA.label,
                      })
                    }
                    className={cn(
                      'inline-flex items-center px-2 text-small font-medium',
                      '[min-height:var(--touch-min)]',
                      'focus-visible:outline-2 focus-visible:outline-offset-2',
                      isDark
                        ? 'text-onpunct-2 hover:text-onpunct focus-visible:outline-blue-500'
                        : 'text-secondary hover:text-primary focus-visible:outline-accent',
                    )}
                  >
                    Contact
                  </Link>
                  <Button
                    href={PRIMARY_CTA.href}
                    onClick={() =>
                      track('nav_cta_click', {
                        location: 'header',
                        label: PRIMARY_CTA.label,
                      })
                    }
                  >
                    {PRIMARY_CTA.label}
                  </Button>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  aria-label="Open navigation"
                  aria-expanded={mobileOpen}
                  className={cn(
                    'inline-flex items-center justify-center lg:hidden',
                    '[min-height:var(--touch-min)] [min-width:var(--touch-min)]',
                    'focus-visible:outline-2 focus-visible:outline-offset-2',
                    isDark
                      ? 'text-onpunct focus-visible:outline-blue-500'
                      : 'text-primary focus-visible:outline-accent',
                  )}
                >
                  <Icon icon={Menu} size={24} />
                </button>
              </div>
            </div>
          </Container>
        </header>

        <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
      </SurfaceContext.Provider>
    </LazyMotion>
  );
}
