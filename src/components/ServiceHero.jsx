import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ArrowRight, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import LogoMarquee from './LogoMarquee';
import WaveDivider from './effects/WaveDivider';
import { heroStagger, heroText } from '../utils/animations';
import { formatReviewCount } from '../utils/formatters';
import { GOOGLE_REVIEW_DATA } from '../data/reviews';

const ReviewQuotes = ({ reviewData }) => {
    const [index, setIndex] = useState(0);
    const quotes = reviewData.quotes || (reviewData.quote ? [reviewData.quote] : []);
    const mobileQuotes = reviewData.mobileQuotes || quotes;

    useEffect(() => {
        // Use the longer array length to determine interval, or just max?
        // Actually, just standard single interval logic is fine if we cycle properly.
        const maxLen = Math.max(quotes.length, mobileQuotes.length);
        if (maxLen > 1) {
            const interval = setInterval(() => {
                setIndex((prev) => (prev + 1) % maxLen);
            }, 7000);
            return () => clearInterval(interval);
        }
    }, [quotes, mobileQuotes]);

    if (quotes.length === 0) return null;

    // Safe indexing
    const quote = quotes[index % quotes.length];
    const mobileQuote = mobileQuotes[index % mobileQuotes.length];

    return (
        <div className="h-6 flex items-center justify-center overflow-hidden relative w-[98vw] md:w-[40rem] lg:w-[50rem] px-1">
            <AnimatePresence mode="wait">
                <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="text-gray-200 italic text-center absolute w-full whitespace-nowrap truncate"
                >
                    <span className="md:hidden text-xs">"{mobileQuote}"</span>
                    <span className="hidden md:block text-sm">"{quote}"</span>
                </motion.p>
            </AnimatePresence>
        </div>
    );
};

