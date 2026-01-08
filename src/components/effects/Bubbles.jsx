import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * Bubbles Component
 * Creëert floating bubbles animatie als achtergrond effect
 * Perfect voor schoonmaak thema
 * 
 * @param {number} count - Aantal bubbels
 * @param {string} color - Kleur van de bubbels ('cyan', 'white', 'primary')
 * @param {string} className - Extra CSS classes
 */
const Bubbles = ({ count = 20, color = 'cyan', className = '' }) => {
    // Kleur configuratie
    const colorClasses = {
        cyan: 'bg-cyan-400/20 border-cyan-300/40',
        white: 'bg-white/20 border-white/40',
        primary: 'bg-primary/20 border-primary/40',
        mixed: '', // Will be set per bubble
    };

    // Genereer willekeurige bubbels
    const bubbles = useMemo(() => {
        return Array.from({ length: count }, (_, i) => {
            const size = Math.random() * 60 + 10;
            const mixedColors = ['bg-cyan-400/15 border-cyan-300/30', 'bg-white/15 border-white/30', 'bg-primary/15 border-primary/30'];
            
            return {
                id: i,
                size,
                left: Math.random() * 100,
                delay: Math.random() * 8,
                duration: Math.random() * 12 + 10,
                wobble: Math.random() * 30 - 15,
                colorClass: color === 'mixed' ? mixedColors[Math.floor(Math.random() * mixedColors.length)] : colorClasses[color],
            };
        });
    }, [count, color]);

    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            {bubbles.map((bubble) => (
                <motion.div
                    key={bubble.id}
                    className={`absolute rounded-full border backdrop-blur-[2px] ${bubble.colorClass}`}
                    style={{
                        width: bubble.size,
                        height: bubble.size,
                        left: `${bubble.left}%`,
                        bottom: -bubble.size,
                    }}
                    animate={{
                        y: [0, -(window.innerHeight + bubble.size + 100)],
                        x: [0, bubble.wobble, -bubble.wobble, bubble.wobble, 0],
                        rotate: [0, 360],
                    }}
                    transition={{
                        y: {
                            duration: bubble.duration,
                            repeat: Infinity,
                            delay: bubble.delay,
                            ease: "linear",
                        },
                        x: {
                            duration: bubble.duration / 4,
                            repeat: Infinity,
                            delay: bubble.delay,
                            ease: "easeInOut",
                        },
                        rotate: {
                            duration: bubble.duration * 2,
                            repeat: Infinity,
                            delay: bubble.delay,
                            ease: "linear",
                        },
                    }}
                >
                    {/* Shine effect inside bubble */}
                    <div 
                        className="absolute top-1/4 left-1/4 w-1/3 h-1/3 rounded-full bg-white/40"
                        style={{ filter: 'blur(2px)' }}
                    />
                </motion.div>
            ))}
        </div>
    );
};

/**
 * SingleBubble Component
 * Een enkele bubbel met pop animatie bij hover
 */
export const SingleBubble = ({ size = 40, className = '', onClick }) => {
    const [isPopped, setIsPopped] = React.useState(false);

    const handlePop = () => {
        setIsPopped(true);
        onClick?.();
        setTimeout(() => setIsPopped(false), 500);
    };

    return (
        <motion.div
            className={`relative cursor-pointer ${className}`}
            style={{ width: size, height: size }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePop}
        >
            {!isPopped ? (
                <motion.div
                    className="w-full h-full rounded-full bg-cyan-400/30 border border-cyan-300/50 backdrop-blur-sm"
                    animate={{
                        y: [0, -5, 0],
                        scale: [1, 1.02, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <div 
                        className="absolute top-1/4 left-1/4 w-1/3 h-1/3 rounded-full bg-white/50"
                        style={{ filter: 'blur(1px)' }}
                    />
                </motion.div>
            ) : (
                // Pop particles
                <>
                    {Array.from({ length: 8 }, (_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 rounded-full bg-cyan-400"
                            style={{
                                left: '50%',
                                top: '50%',
                            }}
                            initial={{ scale: 1, x: 0, y: 0, opacity: 1 }}
                            animate={{
                                scale: 0,
                                x: Math.cos((i / 8) * Math.PI * 2) * 40,
                                y: Math.sin((i / 8) * Math.PI * 2) * 40,
                                opacity: 0,
                            }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        />
                    ))}
                </>
            )}
        </motion.div>
    );
};

/**
 * FoamCluster Component
 * Een cluster van kleine bubbels die schuim simuleren
 */
export const FoamCluster = ({ className = '' }) => {
    const foamBubbles = useMemo(() => {
        return Array.from({ length: 30 }, (_, i) => ({
            id: i,
            size: Math.random() * 15 + 5,
            x: Math.random() * 100,
            y: Math.random() * 100,
            delay: Math.random() * 2,
        }));
    }, []);

    return (
        <div className={`relative ${className}`}>
            {foamBubbles.map((bubble) => (
                <motion.div
                    key={bubble.id}
                    className="absolute rounded-full bg-white/40 border border-white/30"
                    style={{
                        width: bubble.size,
                        height: bubble.size,
                        left: `${bubble.x}%`,
                        top: `${bubble.y}%`,
                    }}
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.4, 0.7, 0.4],
                    }}
                    transition={{
                        duration: 2,
                        delay: bubble.delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
};

export default Bubbles;

