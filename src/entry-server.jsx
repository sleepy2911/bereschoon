/**
 * SSR Entry Point
 * Compiled by: vite build --ssr ./src/entry-server.jsx --outDir dist/server
 * Used by: scripts/prerender.mjs
 */
import React from 'react';
import { renderToString } from 'react-dom/server';
import AppServer from './AppServer.jsx';
import { getRouteMeta, getBreadcrumbs, getSiteNavJsonLd } from './lib/route-meta.js';

// Flag for components to detect SSR environment
globalThis.__SSR__ = true;

/**
 * Render a route to HTML string
 */
export function render(url) {
    const html = renderToString(
        React.createElement(AppServer, { location: url })
    );
    return html;
}

// Re-export metadata functions for prerender script
export { getRouteMeta, getBreadcrumbs, getSiteNavJsonLd };
