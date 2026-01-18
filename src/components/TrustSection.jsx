import React from 'react';
import { motion } from 'framer-motion';

const TrustSection = ({ title, subtitle, description, items, className = "bg-gray-50" }) => {
    return (
        <section className={`py-16 ${className}`}>
            <div className="container mx-auto px-6">
                <div className="max-w-3xl mx-auto text-center">
                    {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
                    {description && <p className="text-gray-600 mb-8">{description}</p>}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        {items.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <p className="text-3xl font-bold text-primary">{item.value}</p>
                                <p className="text-sm text-gray-500">{item.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TrustSection;
