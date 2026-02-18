#!/usr/bin/env node
/**
 * Prerender Script — Renders all sitemap routes to static HTML
 *
 * Pipeline:
 * 1. Polyfill browser globals for Node.js
 * 2. Parse sitemap-pages.xml for routes
 * 3. Import SSR bundle
 * 4. For each route: render → inject meta → write HTML
 *
 * Run: node scripts/prerender.mjs
 * Requires: npm run build && npm run build:ssr first
 */

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, '../dist');
const SERVER_ENTRY = path.resolve(DIST_DIR, 'server/entry-server.js');
const TEMPLATE_PATH = path.resolve(DIST_DIR, 'index.html');
const BASE_URL = 'https://bereschoon.nl';

// ── Browser global polyfills ────────────────────────────────────────────
// Many libraries (Supabase, auth, analytics) use localStorage/sessionStorage.
// These do not exist in Node.js, so we polyfill them.

function createStoragePolyfill() {
    const storage = new Map();
    return {
        getItem: (k) => storage.get(k) ?? null,
        setItem: (k, v) => storage.set(k, String(v)),
        removeItem: (k) => storage.delete(k),
        clear: () => storage.clear(),
        get length() { return storage.size; },
        key: (i) => [...storage.keys()][i] ?? null,
    };
}

if (typeof globalThis.localStorage === 'undefined') {
    globalThis.localStorage = createStoragePolyfill();
}
if (typeof globalThis.sessionStorage === 'undefined') {
    globalThis.sessionStorage = createStoragePolyfill();
}
// INTENTIONALLY do not polyfill `window` as a real object.
// Libraries like goober check `typeof window === "object"` to detect browser env.
// Keeping window undefined makes them fall back to SSR-safe code paths.
// We provide individual browser globals (location, history, etc.) separately instead.
if (typeof globalThis.document === 'undefined') {
    // Comprehensive DOM polyfill for Node.js SSR
    // Must support goober (CSS-in-JS used by react-hot-toast) which needs:
    //   - document.createElement('style') with working appendChild/firstChild
    //   - text nodes with a mutable .data property
    //   - document.head.querySelector / appendChild

    const createMockElement = (tag) => {
        const _children = [];
        const el = {
            tagName: tag?.toUpperCase?.() || 'DIV',
            nodeType: 1,
            setAttribute: () => { },
            getAttribute: (name) => el._attrs?.[name] ?? null,
            hasAttribute: (name) => !!el._attrs?.[name],
            removeAttribute: () => { },
            _attrs: {},
            appendChild: (child) => {
                _children.push(child);
                child.parentNode = el;
                return child;
            },
            removeChild: (child) => {
                const idx = _children.indexOf(child);
                if (idx !== -1) _children.splice(idx, 1);
                return child;
            },
            insertBefore: (newNode, refNode) => {
                _children.push(newNode);
                newNode.parentNode = el;
                return newNode;
            },
            get firstChild() { return _children[0] || null; },
            get lastChild() { return _children[_children.length - 1] || null; },
            get childNodes() { return _children; },
            get children() { return _children.filter(c => c.nodeType === 1); },
            querySelector: (sel) => {
                // goober queries: style[data-goober]
                for (const child of _children) {
                    if (sel.includes('data-goober') && child._attrs?.['data-goober'] !== undefined) {
                        return child;
                    }
                }
                return null;
            },
            querySelectorAll: () => [],
            style: {},
            classList: { add: () => { }, remove: () => { }, contains: () => false, toggle: () => { } },
            addEventListener: () => { },
            removeEventListener: () => { },
            parentNode: null,
            textContent: '',
            innerHTML: '',
            dataset: new Proxy({}, { get: () => undefined, set: () => true }),
            // goober accesses .sheet on <style> elements
            sheet: {
                cssRules: [],
                insertRule: () => 0,
                deleteRule: () => { },
            },
        };
        // Make setAttribute actually store so goober can find [data-goober]
        el.setAttribute = (name, value) => { el._attrs[name] = value; };
        return el;
    };

    const createTextNode = (text) => ({
        nodeType: 3,
        data: text || '',
        textContent: text || '',
        parentNode: null,
    });

    const mockHead = createMockElement('HEAD');
    const mockBody = createMockElement('BODY');

    globalThis.document = {
        nodeType: 9,
        querySelector: (sel) => {
            // Delegate to head for style queries
            return mockHead.querySelector(sel);
        },
        querySelectorAll: () => [],
        getElementById: () => null,
        getElementsByTagName: (tag) => {
            if (tag === 'head') return [mockHead];
            if (tag === 'body') return [mockBody];
            return [];
        },
        createElement: (tag) => createMockElement(tag),
        createTextNode: createTextNode,
        createElementNS: (ns, tag) => createMockElement(tag),
        createComment: (text) => ({ nodeType: 8, data: text || '' }),
        body: mockBody,
        head: mockHead,
        documentElement: {
            style: {},
            setAttribute: () => { },
            getAttribute: () => null,
            classList: { add: () => { }, remove: () => { }, contains: () => false },
        },
        addEventListener: () => { },
        removeEventListener: () => { },
        createEvent: () => ({ initEvent: () => { } }),
    };
}
if (typeof globalThis.navigator === 'undefined') {
    globalThis.navigator = { userAgent: 'node', language: 'nl-NL' };
}
if (typeof globalThis.location === 'undefined') {
    globalThis.location = { href: BASE_URL, origin: BASE_URL, pathname: '/', search: '', hash: '' };
}
if (typeof globalThis.history === 'undefined') {
    globalThis.history = { pushState: () => { }, replaceState: () => { }, scrollRestoration: 'auto' };
}
if (typeof globalThis.matchMedia === 'undefined') {
    globalThis.matchMedia = () => ({
        matches: false,
        addListener: () => { },
        removeListener: () => { },
        addEventListener: () => { },
        removeEventListener: () => { },
    });
}
if (typeof globalThis.IntersectionObserver === 'undefined') {
    globalThis.IntersectionObserver = class {
        constructor() { }
        observe() { }
        unobserve() { }
        disconnect() { }
    };
}
if (typeof globalThis.MutationObserver === 'undefined') {
    globalThis.MutationObserver = class {
        constructor() { }
        observe() { }
        disconnect() { }
    };
}
if (typeof globalThis.ResizeObserver === 'undefined') {
    globalThis.ResizeObserver = class {
        constructor() { }
        observe() { }
        unobserve() { }
        disconnect() { }
    };
}
if (typeof globalThis.Image === 'undefined') {
    globalThis.Image = class {
        constructor() { this.src = ''; }
    };
}
if (typeof globalThis.fetch === 'undefined') {
    globalThis.fetch = async () => ({ ok: true, json: async () => ([]), text: async () => '' });
}
if (typeof globalThis.requestAnimationFrame === 'undefined') {
    globalThis.requestAnimationFrame = (cb) => setTimeout(cb, 0);
}
if (typeof globalThis.cancelAnimationFrame === 'undefined') {
    globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
}
if (typeof globalThis.getComputedStyle === 'undefined') {
    globalThis.getComputedStyle = () => ({
        getPropertyValue: () => '',
    });
}

