import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolveOrigin } from './scripts/site-origin.mjs';

/**
 * The production origin, resolved ONCE here and injected as a compile-time
 * constant. src/lib/site.ts reads `__SITE_ORIGIN__`; the sitemap and robots
 * generators import the same resolver. The domain is written down in exactly
 * one file — scripts/site-origin.mjs — so canonical, og:url, JSON-LD, the
 * sitemap and robots.txt cannot disagree with each other.
 */
const SITE_ORIGIN = resolveOrigin();

export default defineConfig({
  plugins: [react(), tailwindcss()],

  define: {
    __SITE_ORIGIN__: JSON.stringify(SITE_ORIGIN),
  },

  build: {
    // The hero backdrop and the WebGL field are the only large chunks; keeping
    // the warning at the default 500kB surfaces a regression rather than
    // normalising one.
    chunkSizeWarningLimit: 600,
  },

  /*
    DIRECTORY-STYLE OUTPUT. The default emits `about.html` and
    `services/meta-ads.html`, which only resolves if the host happens to append
    `.html` for extensionless URLs. Measured against a strict static server,
    every route except `/` returned 404 — and `/services` was worse than a 404:
    `services.html` and a `services/` directory both existed, so the request
    301'd into a directory with no index and dead-ended.

    `dirStyle: 'nested'` emits `about/index.html` and
    `services/meta-ads/index.html` instead. `index.html` is the one filename
    every static host resolves without configuration, and the name collision
    disappears because `services/index.html` and `services/meta-ads/index.html`
    nest rather than compete. The site then deploys correctly on Vercel,
    Netlify, S3, GitHub Pages or a bare nginx, with no host-specific rules.
  */
  ssgOptions: {
    dirStyle: 'nested',
  },
});
