import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
import WaveDivider from './effects/WaveDivider';
import SprayCleanText from './effects/SprayCleanText';
import { heroStagger, heroText } from '../utils/animations';

const heroPairs = [
    { before: '/images/images_optimized/gevers voor.webp', after: '/images/images_optimized/gevers na.webp' },
    { before: '/images/images_optimized/hoek 1 voor.webp', after: '/images/images_optimized/hoek 1 na.webp' },
    { before: '/images/images_optimized/mac voor.webp', after: '/images/images_optimized/mac na.webp' },
    { before: '/images/images_optimized/rood huis voor.webp', after: '/images/images_optimized/rood huis na.webp' },
    { before: '/images/images_optimized/villa voor.webp', after: '/images/images_optimized/villa na.webp' }
];

const Hero = () => {
    const [currentPairIndex, setCurrentPairIndex] = useState(0);
    const [showAfter, setShowAfter] = useState(false);
    const { scrollY } = useScroll();
    
    // Parallax effect
    const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);
    const contentY = useTransform(scrollY, [0, 500], [0, 50]);
    const opacity = useTransform(scrollY, [0, 400], [1, 0]);

    // Auto-fade tussen voor en na, dan volgende paar
    useEffect(() => {
        const cycleDuration = 10000; // 10 seconden per paar
        const transitionDelay = 4000; // Na 4 sec, toon "na"

        const interval = setInterval(() => {
            setShowAfter(false);
            setCurrentPairIndex((prev) => (prev + 1) % heroPairs.length);
        }, cycleDuration);

        const toggleTimer = setTimeout(() => {
            const toggleInterval = setInterval(() => {
                setShowAfter(true);
            }, cycleDuration);
            return () => clearInterval(toggleInterval);
        }, transitionDelay);

        const initialTimeout = setTimeout(() => setShowAfter(true), transitionDelay);

        return () => {
            clearInterval(interval);
            clearTimeout(toggleTimer);
            clearTimeout(initialTimeout);
        };
    }, []);

    const currentPair = heroPairs[currentPairIndex];

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-secondary">
            {/* Parallax Background */}
            <motion.div 
                className="absolute inset-0 z-0"
                style={{ y: backgroundY }}
            >
                {/* Before Image */}
                <motion.img
                    src={currentPair.before}
                    alt="Voor"
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ opacity: 1, scale: 1 }}
                    animate={{ 
                        opacity: showAfter ? 0 : 1,
                        scale: showAfter ? 1.05 : 1
                    }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                />

                {/* After Image */}
                <motion.img
                    src={currentPair.after}
                    alt="Na"
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ 
                        opacity: showAfter ? 1 : 0,
                        scale: showAfter ? 1 : 1.05
                    }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-secondary/90 z-10" />
            </motion.div>

            {/* Subtle Voor/Na indicator */}
            <motion.div 
                className="absolute bottom-36 right-8 z-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
            >
                <motion.div 
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-500 ${
                        showAfter 
                            ? 'bg-primary text-white' 
                            : 'bg-white/80 text-secondary'
                    }`}
                >
                    {showAfter ? 'Na' : 'Voor'}
                </motion.div>
            </motion.div>

            {/* Main Content */}
            <motion.div 
                className="relative z-20 text-center px-6 max-w-4xl mx-auto"
                style={{ y: contentY, opacity }}
                variants={heroStagger}
                initial="hidden"
                animate="visible"
            >
                {/* Heading with spray clean effect */}
                <motion.h1 
                    variants={heroText}
                    className="relative text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tighter"
                >
                    <SprayCleanText
                        dirtyColor="#78716c"
                        cleanColor="#ffffff"
                    >
                        Uitzonderlijke
                    </SprayCleanText>
                    <br />
                    <SprayCleanText
                        dirtyColor="#57534e"
                        cleanColor="#84CC16"
                    >
                        Schoonmaak.
                    </SprayCleanText>
                </motion.h1>

                {/* Subtitle */}
                <motion.p 
                    variants={heroText}
                    className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed"
                >
                    Wij herstellen de uitstraling van uw pand met geavanceerde reinigingstechnieken.
                    <span className="text-primary font-medium"> Professioneel, efficiënt en milieubewust.</span>
                </motion.p>

                {/* CTA Buttons */}
                <motion.div 
                    variants={heroText}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <motion.a 
                        href="#contact" 
                        className="group bg-primary text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-primary/90 transition-all flex items-center shadow-[0_0_30px_rgba(132,204,22,0.4)] hover:shadow-[0_0_50px_rgba(132,204,22,0.6)] btn-shine"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Offerte Aanvragen
                        <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </motion.a>
                    <motion.a
                        href="#diensten"
                        className="px-8 py-4 rounded-full text-lg font-medium text-white border-2 border-white/30 hover:bg-white/10 transition-all backdrop-blur-sm hover:border-white/50"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Bekijk Onze Diensten
                    </motion.a>
                </motion.div>
            </motion.div>

            {/* Image Dots */}
            <div className="absolute bottom-36 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {heroPairs.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setCurrentPairIndex(index);
                            setShowAfter(false);
                        }}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                            index === currentPairIndex 
                                ? 'bg-primary w-6' 
                                : 'bg-white/40 w-1.5 hover:bg-white/70'
                        }`}
                    />
                ))}
            </div>

            {/* Scroll Indicator */}
            <motion.div 
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
                <ChevronDown className="text-white/60" size={28} />
            </motion.div>

            {/* Wave Divider - Bereschoon Bruin */}
            <WaveDivider position="bottom" color="fill-secondary" animated={true} />
        </section>
    );
};

export default Hero;
