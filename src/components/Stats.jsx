import React, { useEffect, useRef } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { CheckCircle2, Calendar, Star, Sparkles } from 'lucide-react';
import { staggerContainer, scaleIn } from '../utils/animations';

const stats = [
    { value: 150, suffix: '+', label: 'Projecten Voltooid', icon: CheckCircle2 },
    { value: 3, suffix: '+', label: 'Jaren Ervaring', icon: Calendar },
    { value: 4.8, suffix: '', label: 'Gemiddelde Score', icon: Star, decimals: 1 },
    { value: 100, suffix: '%', label: 'Bereschoon', icon: Sparkles },
];

// Animated counter component
const AnimatedCounter = ({ value, suffix = '', decimals = 0, inView }) => {
    const spring = useSpring(0, { 
        stiffness: 50, 
        damping: 20,
        duration: 2000 
    });
    
    const display = useTransform(spring, (current) => 
        decimals > 0 ? current.toFixed(decimals) : Math.floor(current)
    );

    useEffect(() => {
        if (inView) {
            spring.set(value);
        }
    }, [inView, spring, value]);

    return (
        <span className="tabular-nums">
            <motion.span>{display}</motion.span>
            {suffix}
        </span>
    );
};

const Stats = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    return (
        <section className="py-20 bg-secondary text-white relative overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-secondary via-secondary to-secondary/95" />

            <div className="container mx-auto px-6 relative z-10" ref={ref}>
                {/* Stats Grid */}
                <motion.div 
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
                    variants={staggerContainer}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                >
                    {stats.map((stat, index) => (
                        <motion.div 
                            key={index}
                            variants={scaleIn}
                            className="relative group text-center"
                        >
                            <motion.div 
                                className="relative p-6 md:p-8"
                                whileHover={{ y: -4 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Icon */}
                                <motion.div 
                                    className="mb-4 flex justify-center"
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300">
                                        <stat.icon size={22} className="text-primary" />
                                    </div>
                                </motion.div>

                                {/* Animated Value */}
                                <div className="text-4xl md:text-5xl font-bold mb-2 tracking-tight text-white">
                                    <AnimatedCounter 
                                        value={stat.value} 
                                        suffix={stat.suffix}
                                        decimals={stat.decimals || 0}
                                        inView={isInView}
                                    />
                                </div>
                                
                                {/* Label */}
                                <div className="text-sm md:text-base text-white/70 font-medium">
                                    {stat.label}
                                </div>

                                {/* Subtle divider line on larger screens */}
                                {index < stats.length - 1 && (
                                    <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-16 w-px bg-white/10" />
                                )}
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Stats;
