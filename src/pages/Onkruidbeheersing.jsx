import React from 'react';
import PageTransition from '../components/PageTransition';
import ServiceHero from '../components/ServiceHero';
import ContactForm from '../components/ContactForm';
import ServiceGallery from '../components/ServiceGallery';

const Onkruidbeheersing = () => {
    return (
        <PageTransition>
            {/* Hero Section */}
            <ServiceHero
                title="Onkruidbeheersing"
                subtitle="Professionele Onderhoud"
                description="Houd uw tuin, terras en oprit onkruidvrij met onze professionele onkruidbeheersingsplannen. Regelmatig onderhoud voor een verzorgde uitstraling het hele jaar door."
                image="/images/images_optimized/onkruid tuin voor.webp"
                features={[
                    'Flexibele plannen',
                    'Milieuvriendelijk',
                    'Preventief onderhoud'
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
                                Kies een onderhoudsplan dat bij u past. Wij komen regelmatig langs 
                                om uw buitenruimte onkruidvrij te houden.
                            </p>
                            
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1">Flexibele Plannen</h3>
                                        <p className="text-muted-foreground text-sm">Kies uit onderhoud per 4, 8, 12 of 16 weken.</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1">Milieuvriendelijk</h3>
                                        <p className="text-muted-foreground text-sm">Wij gebruiken milieubewuste methoden en middelen.</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1">Geen Zorgen</h3>
                                        <p className="text-muted-foreground text-sm">Wij plannen de afspraken automatisch in.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Pricing hint */}
                            <div className="mt-8 p-6 bg-primary/5 rounded-xl border border-primary/20">
                                <h4 className="font-semibold text-foreground mb-2">Onderhoudsplannen</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                                        Plan per 4 weken - Intensief onderhoud
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                                        Plan per 8 weken - Standaard onderhoud
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                                        Plan per 12 weken - Licht onderhoud
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                                        Plan per 16 weken - Seizoensonderhoud
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Form Column */}
                        <div>
                            <ContactForm preselectedService="onkruidbeheersing" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <ServiceGallery 
                serviceId="onkruidbeheersing"
                title="Onze Resultaten"
                subtitle="Onkruidbeheersing Projecten"
                description="Bekijk onze gerealiseerde onkruidbeheersingsprojecten. Sleep de slider om het voor- en na-verschil te zien."
            />
        </PageTransition>
    );
};

export default Onkruidbeheersing;

