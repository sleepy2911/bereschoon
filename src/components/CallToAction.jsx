import React from 'react';
import { ArrowRight, Clock, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const CallToAction = () => {
    return (
        <section className="py-24 bg-white relative overflow-hidden border-t border-gray-100">
            {/* Background Glows - Adjusted for Light Mode */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] translate-y-1/2" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-primary font-bold tracking-widest text-xs uppercase mb-6"
                    >
                        VOLGENDE STAP
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-secondary mb-6 leading-tight"
                    >
                        Klaar om uw oprit<br />
                        <span className="text-primary">
                            professioneel te laten reinigen?
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-600 text-lg mb-12 leading-relaxed max-w-2xl mx-auto"
                    >
                        Plan direct een inspectie in en ontvang binnen 24 uur een voorstel op maat. Wij zorgen dat alles weer straalt.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col items-center gap-6"
                    >
                        <a
                            href="#keuzehulp"
                            className="bg-primary hover:bg-primary/90 text-white font-bold text-lg px-10 py-4 rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-105 flex items-center gap-3 w-full sm:w-auto justify-center"
                        >
                            <span>Offerte Aanvragen</span>
                            <ArrowRight size={20} />
                        </a>

                        <div className="flex items-center text-gray-500 text-sm font-medium gap-2">
                            <Clock size={16} className="text-primary" />
                            <span>Binnen 24u reactie • Geen verkoopdruk</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;
