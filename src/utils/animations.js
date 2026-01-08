/**
 * Framer Motion Animation Variants voor Bereschoon
 * Herbruikbare animatie configuraties voor de hele website
 */

// Basis fade-in van beneden naar boven
export const fadeInUp = {
    hidden: {
        opacity: 0,
        y: 40,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1], // Custom easing voor smooth effect
        },
    },
};

// Fade-in van links
export const fadeInLeft = {
    hidden: {
        opacity: 0,
        x: -40,
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

// Fade-in van rechts
export const fadeInRight = {
    hidden: {
        opacity: 0,
        x: 40,
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

// Scale-in animatie voor kaarten en afbeeldingen
export const scaleIn = {
    hidden: {
        opacity: 0,
        scale: 0.9,
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

// Container met staggered children
export const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

// Snellere stagger voor hero elementen
export const heroStagger = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.3,
        },
    },
};

// Hero text animatie
export const heroText = {
    hidden: {
        opacity: 0,
        y: 30,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

// Zachte float animatie (voor decoratieve elementen)
export const floatAnimation = {
    animate: {
        y: [0, -10, 0],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
};

// Pulse animatie voor buttons/CTAs
export const pulseAnimation = {
    animate: {
        scale: [1, 1.02, 1],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
};

// Water ripple effect variant
export const waterRipple = {
    initial: {
        scale: 0,
        opacity: 0.8,
    },
    animate: {
        scale: 4,
        opacity: 0,
        transition: {
            duration: 1,
            ease: "easeOut",
        },
    },
};

// Bubble float animation
export const bubbleFloat = {
    initial: (custom) => ({
        y: "100vh",
        x: custom.x,
        scale: custom.scale,
        opacity: 0,
    }),
    animate: (custom) => ({
        y: "-20vh",
        x: [custom.x, custom.x + 20, custom.x - 20, custom.x],
        scale: custom.scale,
        opacity: [0, 0.6, 0.6, 0],
        transition: {
            duration: custom.duration,
            repeat: Infinity,
            delay: custom.delay,
            ease: "linear",
        },
    }),
};

// Spray/mist effect
export const sprayMist = {
    initial: {
        opacity: 0,
        x: -20,
    },
    animate: {
        opacity: [0, 0.3, 0.3, 0],
        x: [0, 100, 200],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
        },
    },
};

// Wave animation voor SVG paths
export const waveAnimation = {
    animate: {
        d: [
            "M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,149.3C672,149,768,171,864,165.3C960,160,1056,128,1152,117.3C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
            "M0,128L48,138.7C96,149,192,171,288,165.3C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,149.3C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
        ],
        transition: {
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
        },
    },
};

// Count up animation helper
export const countUpVariant = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.5,
        },
    },
};

// Parallax scroll effect - gebruik met useTransform
export const parallaxConfig = {
    slow: { inputRange: [0, 1], outputRange: ["0%", "30%"] },
    medium: { inputRange: [0, 1], outputRange: ["0%", "50%"] },
    fast: { inputRange: [0, 1], outputRange: ["0%", "100%"] },
};

// Viewport settings voor scroll-triggered animaties
export const viewportSettings = {
    once: true,
    amount: 0.2,
    margin: "-100px",
};

// Stricter viewport voor kaarten
export const cardViewport = {
    once: true,
    amount: 0.3,
};

