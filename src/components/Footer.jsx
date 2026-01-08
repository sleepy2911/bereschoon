import React from 'react';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-secondary text-white pt-16 pb-8 border-t border-white/5">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <img src="/images/logo.png" alt="Bereschoon" className="h-16 w-auto" />
                        <p className="text-stone-300 text-sm leading-relaxed max-w-md">
                            Professionele externe reiniging voor een stralend resultaat. Wij tillen uw vastgoed naar een hoger niveau met geavanceerde reinigingstechnieken.
                        </p>
                        
                        {/* CTA Button */}
                        <Link 
                            to="/configurator"
                            className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/50 hover-lift"
                        >
                            Offerte Aanvragen
                            <ArrowRight size={16} className="ml-2" />
                        </Link>
                    </div>

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
                                <Link to="/reviews" className="text-stone-300 hover:text-white transition-colors">
                                    Reviews
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
                                <span className="text-stone-300">Amsterdam, Nederland</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail size={18} className="text-primary flex-shrink-0" />
                                <a href="mailto:info@bereschoon.nl" className="text-stone-300 hover:text-white transition-colors">
                                    info@bereschoon.nl
                                </a>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone size={18} className="text-primary flex-shrink-0" />
                                <a href="tel:+31612345678" className="text-stone-300 hover:text-white transition-colors">
                                    +31 (0)6 1234 5678
                                </a>
                            </li>
                        </ul>
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
