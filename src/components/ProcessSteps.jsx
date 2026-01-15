import React from 'react';
import { Search, Droplets, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ProcessSteps = () => {
    const steps = [
        {
            icon: Search,
            title: "Gratis Inspectie",
            description: "Wij komen vrijblijvend langs om de vervuiling te beoordelen en een plan op maat te maken."
        },
        {
            icon: Droplets,
            title: "Dieptereiniging",
            description: "Met gepaste druk en temperatuur verwijderen we al het vuil, zonder uw bestrating te beschadigen."
        },
        {
            icon: ShieldCheck,
            title: "Beschermlaag",
            description: "We brengen een nano-coating aan die jarenlang beschermt tegen groene aanslag en onkruid."
        }
    ];

    return (
        <div className="mb-16">
            <div className="text-center mb-10">
                <span className="text-primary font-bold tracking-wider text-sm uppercase mb-2 block">
                    Onze Werkwijze
                </span>
                <h3 className="text-2xl font-bold text-foreground">
                    In 3 stappen weer als nieuw
                </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-0.5 bg-gray-100 -z-10" />

                {steps.map((step, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 }}
                        className="flex flex-col items-center text-center group"
                    >
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center mb-6 group-hover:border-primary/30 group-hover:shadow-primary/10 transition-all duration-300 relative z-10">
                            <step.icon className="text-primary" size={28} />
                            <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md border-2 border-white">
                                {index + 1}
                            </div>
                        </div>
                        <h4 className="text-lg font-bold text-foreground mb-3">{step.title}</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                            {step.description}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ProcessSteps;
