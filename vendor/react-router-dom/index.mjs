/**
 * Compatibility shim — see ./README.md
 *
 * react-router-dom@7 is itself only a re-export of react-router. This mirrors
 * it so that vite-react-ssg@0.9.2, which imports from the v6 specifier, keeps
 * resolving under React Router v7 (master.md §28.1 + §28.4).
 *
 * Deliberately does NOT provide `json` (removed in v7). See the standing rule
 * in README.md: no application route may declare a `loader`.
 */
export * from 'react-router';
