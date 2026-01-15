import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, User, Star } from 'lucide-react';
import ContactForm from '../components/ContactForm';
import PageTransition from '../components/PageTransition';

const Contact = () => {
    return (
        <PageTransition>
            <section className="pt-32 pb-24 min-h-screen bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                        {/* Left Column - Clean, Unified Text Block */}
                        <div className="flex flex-col h-full lg:pt-8">
                            {/* Main Header Group */}
                            <div className="mb-8">
                                <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-6 leading-tight">
                                    Persoonlijk contact met Bereschoon
                                </h1>
                                <p className="text-lg text-stone-600 leading-relaxed max-w-lg">
                                    Wij helpen particulieren en bedrijven met professionele buitenreiniging. U spreekt direct met een specialist.
                                </p>
                            </div>

                            {/* Trust Indicators - Single Line, Subtle */}
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-secondary font-medium mb-12">
                                <a
                                    href="https://www.google.com/search?q=Bereschoon+Helmond+reviews"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                                >
                                    <div className="flex items-center gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="font-bold">4.8/5</span>
                                    <span className="text-stone-500">(125+ Google reviews)</span>
                                </a>
                                <span className="text-stone-300 hidden sm:inline">•</span>
                                <span>1000+ projecten</span>
                                <span className="text-stone-300 hidden sm:inline">•</span>
                                <span>10+ jaar ervaring</span>
                                <span className="text-stone-300 hidden sm:inline">•</span>
                                <span>Garantie</span>
                            </div>

                            {/* Intro Text */}
                            <p className="text-stone-600 leading-relaxed mb-12 max-w-lg">
                                Bereschoon is actief door heel Nederland met eigen materieel en vakmensen. Kwaliteit en langdurig resultaat staan centraal.
                            </p>

                            {/* Direct Contact - Simple List */}
                            <div className="space-y-4 mb-10">
                                <a href="tel:+31639494059" className="flex items-center gap-4 text-secondary hover:text-primary transition-colors group w-fit">
                                    <Phone className="text-primary group-hover:scale-110 transition-transform" size={20} />
                                    <span className="font-semibold text-lg">+31 (0)6 3949 4059</span>
                                </a>
                                <a href="mailto:info@bereschoon.nl" className="flex items-center gap-4 text-secondary hover:text-primary transition-colors group w-fit">
                                    <Mail className="text-primary group-hover:scale-110 transition-transform" size={20} />
                                    <span className="font-semibold text-lg">info@bereschoon.nl</span>
                                </a>
                                <div className="flex items-center gap-4 text-secondary">
                                    <MapPin className="text-primary" size={20} />
                                    <span className="font-medium">Helmond, Nederland</span>
                                </div>
                            </div>

                            {/* Human Touch */}
                            <div className="flex items-center gap-3 text-stone-500 mb-16">
                                <User size={18} className="text-stone-400" />
                                <span>U spreekt direct met ons team — geen tussenpersonen.</span>
                            </div>

                            {/* Footer/Legal Details */}
                            <div className="mt-auto pt-6 text-xs text-stone-400 flex gap-6">
                                <span>KVK: 91411629</span>
                                <span>BTW: NL91411629B01</span>
                            </div>
                        </div>

                        {/* Right Column - Contact Form */}
                        {/* Clean white card, soft shadow, NO colored top border */}
                        <div className="bg-white rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-100 overflow-hidden">
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </section>
        </PageTransition>
    );
};

export default Contact;
