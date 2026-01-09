import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ContactCTA = () => {
    return (
        <section className="py-24 bg-secondary text-secondary-foreground relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-primary/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="lg:w-1/2 text-left">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Klaar voor een transformatie?</h2>
                        <p className="text-xl text-stone-200 mb-10 max-w-2xl">
                            Neem vandaag nog contact op voor een vrijblijvende offerte of advies op maat. Wij helpen u graag verder.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-start items-center space-y-4 sm:space-y-0 sm:space-x-6">
                            <Link to="/contact" className="bg-accent text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-accent/90 transition-all transform hover:scale-105 shadow-xl flex items-center">
                                Offerte Aanvragen <ArrowRight className="ml-2" />
                            </Link>
                            <a href="tel:+31612345678" className="text-white text-lg font-medium hover:text-gray-300 transition-colors">
                                Bel direct: +31 (0)6 1234 5678
                            </a>
                        </div>
                    </div>

                    <div className="lg:w-1/2 flex justify-center lg:justify-end">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                            <img
                                src="/images/images_optimized/product-protector.jpg"
                                alt="Bereschoon Terras & Oprit Beschermer"
                                className="relative max-w-sm w-full rounded-2xl shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-500 border border-white/10"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactCTA;
