// Services Component - Bereschoon
import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowRight, Home, Droplets, Grid3X3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { staggerContainer, fadeInUp, fadeInLeft, viewportSettings } from '../utils/animations';
import { CurvedDivider } from './effects/WaveDivider';

// Custom Pressure Wash Icon - hogedruk spuit
const PressureWashIcon = ({ size = 24, className = '' }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className={className}
    >
        {/* Spuitkop/nozzle */}
        <path d="M4 12h6" />
        <path d="M10 9v6" />
        <circle cx="13" cy="12" r="2" />
        {/* Water stralen */}
        <path d="M15 10l4-3" />
        <path d="M15 12h6" />
        <path d="M15 14l4 3" />
        {/* Druppels */}
        <circle cx="21" cy="7" r="1" fill="currentColor" />
        <circle cx="22" cy="12" r="1" fill="currentColor" />
        <circle cx="21" cy="17" r="1" fill="currentColor" />
    </svg>
);

const services = [
    {
        title: 'Oprit, Terras & Terrein',
        description: 'Verwijder hardnekkig vuil, groene aanslag en onkruid. Langdurig resultaat gegarandeerd.',
        image: '/images/images_optimized/IMG_3251.webp',
        icon: Grid3X3,
        features: ['Hogedruk reiniging', 'Voegen herstellen', 'Beschermlaag'],
        route: '/oprit-terras-terrein',
    },
    {
        title: 'Gevelreiniging',
        description: 'Verwijder groene aanslag en vuil voor een frisse, nieuwe uitstraling van uw woning.',
        image: '/images/images_optimized/IMG_2566.webp',
        icon: Droplets,
        features: ['Hogedruk reiniging', 'Stoomreiniging', 'Impregneren'],
        route: '/gevelreiniging',
    },
    {
        title: 'Onkruidbeheersing',
        description: 'Houd uw tuin en terras onkruidvrij met onze flexibele onderhoudsplannen.',
        image: '/images/images_optimized/onkruid tuin voor.webp',
        icon: Home,
        features: ['Flexibele plannen', 'Preventief onderhoud', 'Milieuvriendelijk'],
        route: '/onkruidbeheersing',
    },
];

