/// <reference types="vite/client" />

/**
 * The production origin, injected at build time by vite.config.ts from
 * scripts/site-origin.mjs. Declaring it here is what lets src/lib/site.ts read
 * it without reaching for process.env, which does not exist in the browser.
 */
declare const __SITE_ORIGIN__: string;

/**
 * Build-time configuration read by src/lib/analytics.ts and the contact form.
 * Merged into Vite's own ImportMetaEnv, so `import.meta.env` stays typed.
 */
interface ImportMetaEnv {
  readonly VITE_ANALYTICS_ENDPOINT?: string;
  readonly VITE_ANALYTICS_SITE_ID?: string;
  readonly VITE_CONTACT_ENDPOINT?: string;
}

/**
 * Router hydration state that vite-react-ssg emits inline into every
 * prerendered page, just before the closing tag of #root.
 *
 * src/main.tsx feeds it to createBrowserRouter so the router is initialized on
 * the first render pass. Without it the router must resolve the loaders the
 * library injects, renders nothing meanwhile, and hydration mismatches into a
 * duplicated application tree. See the header of src/main.tsx.
 */
interface Window {
  __staticRouterHydrationData?: {
    loaderData?: Record<string, unknown>;
    actionData?: Record<string, unknown> | null;
    errors?: Record<string, unknown> | null;
  };
}
