/**
 * CONTENT-SECURITY-POLICY — injected per page, with real script hashes.
 *
 *   node scripts/apply-csp.mjs      (runs after `npm run build`)
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS A BUILD STEP AND NOT A LINE IN vercel.json
 *
 * A useful CSP has to allow the page's own inline scripts and nothing else.
 * There are three of them here and they are all load-bearing:
 *
 *   1. the theme resolver in index.html, which MUST be inline and synchronous —
 *      a deferred script would let a dark-mode visitor see a white flash
 *   2. `window.__staticRouterHydrationData = ...`, emitted per page by
 *      vite-react-ssg
 *   3. `window.__VITE_REACT_SSG_HASH__ = ...`, likewise
 *
 * The usual ways to allow those are all wrong here:
 *
 *   · `'unsafe-inline'` allows EVERY inline script, which is most of what a CSP
 *     is for. It is what almost every static site ships, and it means the policy
 *     stops an attacker from loading a remote script while doing nothing about
 *     an injected inline one.
 *   · A nonce must be unique per RESPONSE, which a static file server cannot do
 *     — the same bytes go to everyone.
 *   · A hash list in vercel.json cannot work either: hydration data differs per
 *     page, so there is no single set of hashes valid for the whole site.
 *
 * So the policy is computed per page and injected as a <meta http-equiv> tag,
 * carrying the exact sha256 of exactly the scripts that page actually contains.
 * Any injected inline script has a different hash and does not run.
 *
 * ---------------------------------------------------------------------------
 * WHAT STAYS IN vercel.json
 *
 * `frame-ancestors`, `report-uri` and `sandbox` are IGNORED in a meta-tag CSP by
 * specification, so clickjacking protection has to come from a real response
 * header. vercel.json carries frame-ancestors plus X-Frame-Options as the
 * belt-and-braces version, along with Permissions-Policy.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const DIST = 'dist';

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const sha256 = (source) =>
  `'sha256-${createHash('sha256').update(source, 'utf8').digest('base64')}'`;

/**
 * The analytics collector, if one is configured. It is the ONLY host the page
 * is allowed to talk to, and it is absent from the policy entirely when
 * unconfigured — see src/lib/analytics.ts.
 */
const ANALYTICS = process.env.VITE_ANALYTICS_ENDPOINT;
const analyticsOrigin = ANALYTICS ? new URL(ANALYTICS).origin : null;

function policyFor(inlineHashes) {
  const connect = ["'self'"];
  if (analyticsOrigin) connect.push(analyticsOrigin);

  return [
    // Nothing is allowed by default. Every directive below is an exception
    // that had to be justified.
    `default-src 'self'`,

    // Own bundle plus the exact inline scripts this page contains. No CDN, no
    // tag manager, no 'unsafe-inline', no 'unsafe-eval'.
    `script-src 'self' ${inlineHashes.join(' ')}`,

    /*
      'unsafe-inline' IS required for styles, and only for styles.

      React writes `style` attributes for the few genuinely dynamic values on
      this site — the hero client-wordmark colours, the mobile action bar's
      safe-area padding, the measured --header-h. CSP treats a style ATTRIBUTE
      as inline style, and the alternative ('unsafe-hashes' plus a hash per
      distinct attribute value) is both worse supported and no more restrictive
      in practice. The risk profile of injected CSS is far below injected
      script, which is the one this policy is actually built around.
    */
    `style-src 'self' 'unsafe-inline'`,

    // Self-hosted fonts only. No Google Fonts, no CDN.
    `font-src 'self'`,

    // data: is needed for the inline SVG data URIs in the CSS.
    `img-src 'self' data:`,

    // The lead endpoint and, if configured, the analytics collector.
    `connect-src ${connect.join(' ')}`,

    // This site embeds nothing and is embedded by nothing.
    `frame-src 'none'`,
    `object-src 'none'`,
    `media-src 'self'`,
    `worker-src 'self'`,

    // A <base> tag injection would silently repoint every relative URL.
    `base-uri 'self'`,

    // The lead form may only post to this origin.
    `form-action 'self'`,

    // Never mix in plaintext subresources.
    `upgrade-insecure-requests`,
  ].join('; ');
}

const files = walk(DIST).filter((f) => f.endsWith('.html'));
let patched = 0;

for (const file of files) {
  let html = readFileSync(file, 'utf8');

  // Already applied (idempotent — the script may be run twice in a pipeline).
  if (html.includes('http-equiv="Content-Security-Policy"')) continue;

  /*
    Hash every inline script. `<script src=...>` bodies are empty and are
    covered by 'self' instead, so only scripts with actual content contribute a
    hash. The captured text must be byte-identical to what the browser hashes,
    which is why the body is taken verbatim with no trimming.
  */
  const hashes = new Set();
  for (const [, attrs, body] of html.matchAll(
    /<script([^>]*)>([\s\S]*?)<\/script>/g,
  )) {
    if (/\ssrc=/.test(attrs)) continue;
    // JSON-LD is data, not executable script, and browsers do not hash it.
    if (/type=["']application\/ld\+json["']/.test(attrs)) continue;
    if (body.length === 0) continue;
    hashes.add(sha256(body));
  }

  const meta = `<meta http-equiv="Content-Security-Policy" content="${policyFor([...hashes])}">`;

  /*
    FIRST inside <head>, before anything it governs. A CSP meta tag has no
    effect on content that appears above it, and the theme resolver sits high in
    the head — so injecting after it would leave the one script that most needs
    covering outside the policy.
  */
  const headOpen = html.match(/<head[^>]*>/);
  if (!headOpen) {
    console.warn(`  apply-csp: no <head> in ${file}, skipped`);
    continue;
  }

  html = html.replace(headOpen[0], `${headOpen[0]}${meta}`);
  writeFileSync(file, html);
  patched++;
}

console.log(
  `CSP — applied to ${patched} page(s)` +
    (analyticsOrigin ? `, connect-src allows ${analyticsOrigin}` : ', connect-src is self only'),
);
