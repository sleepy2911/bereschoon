import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, ArrowRight, Check } from 'lucide-react';
import WaveDivider from './effects/WaveDivider';
import { heroStagger, heroText } from '../utils/animations';

const ServiceHero = ({ 
    title, 
    subtitle,
    description, 
    image, 
    features = [],
    ctaText = "Direct Aanvragen",
    ctaHref = "#formulier"
}) => {
    const { scrollY } = useScroll();
    
    // Parallax effect
    const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);
    const contentY = useTransform(scrollY, [0, 500], [0, 50]);
    const opacity = useTransform(scrollY, [0, 400], [1, 0]);

    const scrollToForm = (e) => {
        e.preventDefault();
        const formElement = document.getElementById('formulier');
        if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-secondary">
            {/* Parallax Background */}
            <motion.div 
                className="absolute inset-0 z-0"
                style={{ y: backgroundY }}
            >
                {/* Background Image */}
                <motion.img
                    src={image}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-secondary/90 z-10" />
            </motion.div>

            {/* Main Content */}
            <motion.div 
                className="relative z-20 text-center px-6 max-w-4xl mx-auto"
                style={{ y: contentY, opacity }}
                variants={heroStagger}
                initial="hidden"
                animate="visible"
            >
                {/* Subtitle badge */}
                {subtitle && (
                    <motion.div
                        variants={heroText}
                        className="inline-block mb-6"
                    >
                        <span className="bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border border-primary/30">
                            {subtitle}
                        </span>
                    </motion.div>
                )}

                {/* Main Title */}
                <motion.h1 
                    variants={heroText}
                    className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight text-white"
                >
                    {title}
                </motion.h1>

                {/* Description */}
                <motion.p 
                    variants={heroText}
                    className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed"
                >
                    {description}
                </motion.p>

                {/* Features List */}
                {features.length > 0 && (
                    <motion.div
                        variants={heroText}
                        className="flex flex-wrap justify-center gap-4 mb-10"
                    >
                        {features.map((feature, index) => (
                            <div 
                                key={index}
                                className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20"
                            >
                                <Check size={16} className="text-primary mr-2" />
                                <span className="text-white text-sm font-medium">{feature}</span>
                            </div>
                        ))}
                    </motion.div>
                )}

                {/* CTA Button */}
                <motion.div 
                    variants={heroText}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <motion.button
                        onClick={scrollToForm}
                        className="group bg-primary text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-primary/90 transition-all flex items-center shadow-[0_0_30px_rgba(132,204,22,0.4)] hover:shadow-[0_0_50px_rgba(132,204,22,0.6)] btn-shine"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {ctaText}
                        <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div 
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
                <ChevronDown className="text-white/60" size={28} />
            </motion.div>

            {/* Wave Divider */}
            <WaveDivider position="bottom" color="fill-white" animated={true} />
        </section>
    );
};

export default ServiceHero;

