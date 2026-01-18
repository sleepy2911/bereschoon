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

const OpritTerrasTerrein = () => {
    // Structured data voor deze pagina
    const faqSchema = generateFAQSchema(SERVICE_FAQ_DATA);
    const serviceSchema = generateServiceSchema({
        name: 'Oprit, Terras & Terreinreiniging',
        description: 'Professionele reiniging van uw oprit, terras en terrein. Verwijderen van onkruid, groene aanslag en vuil met hogedruk technieken.',
        type: 'Oprit en Terras Reiniging',
        url: '/oprit-terras-terrein',
        image: '/images/images_optimized/IMG_3251.webp'
    });

    // Combineer alle schemas
    const combinedSchema = [faqSchema, serviceSchema].filter(Boolean);

    return (
        <PageTransition>
            <SEO
                title="Oprit & Terras Reiniging"
                description="Professionele reiniging van uw oprit, terras en terrein. Verwijderen van onkruid en groene aanslag."
                keywords="oprit reiniging, terras reiniging, terrein onderhoud, onkruid verwijderen"
                structuredData={combinedSchema.length === 1 ? combinedSchema[0] : combinedSchema}
                breadcrumbs={[
                    { name: 'Home', url: 'https://bereschoon.nl' },
                    { name: 'Oprit & Terras', url: 'https://bereschoon.nl/oprit-terras-terrein' }
                ]}
            />
            {/* Hero Section */}
            <ServiceHero
                title="Oprit & Terreinreiniging"
                subtitle="Professionele Reiniging"
                description="Verwijder hardnekkig vuil, groene aanslag en onkruid van uw oprit, terras of terrein. Met onze geavanceerde technieken herstellen wij de oorspronkelijke uitstraling."
                images={[
                    '/images/hero/oprit/hero-oprit1.webp',
                    '/images/hero/oprit/hero-oprit2.webp',
                    '/images/hero/oprit/hero-oprit3.webp'
                ]}
                features={[
                    'Hogedruk reiniging',
                    'Voegen herstellen',
                    'Beschermlaag toepassen'
                ]}
                ctaText="Direct Offerte Aanvragen"
                reviewData={{
                    ...GOOGLE_REVIEW_DATA,
                    quote: "Super strak resultaat, terras ziet er als nieuw uit! – Jan uit Breda"
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
                maxWidth="max-w-7xl lg:max-w-[90rem]"
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
                                Vul het formulier in en ontvang binnen 24 uur een prijsopgave op maat.
                            </p>
                        </div>

                        {/* Process Steps */}
                        <ProcessSteps />

                        <div id="keuzehulp" className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 scroll-mt-32">
                            <ContactForm preselectedService="oprit-terras-terrein" />
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
                    serviceId="oprit-terras-terrein"
                    title="Onze Resultaten"
                    subtitle="Oprit & Terras Projecten"
                    description="Bekijk onze gerealiseerde projecten. Sleep de slider om het voor- en na-verschil te zien."
                />
            </div>

            {/* FAQ Section */}
            <FAQSection />

            {/* Final CTA Container */}
            <div className="relative z-10 bg-white">
                <CallToAction />
            </div>
        </PageTransition>
    );
};

export default OpritTerrasTerrein;
