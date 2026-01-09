import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Sparkles, Shield, Clock, Award, CheckCircle2 } from 'lucide-react';
import ContactForm from './ContactForm';

const HomeQuoteSection = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const benefits = [
        { icon: Shield, text: "Gratis en vrijblijvend" },
        { icon: Clock, text: "Reactie binnen 24 uur" },
        { icon: Award, text: "Vakkundig advies op maat" },
    ];

    const checkmarks = [
        "Persoonlijke offerte op maat",
        "Transparante prijzen",
        "Geen verplichtingen",
        "Direct een indicatie"
    ];

    return (
        <section 
            ref={ref}
            className="relative py-24 overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)'
            }}
        >
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Gradient orbs */}
                <motion.div 
                    className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div 
                    className="absolute -bottom-40 -right-40 w-96 h-96 bg-primary/15 rounded-full blur-3xl"
                    animate={{ 
                        scale: [1.2, 1, 1.2],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                />
                
                {/* Subtle grid pattern */}
                <div 
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '50px 50px'
                    }}
                />

                {/* Floating particles */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-primary/30 rounded-full"
                        style={{
                            left: `${15 + i * 15}%`,
                            top: `${20 + (i % 3) * 25}%`,
                        }}
                        animate={{
                            y: [0, -20, 0],
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            duration: 3 + i * 0.5,
                            repeat: Infinity,
                            delay: i * 0.3,
                        }}
                    />
                ))}
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left Column - Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-white"
                    >
                        {/* Badge */}
                        <motion.div 
                            className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full px-4 py-2 mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <Sparkles className="text-primary" size={16} />
                            <span className="text-sm font-medium text-primary">Offerte op maat</span>
                        </motion.div>

                        {/* Heading */}
                        <motion.h2 
                            className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            Ontdek wat wij voor
                            <span className="text-primary"> u </span>
                            kunnen betekenen
                        </motion.h2>

                        {/* Description */}
                        <motion.p 
                            className="text-lg text-white/70 leading-relaxed mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            In slechts een paar stappen ontvangt u een persoonlijke offerte. 
                            Selecteer uw dienst, geef uw wensen aan, en wij zorgen voor de rest.
                        </motion.p>

                        {/* Benefits */}
                        <motion.div 
                            className="flex flex-wrap gap-4 mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.5 }}
                        >
                            {benefits.map((benefit, index) => (
                                <div 
                                    key={index}
                                    className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10"
                                >
                                    <benefit.icon className="text-primary" size={18} />
                                    <span className="text-sm text-white/80">{benefit.text}</span>
                                </div>
                            ))}
                        </motion.div>

                        {/* Checkmarks */}
                        <motion.div 
                            className="space-y-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            {checkmarks.map((item, index) => (
                                <motion.div 
                                    key={index}
                                    className="flex items-center gap-3"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                                >
                                    <CheckCircle2 className="text-primary flex-shrink-0" size={20} />
                                    <span className="text-white/80">{item}</span>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Trust indicator */}
                        <motion.div 
                            className="mt-10 pt-8 border-t border-white/10"
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ duration: 0.6, delay: 1 }}
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div 
                                            key={i}
                                            className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/80 to-primary border-2 border-secondary flex items-center justify-center text-white text-xs font-bold"
                                        >
                                            {['R', 'M', 'J', 'A'][i-1]}
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <p className="text-white font-semibold">500+ tevreden klanten</p>
                                    <p className="text-white/50 text-sm">gingen u voor</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Column - Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50, y: 20 }}
                        animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                        className="relative"
                    >
                        {/* Glow effect behind form */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-2xl blur-2xl" />
                        
                        {/* Form container with subtle shadow */}
                        <div className="relative">
                            <ContactForm />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HomeQuoteSection;

