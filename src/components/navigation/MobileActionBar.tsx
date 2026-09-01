import { useLocation } from 'react-router';
import { Link } from 'react-router';
import { ArrowRight, Mail } from 'lucide-react';
import { Icon } from '../ui';
import { PRIMARY_CTA_SHORT, SECONDARY_CTA } from '../../data/navigation';
import { track } from '../../lib/analytics';

/* ---------------------------------------------------------------------------
   MOBILE ACTION BAR — the sticky bottom conversion bar, phones only.

   On mobile the header CTA scrolls away and the footer is a long way down, so
   for most of a visit there is nothing to tap. This keeps both paths in thumb
   reach without stealing space from the header, which is the other way of
   solving it and makes the header worse.

   ⚠ THREE THINGS IT DELIBERATELY DOES NOT DO

   1. It does not appear on the pages it points at. Offering "Request a free
      teardown" to somebody already reading /teardown is noise, and on /contact
      it would overlap the form's own submit button.

   2. It does not permanently cover anything. It is `position: sticky` and the
      LAST element in the document, so it pins to the viewport bottom while
      there is page left and then comes to rest below the footer — the end of
      the page is always reachable. (A `fixed` bar would need the body's bottom
      padding reserving for it; a sticky one in normal flow does not, which is
      the reason it is sticky.) Mid-scroll it does overlay the content behind
      it, which is what a conversion bar is for, and it is opaque so nothing
      shows through half-legibly.

   3. It is not `position: fixed` over the whole viewport on desktop. It is
      `lg:hidden`, because on desktop the header CTA is always visible and a
      floating bar would be pure clutter.

   Both controls meet the 44px touch target and carry visible focus.
--------------------------------------------------------------------------- */

/** Pages where the bar would be redundant or would collide with the content. */
const SUPPRESSED_ON = new Set(['/teardown', '/contact']);

export function MobileActionBar() {
  const { pathname } = useLocation();

  if (SUPPRESSED_ON.has(pathname)) return null;

  return (
    <div
      /*
        `sticky` inside the document flow rather than `fixed`, so it cannot
        overlap the footer: it parks at the bottom of the viewport while there
        is page left and then sits naturally at the end. `bottom-0` with a
        negative-margin-free flow is what makes that work.
      */
      className="sticky bottom-0 z-40 border-t border-hairline bg-base/95 backdrop-blur-sm lg:hidden"
      /*
        Respects the iOS home indicator. Without it the bar's controls sit
        underneath the gesture area on a modern iPhone and are hard to tap.
      */
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <nav
        aria-label="Quick actions"
        className="flex items-stretch gap-2 [padding-inline:var(--gutter)] py-3"
      >
        <Link
          to={PRIMARY_CTA_SHORT.href}
          onClick={() => track('cta_click', { location: 'mobile-action-bar', label: PRIMARY_CTA_SHORT.label })}
          className="inline-flex flex-1 items-center justify-center gap-2 bg-blue-600 px-4 text-small font-medium text-paper [min-height:var(--touch-min)] transition-transform duration-[80ms] active:scale-[0.98] hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          {PRIMARY_CTA_SHORT.label}
          <Icon icon={ArrowRight} />
        </Link>

        <Link
          to={SECONDARY_CTA.href}
          onClick={() => track('nav_cta_click', { location: 'mobile-action-bar', label: 'Contact' })}
          aria-label="Contact us"
          className="inline-flex items-center justify-center border border-hairline px-4 text-small font-medium text-primary [min-height:var(--touch-min)] [min-width:var(--touch-min)] hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <Icon icon={Mail} />
          <span className="sr-only">Contact</span>
        </Link>
      </nav>
    </div>
  );
}
