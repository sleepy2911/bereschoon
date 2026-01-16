import React from 'react';
import PageTransition from '../components/PageTransition';
import ServiceHero from '../components/ServiceHero';
import ContactForm from '../components/ContactForm';
import ServiceGallery from '../components/ServiceGallery';
import FAQSection from '../components/FAQSection';
import ProcessSteps from '../components/ProcessSteps';
import CallToAction from '../components/CallToAction';

const Onkruidbeheersing = () => {
    return (
        <PageTransition>
            {/* Hero Section */}
            <ServiceHero
                title="Onkruidbeheersing"
                subtitle="Professioneel Onderhoud"
                description="Houd uw tuin, terras en oprit onkruidvrij met onze professionele onkruidbeheersingsplannen. Regelmatig onderhoud voor een verzorgde uitstraling het hele jaar door."
                image="/images/images_optimized/onkruid tuin voor.webp"
                features={[
                    'Flexibele plannen',
                    'Milieuvriendelijk',
                    'Preventief onderhoud'
                ]}
                ctaText="Direct Offerte Aanvragen"
                reviewData={{
                    score: "5.0",
                    count: 38,
                    quote: "Geen omkijken meer naar onkruid, heerlijk! – Familie de Vries",
                    link: "https://www.google.com/search?q=Bereschoon+Helmond+reviews"
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

