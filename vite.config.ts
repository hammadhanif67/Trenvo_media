import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],

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
