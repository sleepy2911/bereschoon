import React, { useState, useEffect } from 'react';
import { Check, ChevronRight, Star, Shield, Clock, ArrowRight, Upload, Camera, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

const ChoiceHelperHero = () => {
    const [step, setStep] = useState(1);
    const [selection, setSelection] = useState({
        service: null,
        propertyType: null,
        squareMeters: '',
        files: [],
        contact: {
            firstName: '',
            lastName: '',
            email: '',
            address: '',
            phone: ''
        }
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState(null); // { success, price, quote, message }
    const [error, setError] = useState(null);

    // Navigation Lock
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (step > 1 && !result) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [step, result]);

    const handleSelect = (key, value) => {
        setSelection(prev => ({ ...prev, [key]: value }));
        if (key === 'service') setStep(2);
        // Step 2 has input, so we don't auto-advance on property type selection alone effectively unless we want to.
        // But for consistency let's keep it manual or auto if they click the button. 
        // I'll make Step 2 buttons auto-advance only if sq meters is not required yet, but we want sq meters.
        // So I will make Step 2 require a "Next" button click.
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelection(prev => ({ ...prev, files: [...prev.files, ...Array.from(e.target.files)] }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('service', selection.service);
            formData.append('propertyType', selection.propertyType);
            formData.append('squareMeters', selection.squareMeters);
            formData.append('firstName', selection.contact.firstName);
            formData.append('lastName', selection.contact.lastName);
            formData.append('email', selection.contact.email);
            formData.append('address', selection.contact.address);
            formData.append('phone', selection.contact.phone);

            selection.files.forEach((file, index) => {
                formData.append(`photo_${index}`, file);
            });

            const { data, error } = await supabase.functions.invoke('calculate-ad-quote', {
                body: formData,
            });

            if (error) throw error;
            if (data.error) throw new Error(data.error);

            setResult(data);
            setStep(5); // Success Step

        } catch (err) {
            console.error('Submission error:', err);
            setError(err.message || 'Er is iets misgegaan. Probeer het later opnieuw.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const services = [
        { id: 'terras', label: 'Oprit, Terras of Terreinreiniging', icon: '▦' },
        { id: 'gevel', label: 'Gevelreiniging', icon: '🏠' },
        { id: 'onkruid', label: 'Onkruidbeheersing', icon: '🍃' }
    ];

    return (
        <div className="relative min-h-screen flex items-center overflow-hidden bg-black">
            {/* Background Image with Dark Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/images/hero/home/hero-home1.webp"
                    alt="Background"
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
                <div className="absolute inset-0 bg-[#2D2420]/30 mix-blend-multiply" />
            </div>

            <div className="container mx-auto px-6 relative z-10 py-20 lg:py-0">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Left Column: Branding Text */}
                    <div className="max-w-2xl text-white">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 mt-12 md:mt-0">
                            Ontdek wat wij voor <span className="text-primary">u</span> kunnen betekenen
                        </h1>
                        <p className="text-lg text-gray-200 mb-8 leading-relaxed max-w-xl">
                            Ontvang een persoonlijke offerte en direct een indicatie hoe jouw bereschone oprit eruit komt te zien.
                        </p>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-3 mb-10">
                            <div className="px-4 py-2 bg-white/10 backdrop-blur border border-white/20 rounded-lg flex items-center gap-2 text-sm font-medium">
                                <Shield className="w-4 h-4 text-primary" /> Gratis en vrijblijvend
                            </div>
                            <div className="px-4 py-2 bg-white/10 backdrop-blur border border-white/20 rounded-lg flex items-center gap-2 text-sm font-medium">
                                <Clock className="w-4 h-4 text-primary" /> Reactie binnen 24 uur
                            </div>
                            <div className="px-4 py-2 bg-white/10 backdrop-blur border border-white/20 rounded-lg flex items-center gap-2 text-sm font-medium">
                                <Star className="w-4 h-4 text-primary" /> Vakkundig advies op maat
                            </div>
                        </div>

                        {/* Checkmarks */}
                        <div className="space-y-4 mb-10">
                            {[
                                "Persoonlijke offerte op maat",
                                "Transparante prijzen",
                                "Geen verplichtingen",
                                "Direct een indicatie"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full flex items-center justify-center border border-primary text-primary bg-primary/10">
                                        <Check size={14} strokeWidth={3} />
                                    </div>
                                    <span className="font-medium text-lg">{item}</span>
                                </div>
                            ))}
                        </div>

                        {/* Google Review Badge */}
                        <div className="inline-flex items-center gap-3 bg-[#2D2420] px-4 py-2 rounded-lg border border-white/10">
                            <div className="flex gap-0.5 text-[#F59E0B]">
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill="currentColor" />)}
                            </div>
                            <span className="font-bold">5.0/5</span>
                            <span className="text-gray-400 text-sm">op Google</span>
                        </div>
                    </div>

                    {/* Right Column: Interactive Choice Helper */}
                    <div className="bg-white rounded-3xl p-6 md:p-8 lg:p-10 shadow-2xl text-foreground relative overflow-hidden max-w-2xl w-full mx-auto">
                        <div className="absolute -left-20 top-20 w-40 h-40 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />

                        <div className="relative z-10">
                            <h2 className="text-2xl font-bold mb-2">Stel uw aanvraag samen</h2>
                            <p className="text-gray-500 text-sm mb-6">Binnen 1 minuut ingevuld — wij reageren binnen 24 uur</p>

                            {/* Progress Dots */}
                            {step < 5 && (
                                <div className="flex items-center justify-between mb-8 relative px-2">
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-100 -z-10" />
                                    {[1, 2, 3, 4].map((s) => (
                                        <div
                                            key={s}
                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 z-10
                                                ${step >= s ? 'bg-primary text-white scale-110' : 'bg-gray-100 text-gray-400'}`}
                                            style={step < s ? { backgroundColor: '#f3f4f6', color: '#9ca3af' } : {}}
                                        >
                                            {step > s ? <Check size={14} /> : s}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <h3 className="text-lg font-semibold mb-4">Welke dienst heeft u nodig?</h3>
                                        <div className="grid grid-cols-1 gap-3">
                                            {services.map(s => (
                                                <button
                                                    key={s.id}
                                                    onClick={() => handleSelect('service', s.id)}
                                                    className="p-4 rounded-xl border-2 border-transparent bg-gray-50 hover:bg-white hover:border-primary/50 hover:shadow-lg transition-all text-left group flex items-start gap-4"
                                                >
                                                    <div className="text-2xl mt-1">{s.icon}</div>
                                                    <div>
                                                        <div className="font-bold group-hover:text-primary transition-colors">{s.label}</div>
                                                        <div className="text-xs text-gray-500 mt-1">Specialistische reiniging door vakmensen</div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="flex items-center gap-2 mb-4">
                                            <button onClick={() => setStep(1)} className="text-sm text-gray-400 hover:text-primary font-medium">
                                                ← Terug
                                            </button>
                                        </div>
                                        <h3 className="text-lg font-semibold mb-4">Om wat voor pand gaat het?</h3>

                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Type pand</label>
                                            <div className="grid grid-cols-1 gap-3">
                                                {['Woning (Particulier)', 'Bedrijfspand', 'VvE / Complex'].map(type => (
                                                    <button
                                                        key={type}
                                                        onClick={() => setSelection(prev => ({ ...prev, propertyType: type }))}
                                                        className={`px-6 py-4 rounded-xl border-2 transition-all text-left font-semibold flex justify-between items-center group
                                                            ${selection.propertyType === type ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-primary hover:bg-primary/5'}`}
                                                    >
                                                        {type}
                                                        {selection.propertyType === type && <Check className="text-primary" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Geschat oppervlakte (m²)</label>
                                            <input
                                                type="number"
                                                placeholder="Bijv. 50"
                                                value={selection.squareMeters}
                                                onChange={(e) => setSelection(prev => ({ ...prev, squareMeters: e.target.value }))}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                            />
                                            <p className="text-xs text-gray-400 mt-1">Een schatting is voldoende.</p>
                                        </div>

                                        <button
                                            disabled={!selection.propertyType}
                                            onClick={() => setStep(3)}
                                            className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary/90 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Ga verder <ChevronRight size={18} />
                                        </button>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="flex items-center gap-2 mb-4">
                                            <button onClick={() => setStep(2)} className="text-sm text-gray-400 hover:text-primary font-medium">
                                                ← Terug
                                            </button>
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2">Situatieschets</h3>

                                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex items-start gap-3">
                                            <Camera className="text-blue-500 mt-0.5 flex-shrink-0" size={18} />
                                            <p className="text-sm text-blue-700">
                                                <strong>Tip:</strong> Zorg dat je eerste foto een foto is waarbij je jouw bereschone resultaat ziet.
                                            </p>
                                        </div>

                                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer bg-gray-50 mb-6 relative">
                                            <input
                                                type="file"
                                                multiple
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={handleFileChange}
                                            />
                                            <Upload className="mx-auto text-gray-400 mb-3" size={32} />
                                            <p className="font-medium text-gray-900">Sleep bestanden hierheen of klik om te uploaden</p>
                                            <p className="text-sm text-gray-500 mt-1">JPG, PNG of PDF (max. 10MB)</p>
                                            {selection.files.length > 0 && (
                                                <div className="mt-4 text-sm font-medium text-primary">
                                                    {selection.files.length} bestand(en) geselecteerd
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => setStep(4)}
                                            className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary/90 transition-all shadow-lg flex items-center justify-center gap-2"
                                        >
                                            Ga verder <ChevronRight size={18} />
                                        </button>
                                    </motion.div>
                                )}

                                {step === 4 && (
                                    <motion.div
                                        key="step4"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="flex items-center gap-2 mb-4">
                                            <button onClick={() => setStep(3)} className="text-sm text-gray-400 hover:text-primary font-medium">
                                                ← Terug
                                            </button>
                                        </div>
                                        <h3 className="text-lg font-semibold mb-4">Uw gegevens</h3>

                                        {error && (
                                            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4 text-sm flex items-center gap-2">
                                                <AlertCircle size={16} /> {error}
                                            </div>
                                        )}

                                        <form className="space-y-4" onSubmit={handleSubmit}>
                                            <div className="grid grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    placeholder="Voornaam"
                                                    required
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                                    value={selection.contact.firstName}
                                                    onChange={e => setSelection(prev => ({ ...prev, contact: { ...prev.contact, firstName: e.target.value } }))}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Achternaam"
                                                    required
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                                    value={selection.contact.lastName}
                                                    onChange={e => setSelection(prev => ({ ...prev, contact: { ...prev.contact, lastName: e.target.value } }))}
                                                />
                                            </div>
                                            <input
                                                type="email"
                                                placeholder="E-mailadres"
                                                required
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                                value={selection.contact.email}
                                                onChange={e => setSelection(prev => ({ ...prev, contact: { ...prev.contact, email: e.target.value } }))}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Postcode + Huisnummer"
                                                required
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                                value={selection.contact.address}
                                                onChange={e => setSelection(prev => ({ ...prev, contact: { ...prev.contact, address: e.target.value } }))}
                                            />
                                            <input
                                                type="tel"
                                                placeholder="Telefoonnummer"
                                                required
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                                value={selection.contact.phone}
                                                onChange={e => setSelection(prev => ({ ...prev, contact: { ...prev.contact, phone: e.target.value } }))}
                                            />

                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                                            >
                                                {isSubmitting ? <Loader2 className="animate-spin" /> : <>Verstuur Aanvraag <ArrowRight size={20} /></>}
                                            </button>
                                            <p className="text-xs text-center text-gray-400">
                                                Door te versturen gaat u akkoord met onze privacyvoorwaarden.
                                            </p>
                                        </form>
                                    </motion.div>
                                )}

                                {step === 5 && (
                                    <motion.div
                                        key="step5"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5 }}
                                        className="text-center py-10"
                                    >
                                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                                            <Check size={40} strokeWidth={3} />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-4">Aanvraag Ontvangen!</h3>
                                        <p className="text-gray-600 mb-8">
                                            Bedankt {selection.contact.firstName}. We hebben uw aanvraag goed ontvangen.
                                            {result?.quote?.total && (
                                                <span className="block mt-4 font-medium text-lg text-primary">
                                                    Indicatie: €{result.quote.total.toFixed(2)} (excl. BTW)
                                                </span>
                                            )}
                                            {result?.quote?.message && (
                                                <span className="block mt-4 font-medium text-gray-500">
                                                    {result.quote.message}
                                                </span>
                                            )}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            We nemen binnen 24 uur contact met u op.
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChoiceHelperHero;
