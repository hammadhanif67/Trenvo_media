/**
 * Compatibility shim — see ./README.md
 *
 * Restores the `react-router-dom/server.js` subpath that React Router v7
 * removed and that vite-react-ssg@0.9.2 requires on the prerender critical
 * path. All three exports come from react-router v7 unchanged.
 */
export {
  StaticRouterProvider,
  createStaticHandler,
  createStaticRouter,
} from 'react-router';
