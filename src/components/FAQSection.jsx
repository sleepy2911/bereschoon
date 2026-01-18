import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Clock, ShieldCheck, Home, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQItem = ({ icon: Icon, question, answer, isOpen, toggle }) => {
    return (
        <div className={`border rounded-xl overflow-hidden shadow-sm transition-all duration-300 ${isOpen ? 'border-primary ring-1 ring-primary/20 shadow-md bg-white' : 'border-gray-200 hover:border-primary/50 bg-white'}`}>
            <button
                onClick={toggle}
                className="w-full flex items-center justify-between p-4 md:p-6 text-left focus:outline-none gap-3 md:gap-4"
            >
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg transition-colors ${isOpen ? 'bg-primary text-white' : 'bg-primary/5 text-primary'}`}>
                        <Icon size={20} className="md:w-6 md:h-6" />
                    </div>
                    <span className={`font-bold text-base md:text-lg ${isOpen ? 'text-primary' : 'text-foreground'}`}>{question}</span>
                </div>
                {isOpen ? (
                    <ChevronUp className="text-primary flex-shrink-0" size={24} />
                ) : (
                    <ChevronDown className="text-gray-400 flex-shrink-0" size={24} />
                )}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="px-4 pb-4 pt-0 md:px-6 md:pb-6 text-muted-foreground leading-relaxed text-sm md:text-base">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FAQSection = ({ questions, title, subtitle, className = "bg-gray-50" }) => {
    const [openIndex, setOpenIndex] = useState(0);

    const defaultQuestions = [
        {
            icon: Clock,
            question: "Hoelang blijft het resultaat mooi?",
            answer: "Dit is afhankelijk van de ligging en de gekozen behandeling. Met onze Premium behandeling en beschermlaag blijft uw terras of oprit doorgaans 2 tot 3 jaar vrij van groene aanslag en korstmossen schoon. Zonder beschermlaag is dit vaak 6-12 maanden."
        },
        {
            icon: ShieldCheck,
            question: "Is de reiniging veilig voor mijn tegels?",
            answer: "Absoluut. Wij passen de waterdruk en temperatuur aan op het type steen. Voor kwetsbare stenen gebruiken we softwash-technieken (lage druk, biologische middelen) om schade te voorkomen. Uw bestrating is bij ons in veilige handen."
        },
        {
            icon: Home,
            question: "Moet ik thuis zijn tijdens de reiniging?",
            answer: "Nee, dat is niet noodzakelijk zolang wij toegang hebben tot het te reinigen oppervlak en een wateraansluiting. Wij sturen u foto's van het resultaat als u niet thuis bent."
        },
        {
            icon: Sparkles,
            question: "Wat is het verschil tussen reinigen en impregneren?",
            answer: "Reinigen verwijdert het vuil dat nu aanwezig is. Impregneren brengt een onzichtbare beschermlaag aan die diep in de steen trekt. Hierdoor hecht nieuw vuil en groene aanslag zich minder snel, waardoor het resultaat veel langer behouden blijft."
        }
    ];

    const displayQuestions = questions || defaultQuestions;

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const handleMouseEnter = (index) => {
        // Disable hover on mobile (screens < 768px) to prevent sticky states/glitches
        if (window.innerWidth < 768) return;

        // Clear any existing timeout to prevent bouncing
        if (window.faqTimeout) clearTimeout(window.faqTimeout);

        // Add a small delay so scrolling doesn't trigger it immediately
        window.faqTimeout = setTimeout(() => {
            setOpenIndex(index);
        }, 150);
    };

    return (
        <section className={`py-12 md:py-24 ${className}`}>
            <div className="container mx-auto px-6 max-w-5xl">
                <div className="text-center mb-10 md:mb-16">
                    <span className="text-primary font-bold tracking-wider text-sm uppercase mb-2 block">
                        {subtitle || "Veelgestelde Vragen"}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                        {title || "Alles wat u moet weten"}
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-3 md:gap-6">
                    {displayQuestions.map((item, index) => (
                        <div
                            key={index}
                            className="h-full"
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={() => {
                                if (window.faqTimeout) clearTimeout(window.faqTimeout);
                            }}
                        >
                            <FAQItem
                                icon={item.icon}
                                question={item.question}
                                answer={item.answer}
                                isOpen={openIndex === index}
                                toggle={() => toggleFAQ(index)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
