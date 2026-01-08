import React from 'react';
import { motion } from 'framer-motion';

// Page transition variants
const pageVariants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1], // Custom easing for smooth effect
        },
    },
    exit: {
        opacity: 0,
        y: -10,
        transition: {
            duration: 0.3,
            ease: "easeIn",
        },
    },
};

/**
 * PageTransition - Wrapper component voor page animations
 * Wrap elke page content met dit component voor consistente transitions
 */
const PageTransition = ({ children, className = "" }) => {
    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;

