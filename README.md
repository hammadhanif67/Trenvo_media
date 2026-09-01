# Trenvo Media

Marketing site for Trenvo Media — a performance-marketing company running paid
media, creative production and measurement as one system.

Static-rendered React. Every route is pre-rendered to HTML at build time, so the
markup is the product: the pages read completely with no JavaScript, and link
previews and crawlers see real content rather than an empty shell.

## Stack

|           |                                                                                            |
| --------- | ------------------------------------------------------------------------------------------ |
| Framework | React 19 · TypeScript 5.9 (`strict`, `noUncheckedIndexedAccess`)                           |
| Build     | Vite 8 · `vite-react-ssg` static pre-rendering                                             |
| Routing   | React Router 7                                                                             |
| Styling   | Tailwind CSS v4 (`@theme inline`) over a CSS custom-property token layer                   |
| Motion    | Framer Motion (`LazyMotion` + `domAnimation`) · GSAP + ScrollTrigger, dynamically imported |
| Icons     | lucide-react                                                                               |
| Assets    | sharp (images) · ffmpeg-static (video)                                                     |

## Getting started

```bash
npm install
npm run dev
```

Then copy `.env.example` to `.env` if you need to override anything. Nothing is
required to build: the production origin defaults to `https://www.trenvomedia.com`,
resolved in one place (`scripts/site-origin.mjs`) and injected into both the
client bundle and the sitemap/robots generators. Set `SITE_URL` only to point a
preview deployment at its own host.

**The origin is the `www` host because that is what answers 200** — the apex
308-redirects to it. Verified against the live domain; see the note in
`scripts/site-origin.mjs`.

**Real business content that is still outstanding is catalogued in
[`CONTENT-REQUIRED.md`](./CONTENT-REQUIRED.md).** None of it blocks a build; all
of it blocks launch.

## Scripts

| Script              | Does                                                           |
| ------------------- | -------------------------------------------------------------- |
| `npm run dev`       | Vite dev server                                                |
| `npm run build`     | Fonts -> pre-render -> 404 -> CSP -> sitemap. See below.        |
| `npm run preview`   | Serve the built output                                         |
| `npm run typecheck` | `tsc --noEmit`                                                 |
| `npm run lint`      | ESLint (flat config, typescript-eslint, jsx-a11y, react-hooks) |
| `npm run format`    | Prettier                                                       |
| `npm run audit`     | Build-integrity checks — see below                             |
| `npm run verify`    | typecheck + lint + build + audit, in that order                |
| `npm run fonts`     | Sync Geist woff2 from the `geist` package into `public/fonts`  |
| `npm run brand`     | Regenerate `public/brand/` from `brand/source/`                |
| `npm run sitemap`   | Regenerate the sitemap and robots.txt                          |
| `npm run hero-images` | Re-encode the hero photography into `public/hero`            |

### What `npm run build` actually does

1. **`sync-fonts.mjs`** — copies the Geist variable woff2 files (and their OFL
   licence) out of the `geist` package into `public/fonts`. Deriving them from
   the dependency means `npm update geist` is the whole upgrade path.
2. **`vite-react-ssg build`** — pre-renders every route to HTML.
3. **`emit-404.mjs`** — copies the pre-rendered branded 404 to `dist/404.html`,
   the filename every static host looks for. Without it a hard 404 serves the
   *platform's* page, because a static host never reaches the router.
4. **`apply-csp.mjs`** — injects a per-page Content-Security-Policy carrying a
   `sha256` hash of exactly the inline scripts that page contains. See
   [`SECURITY-HEADERS.md`](./SECURITY-HEADERS.md).
5. **`generate-sitemap.mjs`** — emits `sitemap.xml` and `robots.txt` from what
   actually shipped, excluding the 404 and anything marked `noindex`.

## `npm run audit`

Runs against the built HTML. Two sections, with different consequences.

**CORRECTNESS — fails the build (exit 1).** These are code defects.

- **Single render:** exactly one `#root` carrying exactly one
  `data-server-rendered` marker, exactly one `<main>`, exactly one `<h1>`
- no skipped heading levels
- every internal link resolves to a built route or a real file
- no `href="#"` or empty-href links — nothing that looks interactive and does
  nothing
- head integrity: one `<title>`, one **absolute** canonical, absolute `og:url`
  and `og:image`
- every indexable route carries full metadata, with a **unique** title *and* a
  unique description
- every sitemap URL corresponds to a page that actually shipped, and every
  indexable route appears in the sitemap
- `robots.txt` references the sitemap with an absolute URL
- `dist/404.html` exists
- **no fabricated-proof language** — including "trusted by growth-focused
  brands" and "no quote published yet", both of which shipped once
- every spacing utility is on the §25.1 scale (an off-scale class compiles to
  *nothing*, silently)

**LAUNCH GATES — reported, not failed.** Real business content nobody can fix in
code: published teardowns, a case study, and the social profile URLs. A
permanently red CI teaches everyone to ignore it, so these are listed loudly
instead. `npm run audit -- --strict` promotes them to failures, which is what
the pre-launch check should run.

### Why the single-render check exists

`vite-react-ssg` chooses `hydrateRoot` over `createRoot` by sniffing for
`[data-server-rendered=true]`. If that marker ever goes missing while `#root`
still holds pre-rendered markup — a minifier stripping unknown `data-*`
attributes, a CDN optimiser, a stale `index.html` shipped against fresh JS —
React 19's `createRoot` **appends** rather than replacing, mounting a second
copy of the whole page underneath the first. Two `<main>`s, two `<h1>`s, and a
first copy that is inert HTML, so every menu and button appears dead.

