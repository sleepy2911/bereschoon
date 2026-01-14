import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ZoomIn, Droplets, ArrowLeft } from 'lucide-react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { fadeInUp, staggerContainer, viewportSettings } from '../utils/animations';
import { supabase } from '../lib/supabase';

// Function to fetch projects from database
const fetchProjects = async () => {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        console.log('🔍 Projects Query Result:', { 
            data, 
            error, 
            dataLength: data?.length,
            hasError: !!error 
        });

        if (error) {
            console.error('❌ Error fetching projects:', error);
            return [];
        }

        if (!data || data.length === 0) {
            console.warn('⚠️ No projects returned from database');
            return [];
        }

        console.log('✅ Raw projects:', data);

        // Transform database projects to match the expected format
        const transformed = data
            .filter(project => project.before_image_url && project.after_image_url)
            .map(project => ({
                id: project.id,
                projectName: project.name,
                before: project.before_image_url,
                after: project.after_image_url,
                category: getCategoryFromName(project.name),
                date: project.date
            }));

        console.log('✅ Transformed projects:', transformed);
        return transformed;
    } catch (error) {
        console.error('❌ Exception in fetchProjects:', error);
        return [];
    }
};

const getCategoryFromName = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('drive') || lowerName.includes('oprit') || lowerName.includes('hoek')) return 'Oprit';
    if (lowerName.includes('ingang') || lowerName.includes('gevel')) return 'Gevel';
    if (lowerName.includes('tuin') || lowerName.includes('terras')) return 'Tuin';
    if (lowerName.includes('villa') || lowerName.includes('huis')) return 'Woning';
    return 'Project';
};

