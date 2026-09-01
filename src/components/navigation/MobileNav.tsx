import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { m } from 'framer-motion';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Button, Icon } from '../ui';
import { SurfaceContext } from '../ui/surface';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import {
  LOOP_LINK,
  PRACTICE_NAV,
  PRIMARY_CTA,
  PRIMARY_NAV,
  SECONDARY_CTA,
  type PracticeNav,
} from '../../data/navigation';

/* ---------------------------------------------------------------------------
   MOBILE NAV — master.md §26.2, §15.1

   §15.1, verbatim: "full-screen overlay panel, not a collapsed list. Practices
   are the top level; services are nested one tap deep. The `Start a project`
   action is pinned to the bottom of the panel within thumb reach. This is the
   'intentionally designed rather than simply collapsed' requirement ... a
   three-practice model is easier to navigate as two shallow taps than as one
   long scroll."

   §27.2 #6 — 240ms slide + fade, focus trapped. Disabled under §27.4.
   §30.2 — focus trapped while open, restored on close.

   The panel is dark (--ink), so it provides SurfaceContext 'dark' and the
   pinned Button resolves to --blue-500 automatically (§23.2, §23.3).
--------------------------------------------------------------------------- */

const SLIDE_DURATION_S = 0.24; // §27.2 #6 — 240ms

export interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  // §15.1 — two shallow taps: practices, then that practice's services.
  const [practice, setPractice] = useState<PracticeNav | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useFocusTrap(panelRef, open);

  // §30.2 — Escape closes and focus is restored (restoration lives in the trap).
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    // The panel is full-screen; the page behind it must not scroll.
    //
    // Locking document.body alone is NOT enough: in this layout <html> is the
    // scrolling element, so body{overflow:hidden} leaves the page scrolling
    // behind the open panel. Measured before the fix: the page moved 0 -> 500px
    // with the menu open. Both elements are locked, and both are restored.
    const root = document.documentElement;
    const previousBodyOverflow = document.body.style.overflow;
    const previousRootOverflow = root.style.overflow;
    document.body.style.overflow = 'hidden';
    root.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      root.style.overflow = previousRootOverflow;
    };
  }, [open, onClose]);

  // Always reopen at the top level.
  useEffect(() => {
    if (!open) setPractice(null);
  }, [open]);

  const close = () => {
    setPractice(null);
    onClose();
  };

  const itemClass =
    'flex w-full items-center justify-between gap-4 border-b border-hairline py-5 text-left text-h4 text-onpunct [min-height:var(--touch-min)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500';

  /*
    No exit animation, for the same reason as MegaMenu: an AnimatePresence exit
    leaves the node connected, and this one is `fixed inset-0`, so a lingering
    invisible overlay would cover the entire page and keep its links focusable.
    §27.2 #6 specifies the OPEN transition ("240ms slide + fade, focus
    trapped"); no exit is documented, and §27.3 ships nothing that is not on
    that list. Recorded in implementation.md §5.3.
  */
  if (!open) return null;

  return (
    <SurfaceContext.Provider value="dark">
      <m.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        initial={reducedMotion ? false : { opacity: 0, x: '100%' }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: reducedMotion ? 0 : SLIDE_DURATION_S, ease: 'easeOut' }}
        className="fixed inset-0 z-[60] flex flex-col bg-punct lg:hidden"
      >
        <div className="flex items-center justify-between border-b border-hairline [padding-inline:var(--gutter)] py-4">
          <span className="font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-onpunct-2">
            {practice ? practice.name : 'Menu'}
          </span>
          <button
            type="button"
            onClick={close}
            aria-label="Close navigation"
            className="inline-flex items-center justify-center text-onpunct [min-height:var(--touch-min)] [min-width:var(--touch-min)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          >
            <Icon icon={X} size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto [padding-inline:var(--gutter)]">
          {practice === null ? (
            <nav aria-label="Primary">
              <ul>
                {/* Level one: the practices (§15.1). */}
                {PRACTICE_NAV.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => setPractice(p)}
                      aria-label={`${p.name} services`}
                      className={cn(itemClass, 'font-sans')}
                    >
                      {p.name}
                      <Icon icon={ArrowRight} />
                    </button>
                  </li>
                ))}
                {PRIMARY_NAV.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} onClick={close} className={itemClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
                {/*
                  Contact is not in PRIMARY_NAV — the desktop header carries it
                  as the secondary action beside the CTA button. On mobile there
                  is no such row, so it is listed here explicitly. "Contact must
                  be reachable in one click" holds on both.
                */}
                <li>
                  <Link to={SECONDARY_CTA.href} onClick={close} className={itemClass}>
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to={LOOP_LINK.href} onClick={close} className={itemClass}>
                    <span className="font-mono text-label uppercase [letter-spacing:var(--tracking-label)]">
                      The Loop
                    </span>
                    <Icon icon={ArrowRight} />
                  </Link>
                </li>
              </ul>
            </nav>
          ) : (
            <nav aria-label={`${practice.name} services`}>
              <button
                type="button"
                onClick={() => setPractice(null)}
                className="flex items-center gap-2 py-5 text-small text-onpunct-2 [min-height:var(--touch-min)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
              >
                <Icon icon={ArrowLeft} />
                All practices
              </button>
              <p className="pb-4 text-body text-onpunct-2">{practice.question}</p>
              <ul>
                {practice.services.map((service) => (
                  <li key={service.href}>
                    <Link to={service.href} onClick={close} className={itemClass}>
                      {service.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>

        {/* §15.1 — pinned to the bottom of the panel, within thumb reach. */}
        <div className="border-t border-hairline [padding-inline:var(--gutter)] py-4">
          <Button href={PRIMARY_CTA.href} onClick={close} className="w-full">
            {PRIMARY_CTA.label}
          </Button>
          <Link
            to={SECONDARY_CTA.href}
            onClick={close}
            className="mt-3 flex w-full items-center justify-center text-small text-onpunct-2 [min-height:var(--touch-min)] underline-offset-4 hover:text-onpunct focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          >
            {SECONDARY_CTA.label}
          </Link>
        </div>
      </m.div>
    </SurfaceContext.Provider>
  );
}
