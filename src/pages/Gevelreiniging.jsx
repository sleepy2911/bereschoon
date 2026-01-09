import React from 'react';
import PageTransition from '../components/PageTransition';
import ServiceHero from '../components/ServiceHero';
import ContactForm from '../components/ContactForm';
import ServiceGallery from '../components/ServiceGallery';

const Gevelreiniging = () => {
    return (
        <PageTransition>
            {/* Hero Section */}
            <ServiceHero
                title="Gevelreiniging"
                subtitle="Professionele Reiniging"
                description="Verwijder groene aanslag, algen en vuil van uw gevel. Met onze milde en effectieve reinigingstechnieken herstellen wij de uitstraling van uw woning zonder schade."
                image="/images/images_optimized/IMG_2566.webp"
                features={[
                    'Hogedruk reiniging',
                    'Stoomreiniging',
                    'Gevelimpregnatie'
                ]}
                ctaText="Direct Offerte Aanvragen"
            />

            {/* Form Section */}
            <section id="formulier" className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Info Column */}
                        <div className="lg:sticky lg:top-32">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                                Vraag een <span className="text-primary">Vrijblijvende Offerte</span> aan
                            </h2>
                            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                                Vul het formulier in en wij nemen binnen 24 uur contact met u op. 
                                U kunt ook direct bellen voor een snelle reactie.
                            </p>
                            
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1">Veilige Methoden</h3>
                                        <p className="text-muted-foreground text-sm">Wij gebruiken milde technieken die uw gevel niet beschadigen.</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1">Langdurig Resultaat</h3>
                                        <p className="text-muted-foreground text-sm">Met gevelimpregnatie blijft uw gevel langer schoon.</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1">Alle Geveltypen</h3>
                                        <p className="text-muted-foreground text-sm">Van metselwerk tot pleisterwerk, wij reinigen alle geveltypen.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Column */}
                        <div>
                            <ContactForm preselectedService="gevelreiniging" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <ServiceGallery 
                serviceId="gevelreiniging"
                title="Onze Resultaten"
                subtitle="Gevelreiniging Projecten"
                description="Bekijk onze gerealiseerde gevelreinigingsprojecten. Sleep de slider om het voor- en na-verschil te zien."
            />
        </PageTransition>
    );
};

export default Gevelreiniging;

