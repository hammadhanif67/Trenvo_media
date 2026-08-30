# Trenvo Media

Marketing site for Trenvo Media — a performance-marketing company running paid
media, creative production and web engineering as one system.

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

Then copy `.env.example` to `.env`. The build ships a placeholder host until
`VITE_SITE_ORIGIN` and `SITE_ORIGIN` are set, and `npm run audit` fails while
that is the case — deliberately, so a guessed domain can never ship.

## Scripts

| Script              | Does                                                           |
| ------------------- | -------------------------------------------------------------- |
| `npm run dev`       | Vite dev server                                                |
| `npm run build`     | Static build (pre-render + sitemap)                            |
| `npm run preview`   | Serve the built output                                         |
| `npm run typecheck` | `tsc --noEmit`                                                 |
| `npm run lint`      | ESLint (flat config, typescript-eslint, jsx-a11y, react-hooks) |
| `npm run format`    | Prettier                                                       |
| `npm run audit`     | Build-integrity checks — see below                             |
| `npm run brand`     | Regenerate `public/brand/` from `brand/source/`                |
| `npm run video`     | Re-encode `public/video/` from `media-source/`                 |
| `npm run sitemap`   | Regenerate the sitemap                                         |

## `npm run audit`

Runs against the built HTML and fails the build on any violation:

- exactly one `<h1>` per page, and no skipped heading levels
- every internal link resolves to a real route
- **no fabricated-proof language** — the site must never claim a client, a
  result, a statistic or a testimonial it does not have
- head integrity: one `<title>`, one canonical, an absolute `og:image`
- a unique title per route
- the production origin is configured
- social profile URLs are configured

The last two fail today on purpose. They are launch gates, not bugs.

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
  lib/          helpers (cn, schema, site origin)
  styles/       tokens.css (design tokens) → globals.css (Tailwind theme)
  types/        content types
scripts/        build-time: audit, sitemap, video encoding
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

### Media masters

`media-source/` is gitignored. The compressed output in `public/video/` is
committed, so a clean clone builds and deploys without it; `npm run video`
only needs the masters when re-encoding.

---

© Trenvo Media. All rights reserved. This repository is published for
development purposes and is not licensed for reuse.
