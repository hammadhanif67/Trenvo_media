/**
 * Types for scripts/site-origin.mjs, so vite.config.ts (which IS in the
 * TypeScript program) can import the origin resolver without `any`.
 */
export declare const DEFAULT_ORIGIN: string;
export declare const SITE_ORIGIN: string;
export declare function resolveOrigin(env?: Record<string, string | undefined>): string;
export declare function absoluteUrl(pathname: string, origin?: string): string;