const ServiceHero = ({
    title,
    subtitle,
    description,
    image,
    images = [], // New prop for slideshow
    features = [],
    ctaText = "Direct Aanvragen",
    ctaHref = "#formulier",
    showOverlay = true, // New prop for extra overlay
    reviewData = GOOGLE_REVIEW_DATA,
    usps = [], // Array of { icon: Icon, text: "..." }
    companyLogos = [], // New prop for logo marquee
    mobileDescription = null, // New prop for shorter mobile text
    maxWidth = "max-w-6xl" // Allow overriding the container width
}) => {
    const { scrollY } = useScroll();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [validImages, setValidImages] = useState([]);

    // Validate images on mount
    useEffect(() => {
        // If no images array, just use single image or nothing
        if (!images || images.length === 0) {
            setValidImages(image ? [image] : []);
            return;
        }

        // Must always include the first image (assumed to be the main fallback)
        // or we check all of them. Let's check all, but ensure at least 'image' is fallback.
        const checkImages = async () => {
            const candidates = images.length > 0 ? images : (image ? [image] : []);
            const valid = [];

            const promises = candidates.map(src => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.src = src;
                    img.onload = () => resolve(src);
                    img.onerror = () => resolve(null);
                });
            });

            const results = await Promise.all(promises);
            const verified = results.filter(src => src !== null);

            // If nothing verified, but we had a fallback 'image' prop, maybe try that?
            // But assume verified list is what we use.
            setValidImages(verified.length > 0 ? verified : [image]);
        };

        checkImages();
    }, [images, image]);

    // Slideshow timer
    useEffect(() => {
        if (validImages.length > 1) {
            const interval = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % validImages.length);
            }, 10000); // 10 seconds
            return () => clearInterval(interval);
        } else {
            // Reset to 0 if we went from many to 1 (unlikely but safe)
            setCurrentImageIndex(0);
        }
    }, [validImages]);

    // Determine current image source
    // Use validImages if ready, otherwise fallback to prop 'image' (for initial render)
    const currentSrc = validImages.length > 0 ? validImages[currentImageIndex] : image;

    // Parallax effect
    const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);
    const contentY = useTransform(scrollY, [0, 500], [0, 50]);
    const opacity = useTransform(scrollY, [0, 400], [1, 0]);

    const navigate = useNavigate();

    const handleCtaClick = (e) => {
        // If it's a direct link to another page
        if (ctaHref && !ctaHref.startsWith('#')) {
            e.preventDefault();
            navigate(ctaHref);
            return;
        }

        e.preventDefault();
        const targetId = ctaHref ? ctaHref.replace('#', '') : 'formulier';
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="relative h-[100svh] md:min-h-screen flex flex-col justify-center md:justify-start overflow-hidden bg-secondary">
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
                        alt={title}
                        className="absolute inset-0 w-full h-full object-cover"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                </AnimatePresence>

                {/* Gradient Overlay + Extra Dark Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-secondary/90 z-10 transition-opacity duration-300 ${showOverlay ? 'bg-black/30' : ''}`} />
            </motion.div>

            {/* Main Content */}
            <motion.div
                className={`relative z-20 text-center px-4 md:px-6 ${maxWidth} md:max-w-full w-full mx-auto flex-grow flex flex-col items-center justify-center md:justify-start md:pt-48 pb-24 md:pb-0`}
                style={{ y: contentY, opacity }}
                variants={heroStagger}
                initial="hidden"
                animate="visible"
            >
                {/* Subtitle badge */}
                {subtitle && (
                    <motion.div
                        variants={heroText}
                        className="inline-block mb-6 pt-20 md:pt-0"
                    >
                        <span className="bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border border-primary/30">
                            {subtitle}
                        </span>
                    </motion.div>
                )}

                {/* Main Title */}
                <motion.h1
                    variants={heroText}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tighter text-white drop-shadow-lg text-center md:whitespace-nowrap mx-auto"
                >
                    {title}
                </motion.h1>

                {/* Description */}
                <motion.div variants={heroText} className="mb-6 md:mb-8 min-h-[5.5rem] flex items-center justify-center w-full">
                    {mobileDescription ? (
                        <>
                            <p className="md:hidden text-lg text-white max-w-xl mx-auto leading-relaxed drop-shadow-md font-medium text-center">
                                {mobileDescription}
                            </p>
                            <p className="hidden md:block text-xl text-white max-w-2xl mx-auto leading-relaxed drop-shadow-md font-medium text-center">
                                {description}
                            </p>
                        </>
                    ) : (
                        <p className="text-lg md:text-xl text-white max-w-2xl mx-auto leading-relaxed drop-shadow-md font-medium text-center">
                            {description}
                        </p>
                    )}
                </motion.div>

                {/* Social Proof - Reviews */}
                {reviewData && (
                    <motion.div
                        variants={heroText}
                        className="flex flex-col items-center mb-8 w-full"
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
                                <ReviewQuotes reviewData={reviewData} />
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
                                <ReviewQuotes reviewData={reviewData} />
                            </>
                        )}
                    </motion.div>
                )}

                {/* Features List */}
                {features.length > 0 && (
                    <motion.div
                        variants={heroText}
                        className="hidden md:flex flex-wrap justify-center gap-4 mb-10"
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
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 w-full"
                >
                    <motion.button
                        onClick={handleCtaClick}
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
                        className="hidden md:flex group bg-transparent text-white border-2 border-white px-8 py-4 rounded-full text-lg font-bold hover:bg-white hover:text-secondary transition-all items-center"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Bekijk resultaten
                    </motion.button>
                    {/* Mobile Only Link for Secondary Action to save space */}
                    <motion.button
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('resultaten')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="md:hidden text-white/90 underline underline-offset-4 text-sm font-medium mt-2"
                        whileTap={{ scale: 0.95 }}
                    >
                        Of bekijk direct resultaten
                    </motion.button>
                </motion.div>
            </motion.div>

            {/* USPs Bar or Logo Marquee */}
            <div className="absolute bottom-0 left-0 right-0 z-30 md:relative">
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
            </div>

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