// ── HTML escaping ───────────────────────────────────────────────────────

function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// ── Parse sitemap for routes ────────────────────────────────────────────

function parseRoutes() {
    // Try dist/sitemap-pages.xml first, then public/
    let sitemapPath = path.resolve(DIST_DIR, 'sitemap-pages.xml');
    if (!fs.existsSync(sitemapPath)) {
        sitemapPath = path.resolve(__dirname, '../public/sitemap-pages.xml');
    }

    if (!fs.existsSync(sitemapPath)) {
        console.error('❌ sitemap-pages.xml not found in dist/ or public/');
        process.exit(1);
    }

    const xml = fs.readFileSync(sitemapPath, 'utf8');
    const locMatches = xml.matchAll(/<loc>([^<]+)<\/loc>/g);
    const routes = [];

    for (const match of locMatches) {
        const url = match[1];
        try {
            const u = new URL(url);
            let pathname = u.pathname;
            // Remove trailing slash (except root)
            if (pathname !== '/' && pathname.endsWith('/')) {
                pathname = pathname.slice(0, -1);
            }
            routes.push(pathname);
        } catch {
            // skip invalid URLs
        }
    }

    return routes;
}

// ── Meta tag replacement ────────────────────────────────────────────────

function replaceMeta(html, meta) {
    // All regexes use [\s\S] to handle multiline attributes in the HTML template

    // Replace <title>...</title>
    html = html.replace(
        /<title>[^<]*<\/title>/,
        `<title>${escapeHtml(meta.title)}</title>`
    );

    // Replace meta name="title"
    html = html.replace(
        /<meta\s+name="title"\s+content="[^"]*"/,
        `<meta name="title" content="${escapeHtml(meta.title)}"`
    );

    // Replace meta name="description" (handles multiline in template)
    html = html.replace(
        /<meta\s+name="description"[\s\S]*?content="[^"]*"/,
        `<meta name="description" content="${escapeHtml(meta.description)}"`
    );

    // Replace canonical
    html = html.replace(
        /<link\s+rel="canonical"\s+href="[^"]*"/,
        `<link rel="canonical" href="${escapeHtml(meta.canonical)}"`
    );

    // Replace OG tags (handle multiline)
    html = html.replace(
        /<meta\s+property="og:url"[\s\S]*?content="[^"]*"/,
        `<meta property="og:url" content="${escapeHtml(meta.canonical)}"`
    );
    html = html.replace(
        /<meta\s+property="og:title"[\s\S]*?content="[^"]*"/,
        `<meta property="og:title" content="${escapeHtml(meta.title)}"`
    );
    html = html.replace(
        /<meta\s+property="og:description"[\s\S]*?content="[^"]*"/,
        `<meta property="og:description" content="${escapeHtml(meta.description)}"`
    );
    html = html.replace(
        /<meta\s+property="og:type"[\s\S]*?content="[^"]*"/,
        `<meta property="og:type" content="${escapeHtml(meta.type)}"`
    );

    // Replace Twitter tags (handle multiline)
    html = html.replace(
        /<meta\s+property="twitter:url"[\s\S]*?content="[^"]*"/,
        `<meta property="twitter:url" content="${escapeHtml(meta.canonical)}"`
    );
    html = html.replace(
        /<meta\s+property="twitter:title"[\s\S]*?content="[^"]*"/,
        `<meta property="twitter:title" content="${escapeHtml(meta.title)}"`
    );
    html = html.replace(
        /<meta\s+property="twitter:description"[\s\S]*?content="[^"]*"/,
        `<meta property="twitter:description" content="${escapeHtml(meta.description)}"`
    );

    return html;
}

