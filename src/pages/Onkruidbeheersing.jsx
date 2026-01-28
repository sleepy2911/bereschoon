import React from 'react';
import PageTransition from '../components/PageTransition';
import ServiceHero from '../components/ServiceHero';
import ContactForm from '../components/ContactForm';
import ServiceGallery from '../components/ServiceGallery';
import FAQSection from '../components/FAQSection';
import ProcessSteps from '../components/ProcessSteps';
import CallToAction from '../components/CallToAction';
import SEO from '../components/SEO';
import { generateFAQSchema, generateServiceSchema, SERVICE_FAQ_DATA } from '../utils/structuredData';
import { GOOGLE_REVIEW_DATA } from '../data/reviews';

const Onkruidbeheersing = () => {
    // Structured data voor deze pagina
    const faqSchema = generateFAQSchema(SERVICE_FAQ_DATA);
    const serviceSchema = generateServiceSchema({
        name: 'Zakelijke Onkruidbeheersing',
        description: 'Professionele onkruidbeheersing voor bedrijven en zakelijke terreinen. Milieuvriendelijk en effectief onderhoud het hele jaar door.',
        type: 'Onkruidbeheersing',
        url: '/onkruidbeheersing',
        image: '/images/hero/onkruid/hero-onkruid1.webp'
    });

    // Combineer alle schemas
    const combinedSchema = [faqSchema, serviceSchema].filter(Boolean);

    return (
        <PageTransition>
            <SEO
                title="Zakelijke Onkruidbeheersing"
                description="Professionele onkruidbeheersing voor bedrijven. Milieuvriendelijk en effectief."
                keywords="onkruidbeheersing, onkruid verwijderen, tuinonderhoud, bestrating schoonmaken"
                structuredData={combinedSchema.length === 1 ? combinedSchema[0] : combinedSchema}
                breadcrumbs={[
                    { name: 'Home', url: 'https://bereschoon.nl' },
                    { name: 'Onkruidbeheersing', url: 'https://bereschoon.nl/onkruidbeheersing' }
                ]}
            />
            {/* Hero Section */}
            <ServiceHero
                title="Zakelijke Onkruidbeheersing"
                subtitle="Professioneel Onderhoud"
                description="Houd uw bedrijfsterrein, parkeerplaats of buitenruimte onkruidvrij met onze professionele onkruidbeheersingsplannen. Speciaal voor zakelijke klanten bieden wij regelmatig onderhoud voor een verzorgde uitstraling."
                images={[
                    '/images/hero/onkruid/hero-onkruid1.webp',
                    '/images/hero/onkruid/hero-onkruid2.webp',
                    '/images/hero/onkruid/hero-onkruid3.webp'
                ]}
                features={[
                    'Flexibele plannen',
                    'Milieuvriendelijk',
                    'Preventief onderhoud'
                ]}
                ctaText="Direct Offerte Aanvragen"
                reviewData={{
                    ...GOOGLE_REVIEW_DATA,
                    quotes: [
                        "Eindelijk van dat onkruid af zonder gif te hoeven spuiten. Veilige oplossing voor onze hond! – Karin",
                        "De tuin ziet er het hele jaar door verzorgd uit dankzij het onderhoudsplan. – Dennis",
                        "Geen rugpijn meer van het onkruid wieden, Bereschoon regelt het perfect. – Henk",
                        "Heel tevreden over de borstelmethode, werkt veel beter dan branden of schoffelen. – Tom",
                        "Professioneel bedrijf, komen altijd netjes op tijd en werken hard. – Bart"
                    ],
                    mobileQuotes: [
                        "Onkruidvrij zonder gif, veilig voor de hond! – Karin",
                        "Tuin ziet er hele jaar verzorgd uit. – Dennis",
                        "Geen rugpijn meer, Bereschoon regelt het. – Henk",
                        "Borstelmethode werkt beter dan branden. – Tom",
                        "Komen altijd netjes op tijd. – Bart"
                    ]
                }}
                companyLogos={[
                    "/images/company-logos/logo1.webp",
                    "/images/company-logos/logo2.webp",
                    "/images/company-logos/logo3.webp",
                    "/images/company-logos/logo4.webp",
                    "/images/company-logos/logo5.webp",
                    "/images/company-logos/logo6.webp",
                    "/images/company-logos/logo7.webp",
                    "/images/company-logos/logo8.webp",
                    "/images/company-logos/logo9.webp",
                    "/images/company-logos/logo10.webp"
                ]}
            />

            {/* Form Section */}
            <section id="formulier" className="py-24 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground tracking-tight">
                                Vraag een <span className="text-primary">Vrijblijvende Offerte</span> aan
                            </h2>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                Kies een onderhoudsplan dat bij u past. Wij komen regelmatig langs om uw buitenruimte onkruidvrij te houden.
                            </p>
                        </div>

                        {/* Process Steps */}
                        <ProcessSteps />

                        <div id="keuzehulp" className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 scroll-mt-32">
                            <ContactForm preselectedService="onkruidbeheersing" />
                        </div>

                        <div className="mt-8 text-center text-muted-foreground text-sm">
                            <p>Liever bellen? <a href="tel:+31639494059" className="text-primary font-semibold hover:underline">06 3949 4059</a></p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <div id="resultaten">
                <ServiceGallery
                    serviceId="onkruidbeheersing"
                    title="Onze Resultaten"
                    subtitle="Onkruidbeheersing Projecten"
                    description="Bekijk onze gerealiseerde onkruidbeheersingsprojecten. Sleep de slider om het voor- en na-verschil te zien."
                />
            </div>

            {/* FAQ Section */}
            <FAQSection />

            {/* Final CTA Container */}
            <div className="relative z-10 bg-white">
                <CallToAction
                    title="Klaar voor een"
                    highlight="onkruidvrije tuin?"
                    description="Kies voor gemak en verzorging. Plan direct een inspectie in en wij stellen een onderhoudsplan op dat bij u past."
                />
            </div>
        </PageTransition>
    );
};

export default Onkruidbeheersing;

