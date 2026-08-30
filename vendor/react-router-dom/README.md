# `react-router-dom` — local compatibility shim

**This is not a fork and it contains no application logic.** It is a five-line
re-export package that exists for one reason, recorded here so nobody has to
reverse-engineer it later.

## Why it exists

`master.md` §28.1 fixes the stack at **React Router v7**. `master.md` §28.4 fixes
the renderer at **`vite-react-ssg`**, because every route must ship real static
HTML (§21.7) — without it, link previews for teardowns, the primary distribution
channel for the primary proof asset, would be empty.

Those two decisions collide. `vite-react-ssg@0.9.2` was written against React
Router v6 and its compiled `dist` reaches for three things at v6 specifiers:

| Import                                                                                             | React Router v7 status                                      | Impact                                               |
| -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------- |
| `react-router-dom/server.js` → `createStaticHandler`, `createStaticRouter`, `StaticRouterProvider` | **Subpath removed in v7** — `ERR_PACKAGE_PATH_NOT_EXPORTED` | **Fatal.** Prerender critical path; every page fails |
| `react-router-dom` → `json`                                                                        | **Removed in v7**                                           | Latent — see the standing rule below                 |
| `react-router-dom` → `matchRoutes`, `createBrowserRouter`, `RouterProvider`                        | Present                                                     | Fine                                                 |

`react-router@7.18.3` exports **all six** of those APIs from its root. The break
is purely the specifier path, not missing functionality. The failure happens in
plain Node inside `vite-react-ssg`'s own `dist`, not inside the Vite module
graph, so a Vite `resolve.alias` cannot reach it.

Upstream `react-router-dom@7` is itself nothing but a re-export of
`react-router`, so this package is equivalent to it, plus the `./server.js`
subpath that `vite-react-ssg` still expects. It changes no behaviour.

Decided as **Option A** on 30 August 2026 over the two alternatives in
`master.md` §28.4 — pinning React Router v6 (contradicts §28.1) and changing the
renderer (contradicts §28.4, which already weighed and rejected Next.js, Astro
islands and pre-render plugins). Option A is the only one that preserves the
documented stack in full. See `implementation.md` §3.1.

## Standing architectural rule

> **No application route may declare a `loader` until the `json` compatibility
> gap is explicitly resolved.**

`vite-react-ssg`'s `callRouteLoader` imports `json` from `react-router-dom`, and
v7 removed it. That code path is unreachable while no route defines a `loader`,
which is consistent with `master.md` §26.4 — content comes from typed files in
`src/data/` and nothing fetches.

This shim deliberately **does not** provide `json`. Writing one would mean
inventing behaviour the source documents never specified. If loaders are ever
needed, that gap must be resolved as an explicit decision first.

Enforcement point: `src/app/router.tsx`.

## Maintenance

- `vite-react-ssg` is pinned to exactly `0.9.2` in `package.json`, because this
  shim is coupled to that version's internal imports. Do not widen the range
  without re-running the spike.
- `package.json` carries an `overrides` block so a clean `npm install` resolves
  without `--legacy-peer-deps`.
- Delete this package if `vite-react-ssg` ever ships native React Router v7
  support. Nothing in `src/` imports from it — application code imports from
  `react-router` directly.