// Before/After Slider Modal
const BeforeAfterModal = ({ projectGroup, onClose, onPrev, onNext, currentGroupIndex, totalGroups }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const projectImages = projectGroup.projects;

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % projectImages.length);
        setSliderPosition(50); // Reset slider position
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + projectImages.length) % projectImages.length);
        setSliderPosition(50); // Reset slider position
    };

    const currentProject = projectImages[currentImageIndex];

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            {/* Close button */}
            <motion.button
                className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
            >
                <X size={24} />
            </motion.button>

            {/* Project counter */}
            <div className="absolute top-6 left-6 text-white/70 text-sm z-10">
                Project {currentGroupIndex + 1} / {totalGroups}
                {projectImages.length > 1 && (
                    <span className="ml-2">• Foto {currentImageIndex + 1} / {projectImages.length}</span>
                )}
            </div>

            {/* Navigation between projects */}
            {totalGroups > 1 && (
                <>
                    <motion.button
                        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
                        onClick={(e) => { e.stopPropagation(); onPrev(); }}
                        whileHover={{ scale: 1.1, x: -5 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <ChevronLeft size={32} />
                    </motion.button>
                    <motion.button
                        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
                        onClick={(e) => { e.stopPropagation(); onNext(); }}
                        whileHover={{ scale: 1.1, x: 5 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <ChevronRight size={32} />
                    </motion.button>
                </>
            )}

            {/* Main Slider */}
            <motion.div
                className="relative max-w-6xl max-h-[90vh] mx-4 w-full"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
            >
                <div className="relative rounded-lg overflow-hidden shadow-2xl bg-black">
                    <motion.div
                        key={currentImageIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ReactCompareSlider
                            itemOne={
                                <ReactCompareSliderImage
                                    src={currentProject.before}
                                    alt={`${currentProject.projectName} - Voor`}
                                />
                            }
                            itemTwo={
                                <ReactCompareSliderImage
                                    src={currentProject.after}
                                    alt={`${currentProject.projectName} - Na`}
                                />
                            }
                            position={sliderPosition}
                            onPositionChange={setSliderPosition}
                            className="w-full h-[70vh] md:h-[80vh]"
                        />
                    </motion.div>
                    
                    {/* Labels */}
                    <div className="absolute top-4 left-4 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm font-semibold">
                        VOOR
                    </div>
                    <div className="absolute top-4 right-4 px-4 py-2 bg-primary/90 backdrop-blur-sm rounded-full text-white text-sm font-semibold">
                        NA
                    </div>

                    {/* Navigation between images in same project */}
                    {projectImages.length > 1 && (
                        <>
                            <motion.button
                                className="absolute left-4 bottom-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <ChevronLeft size={20} />
                            </motion.button>
                            <motion.button
                                className="absolute right-4 bottom-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <ChevronRight size={20} />
                            </motion.button>
                        </>
                    )}
                </div>

                {/* Project info */}
                <motion.div
                    className="mt-4 p-6 bg-white/10 backdrop-blur-sm rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h3 className="text-white text-2xl font-bold mb-2">{currentProject.projectName}</h3>
                    <span className="text-primary text-sm font-medium">{currentProject.category}</span>
                </motion.div>

                {/* Image thumbnails for this project */}
                {projectImages.length > 1 && (
                    <div className="mt-4 flex gap-2 justify-center overflow-x-auto pb-2">
                        {projectImages.map((img, idx) => (
                            <motion.button
                                key={idx}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentImageIndex(idx);
                                    setSliderPosition(50);
                                }}
                                className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                    idx === currentImageIndex
                                        ? 'border-primary scale-110'
                                        : 'border-transparent opacity-60 hover:opacity-100'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <img
                                    src={img.after}
                                    alt={`Thumbnail ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </motion.button>
                        ))}
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

// Project Card Component
const ProjectCard = ({ project, onClick, index }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            className="relative cursor-pointer overflow-hidden rounded-xl group"
            variants={fadeInUp}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Static Image Preview - shows "after" image */}
            <div className="relative h-64 overflow-hidden">
                <motion.img
                    src={project.after}
                    alt={`${project.projectName} - Resultaat`}
                    className="w-full h-full object-cover"
                    animate={{ scale: isHovered ? 1.1 : 1 }}
                    transition={{ duration: 0.4 }}
                />
                
                {/* Hover overlay */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="flex items-center justify-between w-full">
                        <div>
                            <h4 className="text-white font-semibold text-base">{project.projectName}</h4>
                            <span className="text-primary text-xs">{project.category}</span>
                        </div>
                        <motion.div
                            className="p-2 bg-white/20 rounded-full backdrop-blur-sm"
                            whileHover={{ scale: 1.2 }}
                        >
                            <ZoomIn size={20} className="text-white" />
                        </motion.div>
                    </div>
                </motion.div>

                {/* Before/After indicator badge */}
                <div className="absolute top-2 left-2 flex gap-2">
                    <span className="px-2 py-1 bg-primary/90 backdrop-blur-sm rounded text-white text-xs font-semibold">
                        VOOR / NA
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

const Gallery = () => {
    const [selectedGroupIndex, setSelectedGroupIndex] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const ref = useRef(null);
    const isInView = useInView(ref, viewportSettings);

    // Fetch projects from database
    useEffect(() => {
        const loadProjects = async () => {
            setLoading(true);
            const projectsData = await fetchProjects();
            setProjects(projectsData);
            setLoading(false);
        };

        loadProjects();
    }, []);

    // Group projects by project name
    const groupedProjects = useMemo(() => {
        const groups = {};
        projects.forEach(project => {
            if (!groups[project.projectName]) {
                groups[project.projectName] = [];
            }
            groups[project.projectName].push(project);
        });
        return Object.entries(groups).map(([name, projectList]) => ({
            name,
            projects: projectList,
            category: projectList[0].category,
            thumbnail: projectList[0]
        }));
    }, [projects]);

    const openModal = (groupIndex) => {
        setSelectedGroupIndex(groupIndex);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const nextProject = () => {
        setSelectedGroupIndex((prev) => (prev + 1) % groupedProjects.length);
    };

    const prevProject = () => {
        setSelectedGroupIndex((prev) => (prev - 1 + groupedProjects.length) % groupedProjects.length);
    };

    // Keyboard navigation
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (!modalOpen) return;
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowRight') nextProject();
            if (e.key === 'ArrowLeft') prevProject();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [modalOpen, selectedGroupIndex, groupedProjects.length]);

    return (
        <section className="py-24 bg-white" ref={ref}>
            <div className="container mx-auto px-6">
                {/* Header */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <motion.span
                        className="inline-flex items-center gap-2 text-primary font-medium text-sm mb-4"
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ delay: 0.2 }}
                    >
                        <Droplets size={16} />
                        Portfolio
                    </motion.span>
                    <h2 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
                        Gerealiseerde Projecten
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Bekijk het verschil: sleep de slider om het resultaat te zien. Klik op een project voor een groter beeld.
                    </p>
                </motion.div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && groupedProjects.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground text-lg">Geen projecten gevonden.</p>
                    </div>
                )}

                {/* Projects Grid */}
                {!loading && groupedProjects.length > 0 && (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        variants={staggerContainer}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                    >
                        {groupedProjects.map((group, groupIndex) => (
                            <ProjectCard
                                key={group.name}
                                project={group.thumbnail}
                                onClick={() => openModal(groupIndex, 0)}
                                index={groupIndex}
                            />
                        ))}
                    </motion.div>
                )}
            </div>

            {/* Before/After Modal */}
            <AnimatePresence>
                {modalOpen && selectedGroupIndex !== null && (
                    <BeforeAfterModal
                        projectGroup={groupedProjects[selectedGroupIndex]}
                        onClose={closeModal}
                        onPrev={prevProject}
                        onNext={nextProject}
                        currentGroupIndex={selectedGroupIndex}
                        totalGroups={groupedProjects.length}
                    />
                )}
            </AnimatePresence>
        </section>
    );
};

export default Gallery;
