# Security headers

Two layers, because neither can do the other's job.

## 1. Response headers — `vercel.json`

Set on every response. These are the directives a `<meta>` CSP cannot express, plus the
non-CSP security headers.

| Header | Value | Why |
|---|---|---|
| `Content-Security-Policy` | `frame-ancestors 'none'` | Clickjacking. `frame-ancestors` is **ignored** in a meta-tag CSP by specification, so it has to be a real header. |
| `X-Frame-Options` | `DENY` | The older equivalent, for anything that predates `frame-ancestors`. |
| `X-Content-Type-Options` | `nosniff` | Stops a `text/plain` response being executed as script. |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Full path to our own origin, bare origin to others, nothing over a downgrade. |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | No `preload` directive — submitting to the HSTS preload list is effectively irreversible and is the domain owner's decision, not the build's. |
| `Cross-Origin-Opener-Policy` | `same-origin` | Severs the `window.opener` reference to any cross-origin page that opened us. |
| `Permissions-Policy` | everything `()` except `fullscreen=(self)` | The site uses no device APIs at all, so every one is switched off rather than left at the default. `interest-cohort` and `browsing-topics` opt out of ad-topic inference. |

**A note on `Permissions-Policy`:** switching a feature off with `()` means *no origin*,
including this one. `fullscreen=(self)` is the single exception, kept because a future
video case study would need it and re-enabling it later is easy to forget.

## 2. Per-page CSP — `scripts/apply-csp.mjs`

The real content policy is injected into each page's `<head>` at build time, carrying a
`sha256` hash of exactly the inline scripts that page contains.

**Why it is not in `vercel.json`.** A useful CSP has to allow the page's own inline
scripts and nothing else. There are three, all load-bearing:

1. the theme resolver in `index.html` — must be inline and synchronous, or a dark-mode
   visitor sees a white flash
2. `window.__staticRouterHydrationData`, emitted per page by `vite-react-ssg`
3. `window.__VITE_REACT_SSG_HASH__`, likewise

Every conventional way of allowing those is wrong here:

- **`'unsafe-inline'`** allows *every* inline script, which is most of what a CSP is
  for. It is what nearly every static site ships, and it stops a remote script load
  while doing nothing about an injected inline one.
- **A nonce** must be unique per response. A static file server sends the same bytes to
  everyone, so a "nonce" in a static file is a shared secret that is not secret.
- **A hash list in `vercel.json`** cannot work either: hydration data differs per page,
  so no single set of hashes is valid site-wide.

Hence per-page hashes. An injected inline script has a different hash and does not run.

### The policy

```
default-src 'self'
script-src 'self' 'sha256-…' (per page)
style-src 'self' 'unsafe-inline'
font-src 'self'
img-src 'self' data:
connect-src 'self' [+ analytics origin, only if configured]
frame-src 'none'
object-src 'none'
media-src 'self'
worker-src 'self'
base-uri 'self'
form-action 'self'
upgrade-insecure-requests
```

**`style-src` is the one concession.** React writes `style` attributes for the few
genuinely dynamic values here — the measured `--header-h`, the mobile action bar's
safe-area padding, the hero client wordmark colours. CSP treats a style *attribute* as
inline style. The alternative (`'unsafe-hashes'` plus a hash per distinct attribute
value) is worse supported and no more restrictive in practice, and injected CSS is a far
smaller problem than injected script — which is what this policy is built around.

**No third-party script is loaded anywhere on this site.** That is what lets `script-src`
stay this tight, and it is the reason analytics is a small first-party module
(`src/lib/analytics.ts`) posting to a configurable endpoint rather than a vendor tag.
Adding a tag manager would mean allowing arbitrary remote script execution, which is not
a trade worth making for a marketing site.

## Verifying

```bash
npm run build
```

Then check any built page:

```bash
grep -o 'http-equiv="Content-Security-Policy" content="[^"]*"' dist/index.html
```

Response headers can only be verified against a real deployment, since they come from
`vercel.json` rather than from the files:

```bash
curl -sI https://trenvomedia.com/ | grep -i -E 'content-security|permissions|frame|strict-transport'
```

## Not configured here

- **DNS, TLS and the HSTS preload list.** This repository configures the application. It
  does not and cannot configure the domain.
- **Rate limiting at the edge.** `api/contact.js` has a best-effort in-memory limiter,
  but serverless instances are ephemeral and there may be many, so it is a brake rather
  than a boundary. A real limit belongs in the platform's WAF, where it can see every
  instance.
