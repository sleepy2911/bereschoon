import React from 'react';
import { motion } from 'framer-motion';

const LogoMarquee = ({ logos = [] }) => {
    // Duplicate logos to create seamless loop
    const marqueeLogos = [...logos, ...logos];

    return (
        <div className="relative z-30 bg-white/5 backdrop-blur-md border-t border-white/10 py-6 overflow-hidden">
            <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-secondary/80 via-transparent to-secondary/80" />

            <div className="flex">
                <motion.div
                    className="flex items-center gap-12 md:gap-20 px-4 min-w-full"
                    animate={{
                        x: ['0%', '-50%']
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear",
                        repeatType: "loop"
                    }}
                >
                    {marqueeLogos.map((logo, index) => (
                        <div key={index} className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                            {/* Placeholder if src fails or for dev */}
                            <img
                                src={logo}
                                alt={`Partner ${index + 1}`}
                                className="h-12 w-auto object-contain"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            {/* Fallback placeholder text */}
                            <div className="hidden h-12 w-32 bg-white/10 rounded items-center justify-center text-white/40 text-xs font-bold border border-white/10 whitespace-nowrap px-4">
                                LOGO {index % logos.length + 1}
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default LogoMarquee;
