import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import ServiceHero from '../components/ServiceHero';
import ProjectShowcase from '../components/ProjectShowcase';
import ProjectGrid from '../components/ProjectGrid';
import ProjectModal from '../components/ProjectModal';
import TrustIndicators from '../components/TrustIndicators';
import ProcessSteps from '../components/ProcessSteps';
import CallToAction from '../components/CallToAction';
import { fetchProjects } from '../lib/projects';
import SEO from '../components/SEO';
import { GOOGLE_REVIEW_DATA } from '../data/reviews';

const Projecten = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProjectIndex, setSelectedProjectIndex] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const loadProjects = async () => {
            setLoading(true);
            const data = await fetchProjects();
            setProjects(data);
            setLoading(false);
        };
        loadProjects();
    }, []);

    // Split projects into Showcase (Featured) and Grid (Everything else)
    const showcaseProjects = projects.filter(p => p.is_featured);
    // Grid displays non-featured projects, or maybe ALL remaining?
    // Let's show all non-featured projects in the grid.
    const gridProjects = projects.filter(p => !p.is_featured);

    const handleProjectClick = (project) => {
        // Find index of clicked project in the full 'projects' array
        // (Assuming modal navigates through ALL projects for continuity)
        const index = projects.findIndex(p => p.id === project.id);
        if (index !== -1) {
            setSelectedProjectIndex(index);
            setModalOpen(true);
        }
    };

    const nextProject = () => {
        setSelectedProjectIndex((prev) => (prev + 1) % projects.length);
    };

    const prevProject = () => {
        setSelectedProjectIndex((prev) => (prev - 1 + projects.length) % projects.length);
    };

    return (
        <PageTransition>
            <SEO
                title="Projecten"
                description="Bekijk onze gerealiseerde projecten. Van opritreiniging tot gevelreiniging, zie het resultaat van ons werk."
                breadcrumbs={[
                    { name: 'Home', url: 'https://bereschoon.nl' },
                    { name: 'Projecten', url: 'https://bereschoon.nl/projecten' }
                ]}
            />

            <ServiceHero
                title="Gerealiseerde Projecten"
                subtitle="Onze Trots"
                description="Een selectie van recente werkzaamheden. Van opritreiniging tot gevelreiniging, wij leveren altijd topkwaliteit."
                images={[
                    '/images/hero/projecten/hero-projecten1.webp',
                    '/images/hero/projecten/hero-projecten2.webp',
                    '/images/hero/projecten/hero-projecten3.webp'
                ]}
                features={[
                    '500+ Projecten',
                    'Jarenlange Ervaring',
                    '100% Tevredenheid'
                ]}
                ctaText="Direct Offerte Aanvragen"
                ctaHref="/contact"
                reviewData={{
                    ...GOOGLE_REVIEW_DATA,
                    quote: "Afspraken nagekomen en top resultaat! – Familie de Vries"
                }}
                companyLogos={[
                    "/images/company-logos/logo1.webp",
                    "/images/company-logos/logo2.webp",
                    "/images/company-logos/logo3.webp",
                    "/images/company-logos/logo4.webp",
                    "/images/company-logos/logo5.webp",
                    "/images/company-logos/logo6.webp"
                ]}
            />

            <div className="container mx-auto px-6">

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        <p className="text-gray-400">Projecten laden...</p>
                    </div>
                )}

                {!loading && (
                    <>
                        {/* Hero / Showcase Section */}
                        {/* Only show if there are actual featured projects */}
                        {showcaseProjects.length > 0 && (
                            <div className="mb-24">
                                <ProjectShowcase projects={showcaseProjects} />
                            </div>
                        )}

                        {/* Grid Section */}
                        {gridProjects.length > 0 && (
                            <div id="resultaten" className="mb-24">
                                <div className="text-center mb-8">
                                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                                        Ons Portfolio
                                    </span>
                                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                                        Meer Projecten
                                    </h2>
                                    <p className="text-lg text-gray-500 max-w-2xl mx-auto font-light">
                                        Gebruik de filters om specifieke categorieën te bekijken.
                                    </p>
                                </div>
                                <ProjectGrid
                                    projects={gridProjects}
                                    onProjectClick={handleProjectClick}
                                />
                            </div>
                        )}

                        {/* Empty State if absolutely nothing */}
                        {projects.length === 0 && (
                            <div className="text-center py-24 text-gray-500">
                                Nog geen projecten beschikbaar.
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Process Section */}
            <div className="bg-gray-50 py-24 border-t border-gray-100">
                <div className="container mx-auto px-6">
                    <ProcessSteps />
                </div>
            </div>

            {/* CTA Section */}
            <div id="formulier">
                <CallToAction
                    title="Ook uw project"
                    highlight="laten uitvoeren?"
                    description="Wij staan klaar om uw woning of bedrijfspand weer te laten stralen."
                />
            </div>

            {/* Modal */}
            <AnimatePresence>
                {modalOpen && selectedProjectIndex !== null && (
                    <ProjectModal
                        project={projects[selectedProjectIndex]}
                        onClose={() => setModalOpen(false)}
                        onNext={nextProject}
                        onPrev={prevProject}
                        hasNext={projects.length > 1}
                        hasPrev={projects.length > 1}
                    />
                )}
            </AnimatePresence>

        </PageTransition>
    );
};

export default Projecten;
