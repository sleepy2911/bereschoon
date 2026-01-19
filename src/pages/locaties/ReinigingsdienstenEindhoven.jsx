import React from 'react';
import PageTransition from '../../components/PageTransition';
import ServiceHero from '../../components/ServiceHero';
import ContactForm from '../../components/ContactForm';
import ServiceGallery from '../../components/ServiceGallery';
import FAQSection from '../../components/FAQSection';
import ProcessSteps from '../../components/ProcessSteps';
import CallToAction from '../../components/CallToAction';
import SEO from '../../components/SEO';
import { generateFAQSchema, generateServiceSchema, SERVICE_FAQ_DATA } from '../../utils/structuredData';
import { GOOGLE_REVIEW_DATA } from '../../data/reviews';

const ReinigingsdienstenEindhoven = () => {
    const location = 'Eindhoven';
    const locationSlug = 'eindhoven';
    
    const faqSchema = generateFAQSchema(SERVICE_FAQ_DATA);
    const serviceSchema = generateServiceSchema({
        name: `Reinigingsdiensten ${location}`,
        description: `Professionele reinigingsdiensten in ${location}. Oprit reiniging, gevelreiniging en onkruidbeheersing door Bereschoon.`,
        type: 'Reinigingsdiensten',
        url: `/reinigingsdiensten-${locationSlug}`,
        image: '/images/hero/oprit/hero-oprit1.webp',
        areaServed: {
            '@type': 'City',
            name: location
        }
    });

    const combinedSchema = [faqSchema, serviceSchema].filter(Boolean);

    return (
        <PageTransition>
            <SEO
                title={`Reinigingsdiensten ${location} | Oprit, Gevel & Onkruidbeheersing`}
                description={`Professionele reinigingsdiensten in ${location}. Oprit reiniging, gevelreiniging en onkruidbeheersing door Bereschoon. Vrijblijvende offerte aanvragen.`}
                keywords={`reinigingsdiensten ${location}, oprit reiniging ${location}, gevelreiniging ${location}, onkruidbeheersing ${location}, terras reinigen ${location}, buitenreiniging ${location}`}
                structuredData={combinedSchema.length === 1 ? combinedSchema[0] : combinedSchema}
                breadcrumbs={[
                    { name: 'Home', url: 'https://bereschoon.nl' },
                    { name: `Reinigingsdiensten ${location}`, url: `https://bereschoon.nl/reinigingsdiensten-${locationSlug}` }
                ]}
            />
            
            <ServiceHero
                title={`Reinigingsdiensten in ${location}`}
                subtitle="Professionele Buitenreiniging"
                description={`Bereschoon is uw specialist voor professionele reinigingsdiensten in ${location} en omgeving. Wij reinigen uw oprit, terras, gevel en terrein met geavanceerde technieken. Vraag vandaag nog een vrijblijvende offerte aan.`}
                images={[
                    '/images/hero/oprit/hero-oprit1.webp',
                    '/images/hero/gevel/hero-gevel1.webp',
                    '/images/hero/onkruid/hero-onkruid1.webp'
                ]}
                features={[
                    'Oprit & Terras Reiniging',
                    'Gevelreiniging',
                    'Onkruidbeheersing'
                ]}
                ctaText="Direct Offerte Aanvragen"
                reviewData={{
                    ...GOOGLE_REVIEW_DATA,
                    quotes: [
                        `Professionele service in ${location}, onze oprit ziet er weer als nieuw uit! – Jan`,
                        `Snelle reactie en keurig werk geleverd. Aanrader voor iedereen in ${location}. – Maria`,
                        `Gevelreiniging gedaan, verschil is enorm. Zeer tevreden! – Piet`,
                        `Onkruidbeheersing werkt perfect, tuin blijft netjes. – Lisa`,
                        `Betrouwbaar bedrijf, komen altijd op tijd. – Tom`
                    ],
                    mobileQuotes: [
                        `Oprit ziet er weer als nieuw uit! – Jan`,
                        `Snelle reactie, keurig werk. – Maria`,
                        `Verschil is enorm, zeer tevreden! – Piet`,
                        `Tuin blijft netjes. – Lisa`,
                        `Betrouwbaar, komen op tijd. – Tom`
                    ]
                }}
            />

            {/* Services Overview Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground tracking-tight">
                            Onze Diensten in <span className="text-primary">{location}</span>
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                            Bereschoon biedt complete reinigingsoplossingen voor uw buitenruimte in {location}. Van oprit tot gevel, wij zorgen voor een verzorgde uitstraling.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
                            <h3 className="text-xl font-bold text-foreground mb-4">Oprit & Terras Reiniging</h3>
                            <p className="text-muted-foreground mb-4">
                                Verwijder hardnekkig vuil, groene aanslag en onkruid van uw oprit en terras. Met hogedruk technieken herstellen wij de oorspronkelijke uitstraling.
                            </p>
                            <ul className="text-sm text-muted-foreground space-y-2">
                                <li>• Hogedruk reiniging</li>
                                <li>• Voegen herstellen</li>
                                <li>• Beschermlaag toepassen</li>
                            </ul>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
                            <h3 className="text-xl font-bold text-foreground mb-4">Gevelreiniging</h3>
                            <p className="text-muted-foreground mb-4">
                                Verwijder groene aanslag, algen en vuil van uw gevel. Met milde softwash technieken zonder schade aan uw gevel.
                            </p>
                            <ul className="text-sm text-muted-foreground space-y-2">
                                <li>• Softwash reiniging</li>
                                <li>• Stoomreiniging</li>
                                <li>• Gevelimpregnatie</li>
                            </ul>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
                            <h3 className="text-xl font-bold text-foreground mb-4">Onkruidbeheersing</h3>
                            <p className="text-muted-foreground mb-4">
                                Houd uw tuin, terras en oprit onkruidvrij met onze professionele onkruidbeheersingsplannen. Regelmatig onderhoud voor een verzorgde uitstraling.
                            </p>
                            <ul className="text-sm text-muted-foreground space-y-2">
                                <li>• Flexibele plannen</li>
                                <li>• Milieuvriendelijk</li>
                                <li>• Preventief onderhoud</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Form Section */}
            <section id="formulier" className="py-24 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground tracking-tight">
                                Vraag een <span className="text-primary">Vrijblijvende Offerte</span> aan voor {location}
                            </h2>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                Vul het formulier in en ontvang binnen 24 uur een prijsopgave op maat voor uw reinigingsklus in {location}.
                            </p>
                        </div>

                        <ProcessSteps />

                        <div id="keuzehulp" className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 scroll-mt-32">
                            <ContactForm />
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
                    subtitle={`Projecten in ${location} en omgeving`}
                    description="Bekijk onze gerealiseerde projecten. Sleep de slider om het voor- en na-verschil te zien."
                />
            </div>

            {/* FAQ Section */}
            <FAQSection 
                title={`Veelgestelde Vragen over Reinigingsdiensten in ${location}`}
                subtitle="Klantenservice"
            />

            {/* Final CTA */}
            <div className="relative z-10 bg-white">
                <CallToAction 
                    title={`Ook uw buitenruimte in ${location} laten reinigen?`}
                    highlight="Vraag vandaag nog een offerte aan!"
                    description={`Bereschoon staat klaar om uw oprit, terras of gevel in ${location} weer te laten stralen.`}
                />
            </div>
        </PageTransition>
    );
};

export default ReinigingsdienstenEindhoven;
