/**
 * Navigation Config — Single source of truth
 * Used by Navbar, Footer, and SiteNavigationElement schema
 */

const BASE_URL = 'https://bereschoon.nl';

export const NAV_ITEMS = [
    { name: 'Home', path: '/' },
    { name: 'Over Ons', path: '/over-ons' },
    { name: 'Projecten', path: '/projecten' },
    { name: 'Winkel', path: '/winkel' },
    { name: 'Oprit Scan', path: '/configurator' },
    { name: 'Contact', path: '/contact' },
];

export const SERVICE_PAGES = [
    { name: 'Oprit, Terras & Terrein', path: '/oprit-terras-terrein' },
    { name: 'Gevelreiniging', path: '/gevelreiniging' },
    { name: 'Onkruidbeheersing', path: '/onkruidbeheersing' },
];

export function getSiteNavSchemaUrls() {
    return NAV_ITEMS.map(item => ({
        name: item.name,
        url: item.path === '/' ? BASE_URL : `${BASE_URL}${item.path}`,
    }));
}

export function getSiteNavJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@type': 'SiteNavigationElement',
        name: 'Main Navigation',
        hasPart: getSiteNavSchemaUrls().map(item => ({
            '@type': 'SiteNavigationElement',
            name: item.name,
            url: item.url,
        })),
    };
}
