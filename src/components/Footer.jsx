import React, { useState } from 'react';
import { Mail, Phone, MapPin, Linkedin, Instagram, MessageCircle, Loader2, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GOOGLE_REVIEW_DATA } from '../data/reviews';

const Footer = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const baseUrl = import.meta.env.VITE_SUPABASE_URL;
            if (!baseUrl) {
                throw new Error('Server configuratie ontbreekt');
            }

            const edgeFunctionUrl = `${baseUrl}/functions/v1/submit-service-request`;

            // Create FormData with service_type "terugbelverzoek"
            const formDataToSend = new FormData();
            formDataToSend.append('service_type', 'terugbelverzoek');
            formDataToSend.append('name', formData.name);
            formDataToSend.append('email', formData.email);
            if (formData.phone) formDataToSend.append('phone', formData.phone);

            const response = await fetch(edgeFunctionUrl, {
                method: 'POST',
                headers: {
                    'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || ''
                },
                body: formDataToSend
            });

            const responseData = await response.json().catch(() => ({ error: 'Onbekende fout' }));

            if (!response.ok) {
                throw new Error(responseData.error || 'Verzenden mislukt');
            }

            console.log('Footer form submitted successfully:', responseData);
            setIsSubmitted(true);
            setFormData({ name: '', email: '', phone: '' });

            // Reset success message after 5 seconds
            setTimeout(() => setIsSubmitted(false), 5000);
        } catch (err) {
            console.error('Error submitting footer form:', err);
            setError(err instanceof Error ? err.message : 'Er is een fout opgetreden');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <footer className="bg-secondary text-white pt-10 md:pt-16 pb-6 md:pb-8 border-t border-white/5">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mb-8 md:mb-12">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <img src="/images/logo.png" alt="Bereschoon" className="h-16 w-auto" />
                        <p className="text-stone-300 text-sm leading-relaxed max-w-md">
                            Ga voor een Bereschoon resultaat. Wij reinigen uw oprit en gevel grondig met milieuvriendelijke producten. Een stralende buitenruimte, op een duurzame manier.
                        </p>

                        {/* Trust Badges */}
                        <div className="flex flex-col gap-4">
                            {/* Review Placeholder */}
                            <a
                                href={GOOGLE_REVIEW_DATA.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/10 max-w-max hover:bg-white/10 transition-colors cursor-pointer"
                            >
                                <div className="text-yellow-400 flex text-sm">★★★★★</div>
                                <div className="text-xs text-stone-300">
                                    <span className="font-bold text-white">{GOOGLE_REVIEW_DATA.score}/5</span> op Google
                                </div>
                            </a>

                            {/* Company Details */}
                            <div className="text-xs text-stone-400 space-y-1">
                                <p>KvK: 91411629</p>
                                <p>BTW: NL91411629B01</p>
                                <p className="flex items-center gap-1.5 mt-2 text-stone-300">
                                    <MapPin size={12} className="text-primary" />
                                    Werkgebied: Noord-Brabant & omstreken
                                </p>
                            </div>
                        </div>

                        {/* Social Media Icons */}
                        <div className="flex items-center gap-3 mt-4">
                            <a
                                href="https://www.linkedin.com/company/bereschoon"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full border border-white/30 bg-white/5 flex items-center justify-center hover:bg-white/10 hover:border-white/50 transition-all"
                                aria-label="LinkedIn"
                            >
                                <Linkedin size={18} className="text-white" />
                            </a>
                            <a
                                href="https://wa.me/31639494059"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full border border-white/30 bg-white/5 flex items-center justify-center hover:bg-white/10 hover:border-white/50 transition-all"
                                aria-label="WhatsApp"
                            >
                                <MessageCircle size={18} className="text-white" />
                            </a>
                            <a
                                href="https://www.instagram.com/bereschoon"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full border border-white/30 bg-white/5 flex items-center justify-center hover:bg-white/10 hover:border-white/50 transition-all"
                                aria-label="Instagram"
                            >
                                <Instagram size={18} className="text-white" />
                            </a>
                            <a
                                href="mailto:info@bereschoon.nl"
                                className="w-10 h-10 rounded-full border border-white/30 bg-white/5 flex items-center justify-center hover:bg-white/10 hover:border-white/50 transition-all"
                                aria-label="Email"
                            >
                                <Mail size={18} className="text-white" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links & Contact Combined */}
                    <div className="flex flex-col lg:flex-row gap-10 lg:gap-32 pt-6">
                        {/* Quick Links */}
                        <div>
                            <h4 className="font-semibold text-white mb-6">Snelle Links</h4>
                            <ul className="space-y-3 text-sm">
                                <li>
                                    <Link to="/#diensten" className="text-stone-300 hover:text-white transition-colors">
                                        Diensten
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/projecten" className="text-stone-300 hover:text-white transition-colors">
                                        Projecten
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/winkel" className="text-stone-300 hover:text-white transition-colors">
                                        Winkel
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/configurator" className="text-stone-300 hover:text-white transition-colors">
                                        AI Oprit Scan
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="font-semibold text-white mb-6">Contact</h4>
                            <ul className="space-y-4 text-sm">
                                <li className="flex items-start space-x-3">
                                    <MapPin size={18} className="text-primary mt-0.5 flex-shrink-0" />
                                    <span className="text-stone-300">Helmond, Nederland</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <Mail size={18} className="text-primary flex-shrink-0" />
                                    <a href="mailto:info@bereschoon.nl" className="text-stone-300 hover:text-white transition-colors">
                                        info@bereschoon.nl
                                    </a>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <Phone size={18} className="text-primary flex-shrink-0" />
                                    <a href="tel:+31639494059" className="text-stone-300 hover:text-white transition-colors">
                                        06 39494059
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 md:p-6 border border-white/10">
                        <h4 className="font-semibold text-white mb-3">Nieuwsgierig geworden?</h4>
                        <p className="text-stone-300 text-sm mb-6">
                            Laat je gegevens achter en wij nemen zo snel mogelijk contact op.
                        </p>

                        {isSubmitted ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Check className="text-primary" size={24} />
                                    </div>
                                    <p className="text-white font-medium">Bedankt!</p>
                                    <p className="text-stone-300 text-sm">We nemen snel contact op.</p>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error && (
                                    <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-3 py-2 rounded-lg text-sm">
                                        {error}
                                    </div>
                                )}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="footer-name" className="block text-sm text-stone-300 mb-2">
                                            Naam <span className="text-primary">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="footer-name"
                                            name="name"
                                            required
                                            disabled={isSubmitting}
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-white placeholder-stone-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-base md:text-sm disabled:opacity-50"
                                            placeholder="Naam"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="footer-email" className="block text-sm text-stone-300 mb-2">
                                            Email <span className="text-primary">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            id="footer-email"
                                            name="email"
                                            required
                                            disabled={isSubmitting}
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-white placeholder-stone-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-base md:text-sm disabled:opacity-50"
                                            placeholder="Email"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="footer-phone" className="block text-sm text-stone-300 mb-2">
                                        Telefoonnummer (optioneel)
                                    </label>
                                    <input
                                        type="tel"
                                        id="footer-phone"
                                        name="phone"
                                        disabled={isSubmitting}
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-white placeholder-stone-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-base md:text-sm disabled:opacity-50"
                                        placeholder="Telefoonnummer"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/50 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="animate-spin mr-2" size={18} />
                                            Verzenden...
                                        </>
                                    ) : (
                                        'Versturen'
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 space-y-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-xs text-stone-300 text-center md:text-left">
                            &copy; {new Date().getFullYear()} Bereschoon. Alle rechten voorbehouden.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6 text-xs text-stone-300">
                            <a href="#" className="hover:text-white transition-colors">Privacybeleid</a>
                            <a href="#" className="hover:text-white transition-colors">Algemene Voorwaarden</a>
                            <a href="#" className="hover:text-white transition-colors">Cookiebeleid</a>
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-stone-400">
                            Bereschoon powered by{' '}
                            <a
                                href="https://rootandlogic.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-stone-300 hover:text-white transition-colors underline"
                            >
                                Root & Logic
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
