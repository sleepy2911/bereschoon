import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useInView } from 'framer-motion';
import { Droplets, Check } from 'lucide-react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { viewportSettings } from '../utils/animations';

// Map service IDs to Supabase tables
const serviceTableMap = {
    'oprit-terras-terrein': 'opritreiniging_projects',
    'gevelreiniging': 'gevelreiniging_projects',
    'onkruidbeheersing': 'onkruidbeheersing_projects'
};

// Default categories for each service
const serviceCategoryDefaults = {
    'oprit-terras-terrein': 'Oprit & Terras',
    'gevelreiniging': 'Gevel',
    'onkruidbeheersing': 'Tuin'
};

// Function to fetch projects for a specific service
const fetchServiceProjects = async (serviceId) => {
    const tableName = serviceTableMap[serviceId];
    if (!tableName) {
        console.warn(`No table mapped for service: ${serviceId}`);
        return [];
    }

    try {
        console.log(`Fetching from ${tableName}...`);
        const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error(`Error fetching from ${tableName}:`, error);
            return [];
        }

        if (!data || data.length === 0) {
            console.log(`No projects found in ${tableName}`);
            return [];
        }

        // Transform database projects to match the expected format
        return data
            .filter(project => project.before_image_url && project.after_image_url)
            .map(project => ({
                id: project.id,
                projectName: project.name,
                before: project.before_image_url,
                after: project.after_image_url,
                category: serviceCategoryDefaults[serviceId] || 'Project',
                date: project.date,
                // Try multiple casing options as Supabase can be tricky with quoted identifiers
                challenge: project['Uitdaging'] || project['uitdaging'] || project.challenge || "",
                solution: project['Oplossing'] || project['oplossing'] || project.solution || ""
            }));

    } catch (error) {
        console.error('Exception in fetchServiceProjects:', error);
        return [];
    }
};

const ServiceGallery = ({
    serviceId,
    title = "Onze Resultaten",
    subtitle = "Portfolio",
    description = "Bekijk het verschil: sleep de slider om het resultaat te zien."
}) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const ref = useRef(null);
    const isInView = useInView(ref, viewportSettings);

    // Fetch projects from database
    useEffect(() => {
        const loadProjects = async () => {
            if (!serviceId) return;

            setLoading(true);
            const data = await fetchServiceProjects(serviceId);
            setProjects(data);
            setLoading(false);
        };

        loadProjects();
    }, [serviceId]);

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
            thumbnail: projectList[0],
            challenge: projectList[0].challenge,
            solution: projectList[0].solution
        }));
    }, [projects]);

    // Don't render if no projects and not loading
    if (!loading && groupedProjects.length === 0) {
        return null;
    }

    return (
        <section className="py-24 bg-white" ref={ref}>
            <div className="container mx-auto px-6">
                {/* Header */}
                <motion.div
                    className="text-center mb-16"
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
                        {subtitle}
                    </motion.span>
                    <h2 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
                        {title}
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        {description}
                    </p>
                </motion.div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                )}

                {/* Featured Projects (Large Sliders) */}
                {!loading && groupedProjects.length > 0 && (
                    <div className="space-y-24">
                        {groupedProjects.slice(0, 3).map((group, index) => (
                            <motion.div
                                key={group.name}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.7 }}
                                className="grid lg:grid-cols-2 gap-12 items-center"
                            >
                                {/* Text Content - Alternating Order */}
                                <div className={`order-2 ${index % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
                                    <h3 className="text-3xl font-bold text-foreground mb-6">
                                        {group.name}
                                    </h3>
                                    <div className="space-y-6 mb-8">
                                        <div className="flex items-start gap-4">
                                            <div className="bg-green-100 p-2 rounded-full mt-1 shrink-0">
                                                <Check size={18} className="text-green-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-foreground text-lg mb-1">Uitdaging</h4>
                                                <p className="text-muted-foreground leading-relaxed">{group.challenge}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="bg-green-100 p-2 rounded-full mt-1 shrink-0">
                                                <Check size={18} className="text-green-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-foreground text-lg mb-1">Oplossing</h4>
                                                <p className="text-muted-foreground leading-relaxed">{group.solution}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Slider - Alternating Order */}
                                <div className={`order-1 ${index % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
                                    <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100 h-[350px] md:h-[450px]">
                                        <ReactCompareSlider
                                            itemOne={
                                                <ReactCompareSliderImage
                                                    src={group.thumbnail.before}
                                                    alt={`${group.name} - Voor`}
                                                />
                                            }
                                            itemTwo={
                                                <ReactCompareSliderImage
                                                    src={group.thumbnail.after}
                                                    alt={`${group.name} - Na`}
                                                />
                                            }
                                            className="w-full h-full"
                                        />
                                        <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-bold rounded z-10">
                                            VOOR
                                        </div>
                                        <div className="absolute top-4 right-4 px-3 py-1 bg-primary/90 backdrop-blur-md text-white text-xs font-bold rounded z-10">
                                            NA
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ServiceGallery;