// Pressure Wash Effect - "schoon spuiten" animatie
const PressureWashEffect = ({ isActive }) => {
    return (
        <AnimatePresence>
            {isActive && (
                <motion.div
                    className="absolute inset-0 pointer-events-none overflow-hidden rounded-t-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* De "schone" laag die van links naar rechts beweegt */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/60 to-white/0"
                        initial={{ x: '-100%' }}
                        animate={{ x: '200%' }}
                        transition={{ 
                            duration: 0.8, 
                            ease: "easeOut",
                        }}
                    />
                    
                    {/* Spray particles */}
                    {[...Array(12)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full"
                            style={{
                                left: 0,
                                top: `${15 + (i % 4) * 20}%`,
                            }}
                            initial={{ 
                                x: 0, 
                                opacity: 0,
                                scale: 0.5,
                            }}
                            animate={{ 
                                x: [0, 150 + Math.random() * 200],
                                y: [0, (Math.random() - 0.5) * 40],
                                opacity: [0, 1, 0],
                                scale: [0.5, 1.5, 0.5],
                            }}
                            transition={{
                                duration: 0.6,
                                delay: i * 0.03,
                                ease: "easeOut",
                            }}
                        />
                    ))}

                    {/* Water mist trail */}
                    <motion.div
                        className="absolute top-0 left-0 h-full w-8"
                        style={{
                            background: 'linear-gradient(90deg, rgba(6,182,212,0.4) 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
                            filter: 'blur(4px)',
                        }}
                        initial={{ x: '-100%' }}
                        animate={{ x: '1500%' }}
                        transition={{ 
                            duration: 0.7, 
                            ease: "easeOut",
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const ServiceCard = ({ service, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isButtonHovered, setIsButtonHovered] = useState(false);
    const [showSpray, setShowSpray] = useState(false);

    const handleButtonHover = () => {
        setIsButtonHovered(true);
        setShowSpray(true);
        // Reset spray na animatie
        setTimeout(() => setShowSpray(false), 800);
    };

    return (
        <motion.div
            variants={fadeInUp}
            className="relative group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setIsButtonHovered(false);
            }}
        >
            <motion.div 
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 h-full"
                whileHover={{ 
                    y: -8,
                    boxShadow: '0 25px 50px -12px rgba(132, 204, 22, 0.15)',
                }}
                transition={{ duration: 0.3 }}
            >
                {/* Image Container */}
                <div className="h-64 overflow-hidden relative">
                    <motion.img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover"
                        animate={{ scale: isHovered ? 1.05 : 1 }}
                        transition={{ duration: 0.6 }}
                    />
                    
                    {/* Overlay gradient */}
                    <motion.div 
                        className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
                        animate={{ opacity: isHovered ? 0.8 : 0.6 }}
                    />

                    {/* Icon badge */}
                    <motion.div 
                        className="absolute top-4 right-4 w-11 h-11 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <service.icon className="text-primary" size={22} />
                    </motion.div>

                    {/* Pressure Wash Effect on button hover */}
                    <PressureWashEffect isActive={showSpray} />
                </div>

                {/* Content */}
                <div className="p-8">
                    <motion.h3 
                        className="text-xl font-bold mb-3 group-hover:text-primary transition-colors"
                    >
                        {service.title}
                    </motion.h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                        {service.description}
                    </p>

                    {/* Features list */}
                    <ul className="space-y-2 mb-6">
                        {service.features.map((feature, idx) => (
                            <li 
                                key={idx}
                                className="flex items-center text-sm text-muted-foreground"
                            >
                                <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                                {feature}
                            </li>
                        ))}
                    </ul>

                    {/* Meer info button with spray trigger */}
                    <Link to={service.route}>
                        <motion.div 
                            className="text-primary font-semibold flex items-center relative overflow-hidden px-3 py-1.5 -ml-3 rounded-lg hover:bg-primary/5 transition-colors"
                            onMouseEnter={handleButtonHover}
                            onMouseLeave={() => setIsButtonHovered(false)}
                            whileHover={{ x: 3 }}
                        >
                            <PressureWashIcon size={16} className="mr-2 opacity-70" />
                            Meer info 
                            <ArrowRight size={16} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
                        </motion.div>
                    </Link>
                </div>
            </motion.div>
        </motion.div>
    );
};

const Services = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, viewportSettings);

    return (
        <section id="diensten" className="py-24 bg-white text-foreground relative overflow-hidden">
            {/* Curved divider at top - from brown Stats section */}
            <CurvedDivider position="top" color="fill-secondary" height={60} />

            <div className="container mx-auto px-6 relative z-10" ref={ref}>
                {/* Header */}
                <motion.div 
                    className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <motion.div 
                        className="max-w-2xl"
                        variants={fadeInLeft}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                            Onze Expertise
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Wij combineren vakmanschap met de nieuwste technologieën voor een ongeëvenaard resultaat. 
                            <span className="text-primary font-medium"> Bereschoon gegarandeerd.</span>
                        </p>
                    </motion.div>

                    <Link to="/contact">
                        <motion.div 
                            className="hidden md:flex items-center text-lg font-medium hover:text-primary transition-colors mt-6 md:mt-0 group"
                            whileHover={{ x: 5 }}
                        >
                            Offerte aanvragen 
                            <ArrowUpRight className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={20} />
                        </motion.div>
                    </Link>
                </motion.div>

                {/* Services Grid */}
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    variants={staggerContainer}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                >
                    {services.map((service, index) => (
                        <ServiceCard key={index} service={service} index={index} />
                    ))}
                </motion.div>

                {/* Mobile CTA */}
                <motion.div 
                    className="mt-12 text-center md:hidden"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.5 }}
                >
                    <Link to="/contact" className="inline-flex items-center text-lg font-medium hover:text-primary transition-colors">
                        Offerte aanvragen <ArrowUpRight className="ml-2" size={20} />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default Services;
