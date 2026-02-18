/**
 * Route Metadata — Per-route SEO data for prerender pipeline
 */

import { getSiteNavJsonLd } from './nav-config.js';

const BASE_URL = 'https://bereschoon.nl';

// Static route metadata
const STATIC_META = {
    '/': {
        title: 'Professionele Buitenreiniging',
        description: 'Bereschoon biedt uitzonderlijke schoonmaakdiensten voor uw oprit, gevel, terras en meer. Professioneel, efficiënt en milieubewust. Vraag nu een offerte aan!',
        type: 'website',
    },
    '/over-ons': {
        title: 'Over Ons',
        description: 'Leer meer over Bereschoon, ons team en onze missie. Professionele buitenreiniging met passie voor kwaliteit en klanttevredenheid.',
        type: 'website',
    },
    '/contact': {
        title: 'Contact & Offerte Aanvragen',
        description: 'Neem contact op met Bereschoon voor een vrijblijvende offerte. Wij staan klaar om uw oprit, gevel of terras professioneel te reinigen.',
        type: 'website',
    },
    '/configurator': {
        title: 'Directe Prijsindicatie & Reinigingsadvies | AI Scan',
        description: 'Upload een foto en ontvang direct een vrijblijvende prijsindicatie en advies voor het reinigen van uw oprit, terras of gevel.',
        type: 'website',
    },
    '/projecten': {
        title: 'Projecten',
        description: 'Bekijk onze gerealiseerde projecten. Van oprit reiniging tot gevelreiniging — resultaten die voor zich spreken.',
        type: 'website',
    },
    '/oprit-terras-terrein': {
        title: 'Oprit, Terras & Terrein Reiniging',
        description: 'Professionele reiniging van uw oprit, terras en terrein. Hogedrukreiniging en softwash voor een stralend resultaat.',
        type: 'website',
    },
    '/gevelreiniging': {
        title: 'Gevelreiniging',
        description: 'Professionele gevelreiniging voor een frisse uitstraling. Veilig en effectief, geschikt voor alle gevelmaterialen.',
        type: 'website',
    },
    '/onkruidbeheersing': {
        title: 'Onkruidbeheersing',
        description: 'Effectieve en milieuvriendelijke onkruidbeheersing voor uw oprit, terras en terrein. Duurzaam en grondig.',
        type: 'website',
    },
    '/winkel': {
        title: 'Winkel',
        description: 'Ontdek professionele reinigingsproducten in de Bereschoon webshop. Kwaliteitsproducten voor zelf aan de slag.',
        type: 'website',
    },
    '/reinigingsdiensten-helmond': {
        title: 'Reinigingsdiensten Helmond',
        description: 'Professionele reinigingsdiensten in Helmond. Oprit, gevel, terras reiniging en onkruidbeheersing door Bereschoon.',
        type: 'website',
    },
    '/reinigingsdiensten-eindhoven': {
        title: 'Reinigingsdiensten Eindhoven',
        description: 'Professionele reinigingsdiensten in Eindhoven. Oprit, gevel, terras reiniging en onkruidbeheersing door Bereschoon.',
        type: 'website',
    },
    '/reinigingsdiensten-den-bosch': {
        title: 'Reinigingsdiensten Den Bosch',
        description: 'Professionele reinigingsdiensten in Den Bosch. Oprit, gevel, terras reiniging en onkruidbeheersing door Bereschoon.',
        type: 'website',
    },
    '/reinigingsdiensten-gemert': {
        title: 'Reinigingsdiensten Gemert',
        description: 'Professionele reinigingsdiensten in Gemert. Oprit, gevel, terras reiniging en onkruidbeheersing door Bereschoon.',
        type: 'website',
    },
    '/reinigingsdiensten-mierlo': {
        title: 'Reinigingsdiensten Mierlo',
        description: 'Professionele reinigingsdiensten in Mierlo. Oprit, gevel, terras reiniging en onkruidbeheersing door Bereschoon.',
        type: 'website',
    },
    '/algemene-voorwaarden': {
        title: 'Algemene Voorwaarden',
        description: 'Lees de algemene voorwaarden van Bereschoon. Transparante afspraken voor onze reinigingsdiensten.',
        type: 'website',
    },
    '/privacy': {
        title: 'Privacy- en Cookiebeleid',
        description: 'Het privacy- en cookiebeleid van Bereschoon. Uw gegevens zijn bij ons in veilige handen.',
        type: 'website',
    },
    '/verzend-retourbeleid': {
        title: 'Verzend- en Retourbeleid',
        description: 'Informatie over verzending en retournering bij Bereschoon. Duidelijke voorwaarden voor uw bestellingen.',
        type: 'website',
    },
};

