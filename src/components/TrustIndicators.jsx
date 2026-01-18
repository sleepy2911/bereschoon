import React from 'react';
import { Star, ShieldCheck, Calendar, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { GOOGLE_REVIEW_DATA } from '../data/reviews';
import { formatReviewCount } from '../utils/formatters';

const TrustIndicators = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 md:gap-8 mt-8 pb-8 border-b border-gray-100"
        >
            <a
                href={GOOGLE_REVIEW_DATA.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-100 shadow-sm hover:bg-white/80 transition-colors cursor-pointer"
            >
                <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" strokeWidth={0} />)}
                </div>
                <span className="text-sm font-semibold text-gray-700">{GOOGLE_REVIEW_DATA.score}/5 Google Reviews ({formatReviewCount(GOOGLE_REVIEW_DATA.count)})</span>
            </a>

            <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                <ShieldCheck size={16} className="text-primary" />
                <span className="text-sm font-semibold text-gray-700">150+ Projecten</span>
            </div>

            <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                <Calendar size={16} className="text-primary" />
                <span className="text-sm font-semibold text-gray-700">3+ Jaar Ervaring</span>
            </div>
        </motion.div>
    );
};

export default TrustIndicators;