// ── Inject JSON-LD before </head> ───────────────────────────────────────

function injectJsonLd(html, breadcrumbs, siteNavJsonLd) {
    const injections = [];

    // BreadcrumbList
    if (breadcrumbs && breadcrumbs.length > 0) {
        const breadcrumbSchema = {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: breadcrumbs.map((crumb, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: crumb.name,
                item: crumb.url,
            })),
        };
        injections.push(
            `<script type="application/ld+json" data-seo="breadcrumb">${JSON.stringify(breadcrumbSchema)}</script>`
        );
    }

    // SiteNavigationElement
    if (siteNavJsonLd) {
        injections.push(
            `<script type="application/ld+json" data-seo="sitenav">${JSON.stringify(siteNavJsonLd)}</script>`
        );
    }

    if (injections.length > 0) {
        html = html.replace('</head>', `${injections.join('\n')}\n</head>`);
    }

    return html;
}

// ── Main ────────────────────────────────────────────────────────────────

async function main() {
    console.log('');
    console.log('🔨 Bereschoon Prerender Pipeline');
    console.log('================================');

    // Check prerequisites
    if (!fs.existsSync(TEMPLATE_PATH)) {
        console.error('❌ dist/index.html not found. Run "npm run build" first.');
        process.exit(1);
    }
    if (!fs.existsSync(SERVER_ENTRY)) {
        console.error('❌ dist/server/entry-server.js not found. Run "npm run build:ssr" first.');
        process.exit(1);
    }

    // Parse routes from sitemap
    const routes = parseRoutes();
    console.log(`📄 Found ${routes.length} routes in sitemap-pages.xml`);

    // Import SSR bundle (pathToFileURL for Windows compatibility)
    const entryUrl = pathToFileURL(SERVER_ENTRY).href;
    const { render, getRouteMeta, getBreadcrumbs, getSiteNavJsonLd } = await import(entryUrl);

    // Read template
    const template = fs.readFileSync(path.resolve(DIST_DIR, 'index.template.html'), 'utf8');

    // Get site navigation JSON-LD (same for all pages)
    const siteNavJsonLd = getSiteNavJsonLd();

    let success = 0;
    let failed = 0;

    for (const route of routes) {
        try {
            // Render the route
            const appHtml = render(route);

            // Get metadata
            const meta = getRouteMeta(route);
            const breadcrumbs = getBreadcrumbs(route);

            // Start with template
            let html = template;

            // Replace meta tags
            html = replaceMeta(html, meta);

            // Inject JSON-LD
            html = injectJsonLd(html, breadcrumbs, siteNavJsonLd);

            // Replace root div with server-rendered content
            html = html.replace(
                '<div id="root"></div>',
                `<div id="root" data-server-rendered="true">${appHtml}</div>`
            );

            // Determine output path
            let outputPath;
            if (route === '/') {
                outputPath = path.resolve(DIST_DIR, 'index.html');
            } else {
                const routeDir = path.resolve(DIST_DIR, route.slice(1));
                fs.mkdirSync(routeDir, { recursive: true });
                outputPath = path.resolve(routeDir, 'index.html');
            }

            fs.writeFileSync(outputPath, html, 'utf8');
            console.log(`  ✅ ${route}`);
            success++;
        } catch (err) {
            console.error(`  ❌ ${route}: ${err.message}`);
            if (err.stack) {
                console.error(`     ${err.stack.split('\n').slice(1, 3).join('\n     ')}`);
            }
            failed++;
        }
    }

    console.log('');
    console.log(`Prerender complete: ${success} success, ${failed} failed`);

    if (failed > 0) {
        console.error('❌ Some routes failed to prerender. Build will fail.');
        process.exit(1);
    }

    console.log('✅ All routes prerendered successfully!');
    console.log('');
}


export { main as prerender };

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    main().catch(err => {
        console.error('Fatal error:', err);
        process.exit(1);
    });
}