/**
 * Get route metadata for a given pathname
 */
export function getRouteMeta(pathname) {
    // Normalize: remove trailing slash (except root)
    const normalized = pathname === '/' ? '/' : pathname.replace(/\/$/, '');

    const meta = STATIC_META[normalized];
    if (meta) {
        return {
            title: `${meta.title} | Bereschoon`,
            description: meta.description,
            canonical: normalized === '/' ? BASE_URL : `${BASE_URL}${normalized}`,
            image: `${BASE_URL}/images/logo.png`,
            type: meta.type || 'website',
        };
    }

    // Fallback to homepage
    return {
        title: 'Bereschoon - Professionele Reinigingsdiensten | Oprit, Gevel & Terras',
        description: STATIC_META['/'].description,
        canonical: BASE_URL,
        image: `${BASE_URL}/images/logo.png`,
        type: 'website',
    };
}

// Breadcrumb label map for cleaner names
const BREADCRUMB_LABELS = {
    '/': 'Home',
    '/over-ons': 'Over Ons',
    '/contact': 'Contact',
    '/configurator': 'Prijsindicatie & Advies',
    '/projecten': 'Projecten',
    '/oprit-terras-terrein': 'Oprit, Terras & Terrein',
    '/gevelreiniging': 'Gevelreiniging',
    '/onkruidbeheersing': 'Onkruidbeheersing',
    '/winkel': 'Winkel',
    '/reinigingsdiensten-helmond': 'Reinigingsdiensten Helmond',
    '/reinigingsdiensten-eindhoven': 'Reinigingsdiensten Eindhoven',
    '/reinigingsdiensten-den-bosch': 'Reinigingsdiensten Den Bosch',
    '/reinigingsdiensten-gemert': 'Reinigingsdiensten Gemert',
    '/reinigingsdiensten-mierlo': 'Reinigingsdiensten Mierlo',
    '/algemene-voorwaarden': 'Algemene Voorwaarden',
    '/privacy': 'Privacy- en Cookiebeleid',
    '/verzend-retourbeleid': 'Verzend- en Retourbeleid',
};

/**
 * Get breadcrumbs for a given pathname
 * Returns array of { name, url }
 */
export function getBreadcrumbs(pathname) {
    const normalized = pathname === '/' ? '/' : pathname.replace(/\/$/, '');

    // Homepage — single item
    if (normalized === '/') {
        return [{ name: 'Home', url: BASE_URL }];
    }

    const crumbs = [{ name: 'Home', url: BASE_URL }];
    const label = BREADCRUMB_LABELS[normalized];

    if (label) {
        crumbs.push({
            name: label,
            url: `${BASE_URL}${normalized}`,
        });
    } else {
        // Fallback: use pathname segments
        const segments = normalized.split('/').filter(Boolean);
        let currentPath = '';
        for (const segment of segments) {
            currentPath += `/${segment}`;
            const segLabel = BREADCRUMB_LABELS[currentPath] || segment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
            crumbs.push({
                name: segLabel,
                url: `${BASE_URL}${currentPath}`,
            });
        }
    }

    return crumbs;
}

// Re-export for prerender script
export { getSiteNavJsonLd };
