import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, Check, Cookie } from 'lucide-react';

const CookieConsent = () => {
    const [showConsent, setShowConsent] = useState(false);
    const [showPreferences, setShowPreferences] = useState(false);
    const [preferences, setPreferences] = useState({
        necessary: true, // Always true, can't be disabled
        analytics: false,
        marketing: false,
    });

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            // Show consent after a short delay for better UX
            setTimeout(() => {
                setShowConsent(true);
            }, 1000);
        } else {
            // Load saved preferences
            const savedPrefs = localStorage.getItem('cookiePreferences');
            if (savedPrefs) {
                setPreferences(JSON.parse(savedPrefs));
            }
        }
    }, []);

    const handleAcceptAll = () => {
        const allAccepted = {
            necessary: true,
            analytics: true,
            marketing: true,
        };
        setPreferences(allAccepted);
        localStorage.setItem('cookieConsent', 'accepted');
        localStorage.setItem('cookiePreferences', JSON.stringify(allAccepted));
        setShowConsent(false);
    };

    const handleRejectAll = () => {
        const onlyNecessary = {
            necessary: true,
            analytics: false,
            marketing: false,
        };
        setPreferences(onlyNecessary);
        localStorage.setItem('cookieConsent', 'rejected');
        localStorage.setItem('cookiePreferences', JSON.stringify(onlyNecessary));
        setShowConsent(false);
    };

    const handleSavePreferences = () => {
        localStorage.setItem('cookieConsent', 'custom');
        localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
        setShowConsent(false);
        setShowPreferences(false);
    };

    const handleOpenPreferences = () => {
        setShowPreferences(true);
    };

    if (!showConsent) return null;

    return (
        <AnimatePresence>
            {showConsent && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed z-[100] pointer-events-none"
                    style={{ 
                        left: 'auto',
                        right: '1rem',
                        bottom: '1rem'
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 20 }}
                        transition={{ 
                            type: "spring", 
                            damping: 20, 
                            stiffness: 300,
                            duration: 0.3
                        }}
                        className="relative bg-white rounded-xl shadow-2xl pointer-events-auto border border-gray-100"
                        style={{ 
                            width: 'calc(100vw - 2rem)',
                            maxWidth: '384px',
                            minWidth: '280px'
                        }}
                    >
                        <div className="relative p-4 sm:p-5 overflow-visible">
                            {/* Close button */}
                            <button
                                onClick={handleRejectAll}
                                className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-gray-100 transition-colors z-10"
                                aria-label="Sluiten"
                            >
                                <X size={18} className="text-gray-500" />
                            </button>

                            {!showPreferences ? (
                                <>
                                    {/* Main Content with Bear integrated */}
                                    <div className="flex items-center gap-3 mb-4 pr-8">
                                        {/* Cookie Bear - integrated in content */}
                                        <div className="flex-shrink-0 flex items-center justify-center">
                                            <img
                                                src="/images/cookie bear.webp"
                                                alt="Cookie Bear"
                                                className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1.5">
                                                Cookie-instellingen
                                            </h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                Wij gebruiken cookies om uw ervaring te verbeteren. U kunt zelf kiezen welke cookies u accepteert.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col gap-2">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleAcceptAll}
                                                className="flex-1 bg-primary text-white px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-1.5"
                                            >
                                                <Check size={16} />
                                                Accepteren
                                            </button>
                                            <button
                                                onClick={handleOpenPreferences}
                                                className="flex-1 bg-gray-100 text-foreground px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-1.5"
                                            >
                                                <Settings size={16} />
                                                Instellingen
                                            </button>
                                        </div>
                                        <button
                                            onClick={handleRejectAll}
                                            className="w-full border border-gray-300 text-foreground px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-50 transition-all"
                                        >
                                            Weigeren
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Preferences View */}
                                    <div className="mb-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="flex items-center justify-center">
                                                <img
                                                    src="/images/cookie bear.webp"
                                                    alt="Cookie Bear"
                                                    className="w-16 h-16 object-contain"
                                                />
                                            </div>
                                            <h3 className="text-lg sm:text-xl font-bold text-foreground">
                                                Cookie-voorkeuren
                                            </h3>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Kies welke cookies u wilt accepteren. Noodzakelijke cookies kunnen niet worden uitgeschakeld.
                                        </p>

                                        {/* Cookie Categories */}
                                        <div className="space-y-3">
                                            {/* Necessary Cookies */}
                                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                <div className="flex items-center justify-between mb-1">
                                                    <div>
                                                        <h4 className="text-sm font-semibold text-foreground">Noodzakelijke cookies</h4>
                                                        <p className="text-xs text-muted-foreground">
                                                            Essentieel voor de werking
                                                        </p>
                                                    </div>
                                                    <div className="px-2 py-1 bg-primary/10 rounded-full">
                                                        <Check className="text-primary" size={16} />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Analytics Cookies */}
                                            <div className="p-3 bg-white rounded-lg border border-gray-200">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="text-sm font-semibold text-foreground">Analytische cookies</h4>
                                                        <p className="text-xs text-muted-foreground">
                                                            Website verbeteren
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => setPreferences({ ...preferences, analytics: !preferences.analytics })}
                                                        className={`relative w-12 h-6 rounded-full transition-colors ${
                                                            preferences.analytics ? 'bg-primary' : 'bg-gray-300'
                                                        }`}
                                                    >
                                                        <motion.div
                                                            className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm"
                                                            animate={{
                                                                x: preferences.analytics ? 24 : 0,
                                                            }}
                                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                        />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Marketing Cookies */}
                                            <div className="p-3 bg-white rounded-lg border border-gray-200">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="text-sm font-semibold text-foreground">Marketing cookies</h4>
                                                        <p className="text-xs text-muted-foreground">
                                                            Gepersonaliseerde advertenties
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => setPreferences({ ...preferences, marketing: !preferences.marketing })}
                                                        className={`relative w-12 h-6 rounded-full transition-colors ${
                                                            preferences.marketing ? 'bg-primary' : 'bg-gray-300'
                                                        }`}
                                                    >
                                                        <motion.div
                                                            className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm"
                                                            animate={{
                                                                x: preferences.marketing ? 24 : 0,
                                                            }}
                                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Save Button */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setShowPreferences(false)}
                                            className="flex-1 border border-gray-300 text-foreground px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-50 transition-all"
                                        >
                                            Terug
                                        </button>
                                        <button
                                            onClick={handleSavePreferences}
                                            className="flex-1 bg-primary text-white px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-1.5"
                                        >
                                            <Check size={16} />
                                            Opslaan
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CookieConsent;

