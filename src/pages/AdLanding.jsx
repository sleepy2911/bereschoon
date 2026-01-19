import React from 'react';
import MinimalHeader from '../components/landing/MinimalHeader';
import AdCalculatorForm from '../components/landing/AdCalculatorForm';
import LogoMarquee from '../components/LogoMarquee';
import TrustIndicators from '../components/TrustIndicators';
import ProjectShowcase from '../components/ProjectShowcase';
import MinimalFooter from '../components/landing/MinimalFooter';
import { Check, Shield, Star, Clock } from 'lucide-react';

const projects = [
    {
        id: 1,
        projectName: 'Villa Renovatie',
        category: 'Gevelreiniging',
        before: '/images/pro/villa-voor.webp',
        after: '/images/pro/villa-na.webp',
        challenge: 'Ernstige vervuiling door jarenlange algengroei en weersinvloeden op de witte gevel.',
        solution: 'Zachte reiniging met stoomtechniek en nabehandeling met hydrofobeermiddel.'
    },
    {
        id: 2,
        projectName: 'Opfrissen Bestrating',
        category: 'Oprit & Terras',
        before: '/images/pro/bestrating-voor.webp',
        after: '/images/pro/bestrating-na.webp',
        challenge: 'Verzakkingen, onkruid en grauwe uitstraling van de bestrating.',
        solution: 'Dieptereiniging, verwijderen van onkruid en opnieuw inzanden voor een strak resultaat.'
    },
    {
        id: 3,
        projectName: 'Woning Dieptereiniging',
        category: 'Totaalonderhoud',
        before: '/images/pro/woning-voor.webp',
        after: '/images/pro/woning-na.webp',
        challenge: 'Diverse aanslag op muren en daklijsten.',
        solution: 'Complete buitenschilreiniging met specialistische apparatuur.'
    }
];

// Placeholder logos if not available via imports
const companyLogos = [
    "/images/company-logos/logo1.webp",
    "/images/company-logos/logo2.webp",
    "/images/company-logos/logo3.webp",
    "/images/company-logos/logo4.webp",
    "/images/company-logos/logo5.webp"
];

const AdLanding = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <MinimalHeader />

            <main className="flex-grow">
                {/* Hero Section with Calculator */}
                <div className="relative min-h-[90vh] flex items-center pt-20 pb-16 bg-[#2D2420] overflow-hidden">
                    {/* Background with Overlay */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/images/hero/home/hero-home1.webp"
                            alt="Background"
                            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
                    </div>

                    <div className="container mx-auto px-6 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">

                            {/* Left Column: Text */}
                            <div className="text-white pt-10 lg:pt-0">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                                    Ontdek wat wij voor <span className="text-primary">u</span> kunnen betekenen
                                </h1>
                                <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-xl">
                                    Ontvang direct een indicatie voor het reinigen van uw oprit, terras of gevel. Professioneel, efficiënt en transparant.
                                </p>

                                <div className="space-y-4 mb-10">
                                    {[
                                        "Persoonlijke offerte op maat",
                                        "Transparante prijzen (Direct inzicht!)",
                                        "Geen verplichtingen",
                                        "Binnen 24 uur contact"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full flex items-center justify-center border border-primary text-primary bg-primary/10">
                                                <Check size={14} strokeWidth={3} />
                                            </div>
                                            <span className="font-medium text-lg">{item}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-4">
                                    <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-lg border border-white/10 flex items-center gap-2">
                                        <Shield className="text-primary" size={20} />
                                        <span className="text-sm font-medium">100% Tevredenheidsgarantie</span>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-lg border border-white/10 flex items-center gap-2">
                                        <Star className="text-primary" size={20} />
                                        <span className="text-sm font-medium">4.9/5 Klantbeoordeling</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Calculator Form */}
                            <div className="lg:pl-10">
                                <AdCalculatorForm />
                            </div>

                        </div>
                    </div>
                </div>

                {/* Logo Bar */}
                <LogoMarquee logos={companyLogos} />

                {/* Social Proof / Trust Section */}
                <div className="py-16 bg-white border-b border-gray-100">
                    <div className="container mx-auto px-6 mb-10 text-center">
                        <h2 className="text-2xl font-bold mb-2">Waarom klanten voor Bereschoon kiezen</h2>
                    </div>
                    <TrustIndicators />
                </div>

                {/* Use Cases Section */}
                <div className="bg-gray-50/50">
                    <div className="container mx-auto px-6 pt-16 pb-8 text-center">
                        <span className="text-primary font-bold tracking-wider uppercase text-sm">Resultaten</span>
                        <h2 className="text-3xl md:text-4xl font-bold mt-2">Recente Projecten</h2>
                        <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
                            Bekijk het verschil dat wij maken. Eerlijke voor- en na-foto's van onze reinigingsdiensten.
                        </p>
                    </div>
                    <ProjectShowcase projects={projects} />
                </div>
            </main>

            <MinimalFooter />
        </div>
    );
};

export default AdLanding;
