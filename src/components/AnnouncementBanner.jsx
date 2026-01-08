import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

const AnnouncementBanner = () => {
    const [isVisible, setIsVisible] = useState(true);
    const location = useLocation();
    
    // Only show on homepage
    if (location.pathname !== '/') {
        return null;
    }

    useEffect(() => {
        // Update body class when banner visibility changes
        if (isVisible) {
            document.body.classList.add('has-banner');
        } else {
            document.body.classList.remove('has-banner');
        }
        return () => {
            document.body.classList.remove('has-banner');
        };
    }, [isVisible]);

    const bannerText = "NIEUW: Ons eigen assortiment bereschoon reinigingsproducten!";

    if (!isVisible) return null;

    return (
        <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-primary via-[#7AB816] to-primary"
            style={{ height: '44px' }}
        >
            {/* Shimmer effect */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                    x: ['-100%', '200%'],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            />

            <div className="relative py-1.5 flex items-center h-[44px] overflow-hidden">
                {/* Marquee text - full width, infinite scroll, clickable */}
                <div 
                    className="absolute inset-0 overflow-hidden"
                    style={{
                        maskImage: 'linear-gradient(to right, black calc(100% - 60px), transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to right, black calc(100% - 60px), transparent 100%)',
                    }}
                >
                    <motion.div
                        className="flex items-center h-full whitespace-nowrap will-change-transform"
                        initial={{ x: '0%' }}
                        animate={{
                            x: ['0%', '-25%'],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: 'linear',
                            repeatType: 'loop',
                        }}
                    >
                        {/* Duplicate text for seamless infinite loop - 8 copies (4 sets) ensures no gaps on any screen size */}
                        {[...Array(8)].map((_, i) => (
                            <Link
                                key={i}
                                to="/winkel"
                                className="flex items-center gap-4 mr-8 h-full cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0"
                            >
                                <span className="text-white font-semibold text-xs md:text-sm whitespace-nowrap">
                                    {bannerText}
                                </span>
                                <span className="text-white/60 flex-shrink-0">•</span>
                            </Link>
                        ))}
                    </motion.div>
                </div>

                {/* Solid background on the right to hide text behind close button */}
                <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-r from-transparent via-primary to-primary z-10 pointer-events-none" />
                
                {/* Close button - fixed on the right with better visibility */}
                <motion.button
                    onClick={() => {
                        setIsVisible(false);
                    }}
                    className="absolute right-2 z-20 p-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all flex-shrink-0 shadow-sm"
                    whileHover={{ scale: 1.15, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Sluiten"
                >
                    <X size={16} className="text-white drop-shadow-sm" strokeWidth={2.5} />
                </motion.button>
            </div>

            {/* Bottom border accent - inside banner to avoid gap */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"
                animate={{
                    opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
        </motion.div>
    );
};

export default AnnouncementBanner;