Three layers guard it: `src/lib/mountGuard.ts` reconciles the marker before the
library reads it, a dev-only assertion reports duplicates in the browser
(`window.__TRENVO_RENDER_AUDIT__`), and this audit checks the shipped HTML.

## Deployment

The build emits **directory-style** output — `about/index.html`,
`services/meta-ads/index.html` — rather than `about.html`. `index.html` is the
one filename every static host resolves without configuration, so the site
deploys correctly on Vercel, Netlify, S3, GitHub Pages or a bare nginx with no
host-specific rewrite rules.

`vercel.json` pins the build command, output directory and caching, so nothing
depends on framework auto-detection.

`vercel.json` also carries the **301 redirects** for the routes that moved, and
the response-header half of the security policy (`frame-ancestors`,
`Permissions-Policy`, HSTS) — see [`SECURITY-HEADERS.md`](./SECURITY-HEADERS.md).

| From | To |
|---|---|
| `/specialists` | `/about#specialists` |
| `/legal/privacy` | `/privacy` |
| `/legal/terms` | `/terms` |
| `/services/video-editing` | `/services/short-form-video-ads` |

**Environment variables.** None are required — the origin defaults to
`https://www.trenvomedia.com`. Set them to change behaviour:

| Variable | Why |
|---|---|
| `SITE_URL` | Override the origin, e.g. for a preview deployment. One variable, used by the client build, the sitemap and robots. |
| `RESEND_API_KEY` + `LEAD_TO_EMAIL` | Deliver contact-form leads by email |
| `LEAD_WEBHOOK_URL` | ...or POST them anywhere (Zapier, a CRM, Slack) |
| `VITE_ANALYTICS_ENDPOINT` | Turn on the cookieless analytics collector |

Full notes in `.env.example`.

⚠ **Never set `SITE_URL` to an empty string.** Production previously had
`SITE_ORIGIN` defined but blank, and the old `??` fallback did not catch it, so
the live site shipped `canonical="/"`, `og:url="/"`, `og:image="/brand/..."` and
a sitemap of relative `<loc>` values — every one of them silently ignored by
crawlers and link scrapers. `resolveOrigin()` now treats blank as unset, but
leaving the variable undefined is cleaner than setting it empty.

DNS is live: `https://www.trenvomedia.com` returns 200 from Vercel, the apex and
`http://` both 308 to it.

### The lead form

`/contact` and `/teardown` POST to `/api/contact` (a serverless function), which
dispatches to whichever provider is configured above. With **none** configured
it answers `503 not_configured` and the form falls back to a pre-filled
`mailto:` — so a lead is never silently swallowed, and the form never shows a
green tick for a message it discarded. Validation lives in
`src/lib/leadForm.ts`, which both the React form and the API handler import, so
a field cannot be checked on the client and accepted unchecked on the server.

## Layout

```
src/
  app/          route table
  layouts/      root layout (header, main, footer, skip link)
  pages/        one file per route
  sections/     page sections — home/, service/, shared/
  components/
    ui/         primitives (Button, Section, Container, Heading, …)
    navigation/ navbar, mega-menu, mobile nav, footer
    media/      logo, loop diagram, video, marquees, social marks
    motion/     scroll-entrance wrapper
    cards/      composed content blocks
  data/         all copy and content, typed
  hooks/        theme, reduced motion, focus trap, scroll-linked motion
  lib/          helpers (cn, schema, site origin, analytics, mount guard,
                lead-form validation shared with the API)
  styles/       tokens.css (design tokens) → globals.css (Tailwind theme)
  types/        content types
api/            serverless functions (the lead endpoint)
scripts/        build-time: fonts, 404, CSP, sitemap, audit
brand/          logo sources + generator for public/brand
vendor/         local compat shim (see below)
```

Content lives in `src/data/`, never inline in components, so copy can change
without touching markup.

### Accessibility and motion

Targets WCAG 2.2 AA. `prefers-reduced-motion: reduce` is treated as a
first-class state, not a fallback: entrance animations, the marquees and the
scroll-linked motion do not run, and every affected element renders in its
final, fully legible state.

Nothing is ever left hidden waiting on JavaScript — scroll-entrance elements
play a keyframe when they scroll in rather than being parked at `opacity: 0`,
so a missing observer or a throttled tab degrades to "already visible".

### `vendor/react-router-dom`

`vite-react-ssg` imports `react-router-dom/server.js`, which React Router 7
removed. `vendor/react-router-dom` is a small local shim that re-exports the
v7 equivalents, wired in through an npm `overrides` entry. It exists solely to
bridge that gap and should be deleted once `vite-react-ssg` supports v7
directly.

### Typography

Geist and Geist Mono are self-hosted as **variable** woff2 — one 69kB file per
family covering the whole weight axis, rather than four static cuts.

`--font-sans` listed `'Geist'` first for a long time with **no `@font-face` rule
anywhere in the project**, so the brand face silently never loaded on any
machine that had not installed it manually. It loads now, is preloaded, and
swaps against a metrics-matched fallback (`size-adjust`, `ascent-override`) so
the swap changes letterforms without reflowing the page.

### Media masters

`media-source/` is gitignored. The compressed output in `public/video/` is
committed, so a clean clone builds and deploys without it. The masters are only
needed when re-encoding.

---

© Trenvo Media. All rights reserved. This repository is published for
development purposes and is not licensed for reuse.
