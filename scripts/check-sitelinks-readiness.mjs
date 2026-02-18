#!/usr/bin/env node
/**
 * Sitelinks Readiness / SEO Validation Script
 *
 * Validates ALL prerendered pages from sitemap-pages.xml:
 * 1. <title> exists and is not empty
 * 2. BreadcrumbList JSON-LD exists
 * 3. data-server-rendered="true" on root div (real content)
 * 4. Core navigation links present (in HTML or JSON-LD)
 *
 * Exit 0 = all pass, Exit 1 = any fail (CI guardrail)
 *
 * Run: node scripts/check-sitelinks-readiness.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, '../dist');
const BASE_URL = 'https://bereschoon.nl';

// Core navigation paths that should be reachable from every page
const CORE_NAV_PATHS = ['/', '/over-ons', '/projecten', '/winkel', '/contact', '/configurator'];

// ── Parse sitemap for routes ────────────────────────────────────────────

function parseRoutes() {
    let sitemapPath = path.resolve(DIST_DIR, 'sitemap-pages.xml');
    if (!fs.existsSync(sitemapPath)) {
        sitemapPath = path.resolve(__dirname, '../public/sitemap-pages.xml');
    }

    if (!fs.existsSync(sitemapPath)) {
        console.error('❌ sitemap-pages.xml not found');
        process.exit(1);
    }

    const xml = fs.readFileSync(sitemapPath, 'utf8');
    const locMatches = xml.matchAll(/<loc>([^<]+)<\/loc>/g);
    const routes = [];

    for (const match of locMatches) {
        try {
            const u = new URL(match[1]);
            let pathname = u.pathname;
            if (pathname !== '/' && pathname.endsWith('/')) {
                pathname = pathname.slice(0, -1);
            }
            routes.push(pathname);
        } catch {
            // skip
        }
    }

    return routes;
}

// ── Validation checks ───────────────────────────────────────────────────

function checkRoute(route) {
    const errors = [];

    // Determine file path
    let filePath;
    if (route === '/') {
        filePath = path.resolve(DIST_DIR, 'index.html');
    } else {
        filePath = path.resolve(DIST_DIR, route.slice(1), 'index.html');
    }

    if (!fs.existsSync(filePath)) {
        return { route, errors: [`HTML file not found: ${filePath}`] };
    }

    const html = fs.readFileSync(filePath, 'utf8');

    // 1. Title check
    const titleMatch = html.match(/<title>([^<]*)<\/title>/);
    if (!titleMatch || !titleMatch[1].trim()) {
        errors.push('missing or empty <title>');
    }

    // 2. BreadcrumbList check
    if (!html.includes('"@type":"BreadcrumbList"') && !html.includes('"@type": "BreadcrumbList"')) {
        errors.push('missing BreadcrumbList JSON-LD');
    }

    // 3. Server-rendered content check
    if (!html.includes('data-server-rendered="true"')) {
        errors.push('missing data-server-rendered="true" — page not prerendered');
    }

    // 4. Navigation links check — either as href or in JSON-LD
    const missingNav = [];
    for (const navPath of CORE_NAV_PATHS) {
        const relativeLink = `href="${navPath}"`;
        const relativeLink2 = `href="${navPath}/"`;
        const absoluteLink = `${BASE_URL}${navPath === '/' ? '' : navPath}`;
        const rootLink = navPath === '/' ? `href="/"` : null;

        const found =
            html.includes(relativeLink) ||
            html.includes(relativeLink2) ||
            html.includes(absoluteLink) ||
            (rootLink && html.includes(rootLink));

        if (!found) {
            missingNav.push(navPath);
        }
    }

    if (missingNav.length > 0) {
        errors.push(`missing navigation links: ${missingNav.join(', ')}`);
    }

    return { route, errors };
}

// ── Main ────────────────────────────────────────────────────────────────

function main() {
    const routes = parseRoutes();

    console.log('');
    console.log(`Sitelinks readiness check — ${routes.length} pages (dist/)`);
    console.log('');

    let failed = 0;
    let passed = 0;

    for (const route of routes) {
        const result = checkRoute(route);

        if (result.errors.length === 0) {
            console.log(`  ✅  ${route}`);
            passed++;
        } else {
            console.log(`  ❌  ${route}`);
            for (const err of result.errors) {
                console.log(`       - ${err}`);
            }
            failed++;
        }
    }

    console.log('');

    if (failed > 0) {
        console.error(`FAILED: ${failed}/${routes.length} page(s). Fix and re-run.`);
        process.exit(1);
    }

    console.log(`✅ ALL ${passed} pages passed sitelinks readiness check.`);
    console.log('');
}


export { main as validate };

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    main();
}

