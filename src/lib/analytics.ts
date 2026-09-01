/* ---------------------------------------------------------------------------
   ANALYTICS — cookieless, endpoint-agnostic, and OFF unless configured.

   WHAT THIS IS NOT: a vendor snippet. No third-party script is loaded, which
   is what lets the Content-Security-Policy in vercel.json stay strict — see
   the `script-src` note there. Adding a tag manager would mean loosening the
   CSP to allow arbitrary remote script execution, and that trade is not worth
   making for a marketing site.

   HOW IT WORKS: events are POSTed as JSON to VITE_ANALYTICS_ENDPOINT with
   `navigator.sendBeacon` where available, falling back to `fetch(keepalive)`.
   Any endpoint that accepts a JSON body works — Plausible, Umami, a Cloudflare
   Worker, or an internal collector.

     VITE_ANALYTICS_ENDPOINT   the collector URL. UNSET = analytics disabled.
     VITE_ANALYTICS_SITE_ID    optional site identifier sent with each event.

   NO SECRET IS EVER READ HERE. Anything prefixed VITE_ is compiled into the
   client bundle and is world-readable by definition, so only public values may
   appear. An API key belongs in a serverless function, never in this file.

   NO COOKIES, NO localStorage, NO DEVICE IDENTIFIER, NO CROSS-SITE STATE. There
   is no per-visitor id of any kind, which is why /privacy can say the site sets
   no analytics cookie and shows no consent banner — that claim is only safe
   because this module makes it structurally true.
--------------------------------------------------------------------------- */

/**
 * The event vocabulary. A closed union rather than a free string: an
 * unrecognised event name in a dashboard is indistinguishable from a missing
 * one, and a typo would be invisible until someone went looking for the data.
 */
export type AnalyticsEvent =
  | 'page_view'
  | 'cta_click'
  | 'nav_cta_click'
  | 'service_cta_click'
  | 'teardown_cta_click'
  | 'booking_click'
  | 'contact_form_start'
  | 'contact_form_submit'
  | 'contact_form_error'
  | 'outbound_click';

export interface AnalyticsProps {
  /** Where the interaction happened — 'header', 'hero', 'footer', a slug. */
  location?: string;
  /** The visible label of the control, so a dashboard row is readable. */
  label?: string;
  /** Which form, for the form events. */
  form?: string;
  /** Free-form detail. Must never carry anything identifying a person. */
  detail?: string;
}

const ENDPOINT = import.meta.env.VITE_ANALYTICS_ENDPOINT;
const SITE_ID = import.meta.env.VITE_ANALYTICS_SITE_ID;

/** True when a collector is configured. Everything below no-ops when false. */
export const analyticsEnabled = Boolean(ENDPOINT);

export function track(event: AnalyticsEvent, props: AnalyticsProps = {}): void {
  if (typeof window === 'undefined') return;

  if (!analyticsEnabled) {
    // Visible while developing so an event that never fires is obvious, and
    // stripped entirely from the production bundle by the DEV constant.
    if (import.meta.env.DEV) {
      console.debug('[analytics:disabled]', event, props);
    }
    return;
  }

  const payload = JSON.stringify({
    event,
    ...props,
    site: SITE_ID,
    // The URL WITHOUT its query string or hash. A query string can carry an
    // email from a mail-client click-through, and that must not reach a
    // collector.
    path: window.location.pathname,
    referrer: sameOriginSafeReferrer(),
    ts: Date.now(),
  });

  try {
    // sendBeacon survives the page unloading, which is exactly what an outbound
    // or navigation click does.
    if (typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([payload], { type: 'application/json' });
      if (navigator.sendBeacon(ENDPOINT as string, blob)) return;
    }

    void fetch(ENDPOINT as string, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
      // No cookies, in either direction.
      credentials: 'omit',
      mode: 'no-cors',
    }).catch(() => {
      /* Analytics must never surface an error to a visitor. */
    });
  } catch {
    /* Same. A blocked collector is not a site failure. */
  }
}

/**
 * The referrer, reduced to its ORIGIN when it is external and dropped entirely
 * when it is a full URL that might carry a token in its path or query. Enough
 * to tell traffic sources apart, not enough to profile anyone.
 */
function sameOriginSafeReferrer(): string {
  const ref = document.referrer;
  if (!ref) return '';
  try {
    const url = new URL(ref);
    if (url.origin === window.location.origin) return 'internal';
    return url.origin;
  } catch {
    return '';
  }
}
