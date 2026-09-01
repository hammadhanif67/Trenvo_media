import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Icon } from '../ui';
import { LOOP_LINK, MEGA_MENU_CTA, PRACTICE_NAV } from '../../data/navigation';

/* ---------------------------------------------------------------------------
   MEGA MENU — master.md §26.2, §11.2, §15.1

   §11.2 justifies the pattern: "the mega-menu is the only place the
   three-practice model can be taught to a visitor who arrived on a deep page
   and never saw the homepage. That is a genuine information job, which is the
   only justification for the pattern."

   §15.1 — "Services opens a three-column mega-menu on hover *and* on
   click/keyboard, with a 150ms intent delay to prevent accidental opening."

   §15.1 keyboard — "a proper disclosure widget: Escape closes and returns
   focus, arrow keys move within the menu, Tab exits it."

   §27.2 #5 — 180ms height + fade, 150ms intent delay. Disabled under reduced
   motion (§27.4).

   Deliberately NOT role="menu": that ARIA pattern implies application-style
   keyboard semantics where Tab does not move between items. This is a
   navigation disclosure containing links, which is what §30.6 means by "ARIA is
   used only where native HTML cannot express the semantics".
--------------------------------------------------------------------------- */

const INTENT_DELAY_MS = 150; // §15.1, §27.2 #5

export interface MegaMenuProps {
  /** Header is overlaying a dark hero, so links must render light. §15.1 */
  onDark: boolean;
}

