import React from 'react';
import { motion } from 'framer-motion';

/**
 * WaterSpray Component
 * Creëert een hogedruk reiniger spray effect met geanimeerde waterdruppels
 * 
 * @param {string} position - 'left', 'right', 'top', 'bottom'
 * @param {string} intensity - 'light', 'medium', 'heavy'
 * @param {string} className - Extra CSS classes
 */
const WaterSpray = ({ position = 'left', intensity = 'medium', className = '' }) => {
    // Configuratie op basis van intensiteit
    const dropletCount = {
        light: 15,
        medium: 25,
        heavy: 40,
    }[intensity];

    // Positie configuratie
    const positionStyles = {
        left: 'left-0 top-0 h-full w-32 flex-col',
        right: 'right-0 top-0 h-full w-32 flex-col',
        top: 'top-0 left-0 w-full h-32 flex-row',
        bottom: 'bottom-0 left-0 w-full h-32 flex-row',
    };

    const sprayDirection = {
        left: { x: [0, 80, 120], rotate: [-5, 5, -5] },
        right: { x: [0, -80, -120], rotate: [5, -5, 5] },
        top: { y: [0, 80, 120], rotate: [-5, 5, -5] },
        bottom: { y: [0, -80, -120], rotate: [5, -5, 5] },
    };

    // Genereer willekeurige druppels
    const droplets = React.useMemo(() => {
        return Array.from({ length: dropletCount }, (_, i) => ({
            id: i,
            size: Math.random() * 8 + 2,
            delay: Math.random() * 2,
            duration: Math.random() * 1.5 + 1,
            offset: Math.random() * 100,
            opacity: Math.random() * 0.5 + 0.2,
        }));
    }, [dropletCount]);

    return (
        <div 
            className={`absolute pointer-events-none overflow-hidden ${positionStyles[position]} ${className}`}
            style={{ zIndex: 5 }}
        >
            {/* Mist/Spray achtergrond gradient */}
            <div 
                className={`absolute inset-0 ${
                    position === 'left' 
                        ? 'bg-gradient-to-r from-cyan-400/20 via-cyan-400/10 to-transparent' 
                        : position === 'right'
                        ? 'bg-gradient-to-l from-cyan-400/20 via-cyan-400/10 to-transparent'
                        : position === 'top'
                        ? 'bg-gradient-to-b from-cyan-400/20 via-cyan-400/10 to-transparent'
                        : 'bg-gradient-to-t from-cyan-400/20 via-cyan-400/10 to-transparent'
                }`}
            />

            {/* Animated droplets */}
            {droplets.map((droplet) => (
                <motion.div
                    key={droplet.id}
                    className="absolute rounded-full bg-cyan-300/60"
                    style={{
                        width: droplet.size,
                        height: droplet.size,
                        [position === 'left' || position === 'right' ? 'top' : 'left']: `${droplet.offset}%`,
                        [position]: 0,
                        filter: 'blur(1px)',
                    }}
                    initial={{ 
                        opacity: 0, 
                        scale: 0,
                        [position === 'left' || position === 'right' ? 'x' : 'y']: 0,
                    }}
                    animate={{
                        opacity: [0, droplet.opacity, droplet.opacity, 0],
                        scale: [0.5, 1, 0.8, 0.3],
                        ...sprayDirection[position],
                    }}
                    transition={{
                        duration: droplet.duration,
                        delay: droplet.delay,
                        repeat: Infinity,
                        ease: "easeOut",
                    }}
                />
            ))}

            {/* Extra mist particles */}
            {Array.from({ length: 8 }, (_, i) => (
                <motion.div
                    key={`mist-${i}`}
                    className="absolute rounded-full bg-white/30"
                    style={{
                        width: Math.random() * 40 + 20,
                        height: Math.random() * 40 + 20,
                        [position === 'left' || position === 'right' ? 'top' : 'left']: `${Math.random() * 100}%`,
                        [position]: Math.random() * 20,
                        filter: 'blur(15px)',
                    }}
                    animate={{
                        opacity: [0.1, 0.3, 0.1],
                        scale: [1, 1.2, 1],
                        ...sprayDirection[position],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2,
                        delay: Math.random() * 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
};

/**
 * SprayNozzle Component
 * Een decoratieve hogedruk spuitkop die water "spuit"
 */
export const SprayNozzle = ({ className = '' }) => {
    return (
        <div className={`relative ${className}`}>
            {/* Nozzle SVG */}
            <svg 
                viewBox="0 0 60 30" 
                className="w-16 h-8 text-gray-700"
                fill="currentColor"
            >
                <path d="M0,15 L20,10 L20,20 L0,15 Z" />
                <rect x="20" y="8" width="35" height="14" rx="2" />
                <circle cx="55" cy="15" r="5" fill="currentColor" />
            </svg>

            {/* Water spray effect */}
            <motion.div
                className="absolute left-14 top-1/2 -translate-y-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                {Array.from({ length: 12 }, (_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-cyan-400"
                        style={{
                            transformOrigin: 'left center',
                            rotate: (i - 6) * 8,
                        }}
                        animate={{
                            x: [0, 60, 100],
                            opacity: [0.8, 0.6, 0],
                            scale: [0.5, 1, 0.3],
                        }}
                        transition={{
                            duration: 0.8,
                            delay: i * 0.05,
                            repeat: Infinity,
                            ease: "easeOut",
                        }}
                    />
                ))}
            </motion.div>
        </div>
    );
};

export default WaterSpray;

