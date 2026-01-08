import React from 'react';
import { motion } from 'framer-motion';

/**
 * WaveDivider Component
 * Creëert een geanimeerde golf-vorm tussen secties
 * 
 * @param {string} position - 'top' of 'bottom'
 * @param {string} color - Tailwind kleur class (bijv. 'fill-white')
 * @param {boolean} animated - Of de golf moet animeren
 * @param {boolean} flip - Flip de golf horizontaal
 * @param {string} className - Extra CSS classes
 */
const WaveDivider = ({ 
    position = 'bottom', 
    color = 'fill-white', 
    animated = true,
    flip = false,
    className = '' 
}) => {
    // Twee verschillende wave paths voor animatie
    const wavePath1 = "M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,149.3C672,149,768,171,864,165.3C960,160,1056,128,1152,117.3C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z";
    
    const wavePath2 = "M0,128L48,138.7C96,149,192,171,288,165.3C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,149.3C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z";

    const positionStyles = {
        top: 'top-0 rotate-180',
        bottom: 'bottom-0',
    };

    return (
        <div 
            className={`absolute left-0 right-0 w-full overflow-hidden leading-none ${positionStyles[position]} ${className}`}
            style={{ 
                height: '120px',
                transform: `${position === 'top' ? 'rotate(180deg)' : ''} ${flip ? 'scaleX(-1)' : ''}`,
            }}
        >
            <svg 
                className="relative block w-full h-full"
                viewBox="0 0 1440 320" 
                preserveAspectRatio="none"
            >
                {animated ? (
                    <motion.path
                        className={color}
                        initial={{ d: wavePath1 }}
                        animate={{ d: [wavePath1, wavePath2, wavePath1] }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                ) : (
                    <path className={color} d={wavePath1} />
                )}
            </svg>
        </div>
    );
};

/**
 * WaveDividerLayered Component
 * Meerdere golf-lagen voor een dieper effect
 */
export const WaveDividerLayered = ({ 
    position = 'bottom',
    colors = ['fill-primary/20', 'fill-primary/40', 'fill-white'],
    className = ''
}) => {
    const wavePaths = [
        "M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
        "M0,128L48,144C96,160,192,192,288,186.7C384,181,480,139,576,128C672,117,768,139,864,160C960,181,1056,203,1152,192C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
        "M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,149.3C672,149,768,171,864,165.3C960,160,1056,128,1152,117.3C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
    ];

    const wavePaths2 = [
        "M0,192L48,186.7C96,181,192,171,288,181.3C384,192,480,224,576,218.7C672,213,768,171,864,160C960,149,1056,171,1152,181.3C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
        "M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,149.3C672,139,768,149,864,165.3C960,181,1056,203,1152,192C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
        "M0,128L48,138.7C96,149,192,171,288,165.3C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,149.3C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
    ];

    return (
        <div 
            className={`absolute left-0 right-0 w-full overflow-hidden leading-none ${position === 'top' ? 'top-0 rotate-180' : 'bottom-0'} ${className}`}
            style={{ height: '150px' }}
        >
            {colors.map((color, index) => (
                <svg 
                    key={index}
                    className="absolute bottom-0 left-0 w-full"
                    viewBox="0 0 1440 320" 
                    preserveAspectRatio="none"
                    style={{ 
                        height: `${100 - index * 20}%`,
                        opacity: 1 - index * 0.1,
                    }}
                >
                    <motion.path
                        className={color}
                        initial={{ d: wavePaths[index] }}
                        animate={{ d: [wavePaths[index], wavePaths2[index], wavePaths[index]] }}
                        transition={{
                            duration: 6 + index * 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                </svg>
            ))}
        </div>
    );
};

/**
 * CurvedDivider Component
 * Simpele gebogen lijn tussen secties
 */
export const CurvedDivider = ({ 
    position = 'bottom', 
    color = 'fill-white',
    height = 80,
    className = '' 
}) => {
    return (
        <div 
            className={`absolute left-0 right-0 w-full overflow-hidden leading-none ${position === 'top' ? 'top-0 rotate-180' : 'bottom-0'} ${className}`}
            style={{ height: `${height}px` }}
        >
            <svg 
                className="relative block w-full h-full"
                viewBox="0 0 1440 100" 
                preserveAspectRatio="none"
            >
                <path 
                    className={color}
                    d="M0,0 C480,100 960,100 1440,0 L1440,100 L0,100 Z"
                />
            </svg>
        </div>
    );
};

/**
 * DiagonalDivider Component
 * Schuine lijn tussen secties
 */
export const DiagonalDivider = ({ 
    position = 'bottom', 
    color = 'fill-white',
    direction = 'left', // 'left' of 'right'
    height = 100,
    className = '' 
}) => {
    const pathLeft = "M0,0 L1440,100 L1440,100 L0,100 Z";
    const pathRight = "M0,100 L1440,0 L1440,100 L0,100 Z";

    return (
        <div 
            className={`absolute left-0 right-0 w-full overflow-hidden leading-none ${position === 'top' ? 'top-0 rotate-180' : 'bottom-0'} ${className}`}
            style={{ height: `${height}px` }}
        >
            <svg 
                className="relative block w-full h-full"
                viewBox="0 0 1440 100" 
                preserveAspectRatio="none"
            >
                <path 
                    className={color}
                    d={direction === 'left' ? pathLeft : pathRight}
                />
            </svg>
        </div>
    );
};

export default WaveDivider;

