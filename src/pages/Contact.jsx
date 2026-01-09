import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Mail } from 'lucide-react';
import ContactForm from '../components/ContactForm';
import PageTransition from '../components/PageTransition';

const Contact = () => {
    return (
        <PageTransition>
            <section className="pt-24 pb-20 min-h-screen bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Left Column - Dark Background with Info */}
                        <div className="bg-secondary text-white rounded-xl p-8 lg:p-12">
                            {/* Breadcrumbs */}
                            <div className="text-sm text-white/70 mb-4">
                                <Link to="/" className="hover:text-white transition-colors">Home</Link>
                                <span className="mx-2">/</span>
                                <span>Contact</span>
                            </div>

                            {/* Title */}
                            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                                Neem contact met ons op
                            </h1>

                            {/* Description */}
                            <p className="text-lg text-white/80 leading-relaxed mb-8">
                                Heeft u vragen over onze diensten of wilt u een vrijblijvende offerte aanvragen? 
                                Wij helpen u graag verder. Neem gerust contact met ons op via het formulier 
                                of bel/email ons direct.
                            </p>

                            {/* CTA Buttons */}
                            <div className="space-y-4 mb-12">
                                <Link
                                    to="/configurator"
                                    className="flex items-center justify-center bg-primary hover:bg-primary/90 text-white px-6 py-4 rounded-lg font-bold transition-all shadow-lg hover:shadow-primary/40"
                                >
                                    Offerte aanvragen
                                    <ArrowRight className="ml-2" size={20} />
                                </Link>

                                <a
                                    href="tel:+31612345678"
                                    className="flex items-center justify-center bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-lg font-medium transition-all border border-white/20"
                                >
                                    <Phone className="mr-2" size={20} />
                                    +31 (0)6 1234 5678
                                </a>

                                <a
                                    href="mailto:info@bereschoon.nl"
                                    className="flex items-center justify-center bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-lg font-medium transition-all border border-white/20"
                                >
                                    <Mail className="mr-2" size={20} />
                                    info@bereschoon.nl
                                </a>
                            </div>

                            {/* Company Details */}
                            <div className="border-t border-white/20 pt-8">
                                <h3 className="font-semibold text-white mb-4 text-lg">Bedrijfsgegevens</h3>
                                <div className="space-y-2 text-sm text-white/80">
                                    <p>
                                        <span className="font-medium">KVK:</span> 12345678
                                    </p>
                                    <p>
                                        <span className="font-medium">BTW:</span> NL123456789B01
                                    </p>
                                    <p>
                                        <span className="font-medium">IBAN:</span> NL12RABO0123456789
                                    </p>
                                    <p>
                                        <span className="font-medium">BIC:</span> RABONL2U
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Contact Form */}
                        <div className="flex items-start">
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </section>
        </PageTransition>
    );
};

export default Contact;

