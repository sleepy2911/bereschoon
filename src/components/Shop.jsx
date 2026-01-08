import React from 'react';
import { ShoppingBag, ChevronRight, Check } from 'lucide-react';

const Shop = () => {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-muted/30 skew-x-12 translate-x-32 z-0"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold tracking-tight mb-4 text-foreground">Bereschoon Shop</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Professionele onderhoudsproducten, nu voor iedereen beschikbaar.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Product Video Side */}
                    <div className="lg:w-1/2 relative">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-square md:aspect-[4/3] bg-black">
                            {/* Video */}
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                            >
                                <source src="/product-video.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>

                            {/* Overlay Badge */}
                            <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-lg shadow-sm border border-white/50 animate-bounce">
                                <span className="font-bold text-primary">Nieuw</span>
                            </div>
                        </div>

                        {/* Blob/Glow effect behind video */}
                        <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-full blur-3xl -z-10 opacity-70"></div>
                    </div>

                    {/* Product Details Side */}
                    <div className="lg:w-1/2 space-y-8">
                        <div>
                            <h3 className="text-3xl font-bold mb-2">Bereschoon Ultra Protect</h3>
                            <p className="text-2xl font-medium text-primary mb-6">€ 24,95</p>

                            <p className="text-muted-foreground leading-relaxed mb-6">
                                De ultieme bescherming voor uw terras en oprit. Onze speciaal ontwikkelde formule trekt diep in de steen, stoot vuil en water af en remt de groei van algen en mossen. Het resultaat? Een oprit die langer schoon blijft, met een frisse, nieuwe uitstraling.
                            </p>

                            <ul className="space-y-3 mb-8">
                                {[
                                    'Langdurige bescherming tegen vuil en vocht',
                                    'Remt groene aanslag en onkruid',
                                    'Geschikt voor alle soorten bestrating',
                                    'Eenvoudig zelf aan te brengen'
                                ].map((feature, idx) => (
                                    <li key={idx} className="flex items-center space-x-3 text-foreground/80">
                                        <div className="bg-green-100 text-green-600 rounded-full p-1">
                                            <Check size={14} />
                                        </div>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="flex-1 bg-foreground text-white px-8 py-4 rounded-xl font-bold hover:bg-black transition-all flex items-center justify-center shadow-lg group btn-shine hover-lift">
                                <ShoppingBag className="mr-2" size={20} />
                                In Winkelmandje
                                <ChevronRight className="ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" size={20} />
                            </button>
                            <button className="px-8 py-4 rounded-xl font-medium border border-gray-200 hover:bg-gray-50 transition-colors hover-lift">
                                Meer Informatie
                            </button>
                        </div>

                        <p className="text-xs text-muted-foreground text-center sm:text-left">
                            * Vandaag besteld, morgen in huis. Gratis verzending vanaf €50.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Shop;
