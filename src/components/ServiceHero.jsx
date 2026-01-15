import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, ArrowRight, Check } from 'lucide-react';
import LogoMarquee from './LogoMarquee';
import WaveDivider from './effects/WaveDivider';
import { heroStagger, heroText } from '../utils/animations';
import { formatReviewCount } from '../utils/formatters';

const ServiceHero = ({
    title,
    subtitle,
    description,
    image,
    features = [],
    ctaText = "Direct Aanvragen",
    ctaHref = "#formulier",
    showOverlay = true, // New prop for extra overlay
    reviewData = null, // { score: "4.8", count: 126, text: "..." }
    usps = [], // Array of { icon: Icon, text: "..." }
    companyLogos = [] // New prop for logo marquee
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
        <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-secondary">
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

                {/* Gradient Overlay + Extra Dark Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-secondary/90 z-10 transition-opacity duration-300 ${showOverlay ? 'bg-black/30' : ''}`} />
            </motion.div>

            {/* Main Content */}
            <motion.div
                className="relative z-20 text-center px-6 max-w-4xl mx-auto mt-20 md:mt-0 flex-grow flex flex-col justify-center"
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
                    className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight text-white drop-shadow-lg"
                >
                    {title}
                </motion.h1>

                {/* Description */}
                <motion.p
                    variants={heroText}
                    className="text-lg md:text-xl text-gray-100 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-md font-medium"
                >
                    {description}
                </motion.p>

                {/* Social Proof - Reviews */}
                {reviewData && (
                    <motion.div
                        variants={heroText}
                        className="flex flex-col items-center mb-8"
                    >
                        {reviewData.link ? (
                            <a
                                href={reviewData.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center hover:scale-105 transition-transform cursor-pointer"
                            >
                                <div className="flex items-center gap-1 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-5 h-5 text-yellow-500 fill-current" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                    <span className="text-white font-bold ml-2">{reviewData.score}/5</span>
                                    <span className="text-gray-300 ml-1 text-sm">({formatReviewCount(reviewData.count)} Google reviews)</span>
                                </div>
                                {reviewData.quote && (
                                    <p className="text-gray-200 italic text-sm">"{reviewData.quote}"</p>
                                )}
                            </a>
                        ) : (
                            <>
                                <div className="flex items-center gap-1 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-5 h-5 text-yellow-500 fill-current" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                    <span className="text-white font-bold ml-2">{reviewData.score}/5</span>
                                    <span className="text-gray-300 ml-1 text-sm">({formatReviewCount(reviewData.count)} Google reviews)</span>
                                </div>
                                {reviewData.quote && (
                                    <p className="text-gray-200 italic text-sm">"{reviewData.quote}"</p>
                                )}
                            </>
                        )}
                    </motion.div>
                )}

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
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
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
                    <motion.button
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('resultaten')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="group bg-transparent text-white border-2 border-white px-8 py-4 rounded-full text-lg font-bold hover:bg-white hover:text-secondary transition-all flex items-center"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Bekijk resultaten
                    </motion.button>
                </motion.div>
            </motion.div>

            {/* USPs Bar or Logo Marquee */}
            {companyLogos.length > 0 ? (
                <LogoMarquee logos={companyLogos} />
            ) : usps.length > 0 && (
                <motion.div
                    className="relative z-30 bg-white/5 backdrop-blur-md border-t border-white/10 py-6"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {usps.map((usp, index) => (
                                <div key={index} className="flex items-center justify-center gap-3">
                                    <div className="bg-primary/20 p-2 rounded-full">
                                        <usp.icon size={24} className="text-primary" />
                                    </div>
                                    <span className="text-white font-medium">{usp.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Scroll Indicator (Hide if USPs are showing to avoid clutter, or adjust position) */}
            {usps.length === 0 && (
                <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <ChevronDown className="text-white/60" size={28} />
                </motion.div>
            )}

            {/* Wave Divider - only show if no USPs, otherwise the bar handles the transition */}
            {usps.length === 0 && <WaveDivider position="bottom" color="fill-white" animated={true} />}
        </section>
    );
};

export default ServiceHero;

