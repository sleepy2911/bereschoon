import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'; // Added AnimatePresence
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import WaveDivider from './effects/WaveDivider';
import SprayCleanText from './effects/SprayCleanText';
import { heroStagger, heroText } from '../utils/animations';

const heroImages = [
    '/images/hero/home/hero-home1.webp',
    '/images/hero/home/hero-home2.webp',
    '/images/hero/home/hero-home3.webp'
];

const Hero = ({ ready = false }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [validImages, setValidImages] = useState([]);
    const [startSecondClean, setStartSecondClean] = useState(false);
    const [canStartClean, setCanStartClean] = useState(false);
    const { scrollY } = useScroll();

    // Parallax effect
    const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);
    const contentY = useTransform(scrollY, [0, 500], [0, 50]);
    const opacity = useTransform(scrollY, [0, 400], [1, 0]);

    // Validate images on mount
    useEffect(() => {
        const checkImages = async () => {
            const promises = heroImages.map(src => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.src = src;
                    img.onload = () => resolve(src);
                    img.onerror = () => resolve(null);
                });
            });

            const results = await Promise.all(promises);
            const verified = results.filter(src => src !== null);
            setValidImages(verified);
        };

        checkImages();
    }, []);

    useEffect(() => {
        if (validImages.length > 1) {
            const interval = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % validImages.length);
            }, 10000);
            return () => clearInterval(interval);
        } else {
            setCurrentImageIndex(0);
        }
    }, [validImages]);

    const currentSrc = validImages.length > 0 ? validImages[currentImageIndex] : heroImages[0];

    // Start auto-clean nadat splash en fade-in klaar zijn
    useEffect(() => {
        if (ready) {
            const timer = setTimeout(() => setCanStartClean(true), 500); // kleine buffer na fade
            return () => clearTimeout(timer);
        } else {
            setCanStartClean(false);
            setStartSecondClean(false);
        }
    }, [ready]);

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-secondary">
            {/* Parallax Background */}
            <motion.div
                className="absolute inset-0 z-0"
                style={{ y: backgroundY }}
            >
                {/* Background Image(s) */}
                <AnimatePresence mode="popLayout">
                    <motion.img
                        key={currentSrc}
                        src={currentSrc}
                        alt="Hero Background"
                        className="absolute inset-0 w-full h-full object-cover object-[center_75%]" // Kept original object position
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                </AnimatePresence>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-secondary/90 z-10" />
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
                        dirtyColor="#3f2a1d" // Bereschoon bruin als "vieze" basis
                        cleanColor="#ffffff"
                        autoClean={canStartClean}
                        autoDelay={0}
                        autoPath={[
                            { x: 0.02, y: 0.5 },
                            { x: 0.98, y: 0.5 },
                        ]}
                        onAutoComplete={() => setStartSecondClean(true)}
                    >
                        Uitzonderlijke
                    </SprayCleanText>
                    <br />
                    <SprayCleanText
                        dirtyColor="#3f2a1d" // zelfde bruine startkleur
                        cleanColor="#84CC16"
                        autoClean={startSecondClean}
                        autoDelay={150}
                        autoPath={[
                            { x: 0.02, y: 0.5 },
                            { x: 0.98, y: 0.5 },
                        ]}
                    >
                        Schoonmaak.
                    </SprayCleanText>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    variants={heroText}
                    className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed"
                >
                    Wij zorgen ervoor dat de uitstraling van uw pand of woning weer Bereschoon wordt.
                    <span className="text-primary font-medium"> Professioneel, efficiënt en milieubewust.</span>
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    variants={heroText}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <motion.div
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Link
                            to="/contact"
                            className="group bg-primary text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-primary/90 transition-all flex items-center shadow-[0_0_30px_rgba(132,204,22,0.4)] hover:shadow-[0_0_50px_rgba(132,204,22,0.6)] btn-shine"
                        >
                            Offerte Aanvragen
                            <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
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
            {validImages.length > 1 && (
                <div className="absolute bottom-36 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                    {validImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setCurrentImageIndex(index);
                            }}
                            className={`h-1.5 rounded-full transition-all duration-300 ${index === currentImageIndex
                                ? 'bg-primary w-6'
                                : 'bg-white/40 w-1.5 hover:bg-white/70'
                                }`}
                        />
                    ))}
                </div>
            )}

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