export function MegaMenu({ onDark }: MegaMenuProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const intentTimer = useRef<number | undefined>(undefined);

  const clearIntent = () => {
    if (intentTimer.current !== undefined) {
      window.clearTimeout(intentTimer.current);
      intentTimer.current = undefined;
    }
  };

  // §15.1 — 150ms intent delay "to prevent accidental opening".
  const openWithIntent = () => {
    clearIntent();
    intentTimer.current = window.setTimeout(() => setOpen(true), INTENT_DELAY_MS);
  };
  const closeWithIntent = () => {
    clearIntent();
    intentTimer.current = window.setTimeout(() => setOpen(false), INTENT_DELAY_MS);
  };

  useEffect(() => clearIntent, []);

  /** §15.1 — Escape closes and returns focus to the trigger. */
  const closeAndRestore = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeAndRestore();
      }
    };

    // Tab exits the menu (§15.1): closing on focus leaving the wrapper is what
    // makes that true without trapping focus.
    const onFocusIn = (event: FocusEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };

    // A pointer press anywhere outside closes it. focusin alone was not
    // enough: clicking a non-focusable area (or tapping on a touch device)
    // left the panel open with no way to dismiss it but Escape.
    const onPointerDown = (event: Event) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open, closeAndRestore]);

  /** §15.1 — arrow keys move within the menu. */
  const links = useCallback(
    () =>
      Array.from(panelRef.current?.querySelectorAll<HTMLAnchorElement>('a[href]') ?? []),
    [],
  );

  /*
    §15.1 — "arrow keys move within the menu".

    Bound to the panel node in an effect rather than passed as an onKeyDown
    prop. As a prop on the panel element it is a keyboard listener on a
    non-interactive container, which is exactly what
    jsx-a11y/no-noninteractive-element-interactions exists to catch. The
    behaviour is identical either way — this is roving focus for a disclosure
    widget, not an interactive element — so binding it directly is the honest
    fix rather than suppressing the rule.
  */
  useEffect(() => {
    const panel = panelRef.current;
    if (!open || !panel) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      const items = links();
      if (items.length === 0) return;
      event.preventDefault();
      const index = items.indexOf(document.activeElement as HTMLAnchorElement);
      const next =
        event.key === 'ArrowDown'
          ? items[(index + 1 + items.length) % items.length]
          : items[(index - 1 + items.length) % items.length];
      next?.focus();
    };

    panel.addEventListener('keydown', onKeyDown);
    return () => panel.removeEventListener('keydown', onKeyDown);
  }, [open, links]);

  /**
   * §15.1 — ArrowDown from the trigger opens the menu and moves into it.
   *
   * The focus must wait for the panel to mount. requestAnimationFrame is too
   * early: AnimatePresence renders the panel on the next React commit, so the
   * frame callback still sees an empty panel. A ref consumed by an effect keyed
   * on `open` runs after that commit, which is the first moment the links exist.
   */
  const focusFirstOnOpen = useRef(false);

  useEffect(() => {
    if (!open || !focusFirstOnOpen.current) return;
    focusFirstOnOpen.current = false;
    links()[0]?.focus();
    // `links` is memoised with an empty dep list, so listing it here is free.
  }, [open, links]);

  const onTriggerKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusFirstOnOpen.current = true;
      setOpen(true);
    }
  };

  return (
    /*
      §15.1 requires the menu to open on hover AS WELL AS on click and keyboard.

      jsx-a11y flags mouse handlers on a non-interactive element because they
      normally hide functionality from keyboard users. They do not here: the
      trigger below is a real <button> carrying the full click and keyboard
      path, and hover is pure enhancement. This wrapper exists only so that
      leaving BOTH the trigger and the panel can be detected as one region.
    */
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div ref={wrapperRef} onMouseEnter={openWithIntent} onMouseLeave={closeWithIntent}>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        /*
          `aria-haspopup="true"` tells a screen-reader user that activating this
          reveals something, BEFORE they activate it. aria-expanded alone only
          reports the current state and leaves them to infer the rest.

          The value is the generic `true` rather than `menu`: `menu` would
          promise the application-style keyboard semantics of role="menu", where
          Tab does not move between items. This panel is navigation containing
          links and Tab works normally inside it, so announcing `menu` would
          describe behaviour it does not have.
        */
        aria-haspopup="true"
        onClick={() => {
          clearIntent();
          setOpen((v) => !v);
        }}
        onKeyDown={onTriggerKeyDown}
        className={cn(
          'inline-flex items-center gap-1 text-small font-medium',
          '[min-height:var(--touch-min)] px-2',
          'focus-visible:outline-2 focus-visible:outline-offset-2',
          onDark
            ? 'text-onpunct focus-visible:outline-blue-500'
            : 'text-primary focus-visible:outline-accent',
        )}
      >
        Services
        <Icon
          icon={ChevronDown}
          className={cn('transition-transform duration-[180ms]', open && 'rotate-180')}
        />
      </button>

      {/*
        Rendered conditionally with NO exit animation, so the panel unmounts the
        instant it closes.

        An AnimatePresence exit left the node connected at height:0 / opacity:0
        with visibility:visible — which keeps its links in the tab order.
        A keyboard user would tab into invisible navigation, breaking §30.2. The
        exit was also undocumented: §27.2 #5 specifies the OPEN transition
        ("180ms height + fade, 150ms intent delay") and nothing else, and §27.3
        ships no motion that is not on that list. Removing it is both the
        correct fix and the more faithful one. Recorded in implementation.md §5.3.
      */}
      {open && (
        <nav
          id={panelId}
          ref={panelRef}
          aria-label="Services"
          /*
            ⚠ SLIDES IN FROM THE RIGHT, on request. §27.2 #5 specifies "180ms
            height + fade" for this menu; the 180ms and the fade are kept, and
            the height grow is replaced by a horizontal slide. Recorded in
            implementation.md §5.22.

            A CSS keyframe rather than Framer's initial/animate: Framer parks
            the node at `initial` and needs a frame to leave it, and measured in
            a throttled tab the drawer sat fully off-screen at a right edge of
            1664px in a 1280px viewport. A keyframe applies `from` only while
            running, so if it never runs the panel is simply already in place.
            See the .drawer-in block in globals.css.

            `fixed`, not `absolute`: anchored to the viewport's right edge and
            running from under the header to the bottom of the screen, so the
            header's own box cannot clip it. --header-h is published by Navbar
            from a real measurement.
          */
          className="drawer-in fixed right-0 top-[var(--header-h,4.5rem)] z-50 flex h-[calc(100dvh-var(--header-h,4.5rem))] w-full max-w-sm flex-col overflow-y-auto border-l border-hairline bg-base"
        >
          {/*
              Anchored to the header, not the trigger. Centring a 928px panel
              on the Services button pushed its left edge to -170px at 1024,
              clipping the Media column off-screen. Spanning the header and
              constraining inside cannot overflow at any width.

              §22.2 principle 4 — structure is visible: hairlines, not shadows.
            */}
          <div className="flex min-h-full w-full flex-col">
            <div className="flex-1">
              <div className="flex flex-col">
                {PRACTICE_NAV.map((practice, i) => (
                  <div
                    key={practice.id}
                    className={cn('p-6', i > 0 && 'border-t border-hairline')}
                  >
                    <p className="font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-secondary">
                      {practice.name}
                    </p>
                    <ul className="mt-4 space-y-1">
                      {practice.services.map((service) => (
                        <li key={service.href}>
                          <Link
                            to={service.href}
                            onClick={() => setOpen(false)}
                            className="flex items-center text-body text-primary [min-height:var(--touch-min)] hover:text-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                          >
                            {service.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* §11.2 — "the highest-value pixel in the navigation". */}
              <div className="flex flex-col items-start gap-4 border-t border-hairline p-6">
                <Link
                  to={LOOP_LINK.href}
                  onClick={() => setOpen(false)}
                  className="group inline-flex items-center gap-2 text-body text-primary [min-height:var(--touch-min)] hover:text-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <span className="font-mono text-label uppercase [letter-spacing:var(--tracking-label)]">
                    The Loop
                  </span>
                  <span className="text-secondary">
                    — how the two practices work as one system
                  </span>
                  <Icon icon={ArrowRight} />
                </Link>

                <Link
                  to={MEGA_MENU_CTA.href}
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center border border-hairline px-6 text-small font-medium text-primary [min-height:var(--touch-min)] hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {MEGA_MENU_CTA.label}
                </Link>
              </div>
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}
