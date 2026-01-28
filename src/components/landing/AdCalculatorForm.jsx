import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check, Loader2, Grid3X3, Home, Leaf, Upload, User, AlertCircle, ChevronRight, Mail, Phone, MapPin, Building } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const AdCalculatorForm = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [selectedService, setSelectedService] = useState('');
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState('');
    const [photos, setPhotos] = useState([]);
    const [photoPreviews, setPhotoPreviews] = useState([]);
    const [formData, setFormData] = useState({
        vierkanteMeters: '',
        naam: '',
        bedrijfsnaam: '',
        email: '',
        telefoon: '',
        adres: '',
        postcode: '',
        city: '',
        toelichting: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);

    // Services without visible prices - Enhanced styling
    const services = [
        { id: 'oprit-terras-terrein', label: 'Oprit, Terras of Terrein', icon: Grid3X3, desc: 'Complete reiniging van uw bestrating' },
        { id: 'gevelreiniging', label: 'Gevelreiniging', icon: Home, desc: 'Herstel de uitstraling van uw woning' },
        { id: 'onkruidbeheersing', label: 'Onkruidbeheersing', labelSuffix: '(zakelijk)', icon: Leaf, desc: 'Effectieve en duurzame bestrijding' }
    ];

    const opritOptions = [
        { id: 'invegen', label: 'Invegen', desc: 'Opvullen van voegen' },
        { id: 'preventieve-onkruid', label: 'Preventieve behandeling', desc: 'Tegen groene aanslag' },
        { id: 'beschermlaag', label: 'Beschermlaag', desc: 'Vuil- en waterafstotend' }
    ];

    const gevelOptions = [
        { id: 'gevelreiniging-optie', label: 'Stoomreiniging', desc: 'Zachte maar effectieve reiniging' },
        { id: 'gevelimpregnatie', label: 'Impregneren', desc: 'Bescherming tegen vocht' }
    ];

    const onkruidPlannen = [
        { id: '4-weken', label: 'Elke 4 weken', desc: 'Intensief onderhoud' },
        { id: '8-weken', label: 'Elke 8 weken', desc: 'Regulier onderhoud' },
        { id: '12-weken', label: 'Elke 12 weken', desc: 'Basis onderhoud' },
        { id: '16-weken', label: 'Elke 16 weken', desc: 'Minimaal onderhoud' }
    ];

    const handleServiceSelect = (id) => {
        setSelectedService(id);
        setSelectedOptions([]);
        setSelectedPlan('');
        setStep(2);
    };

    const handleOptionToggle = (id) => {
        if (id === 'gevelreiniging-optie') return;
        setSelectedOptions(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        setPhotos(prev => [...prev, ...files]);

        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => setPhotoPreviews(prev => [...prev, reader.result]);
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('service_type', selectedService);
            formDataToSend.append('name', formData.naam);
            formDataToSend.append('email', formData.email);
            if (formData.bedrijfsnaam) formDataToSend.append('company_name', formData.bedrijfsnaam);
            formDataToSend.append('phone', formData.telefoon);
            formDataToSend.append('street_address', formData.adres); // Keep simple as per previous iteration logic

            // Simple parsing to satisfy backend requirements for split fields if needed
            const parts = formData.adres.split(',').map(s => s.trim());
            const street = parts[0] || formData.adres;
            const city = parts[1] || '';

            formDataToSend.append('street_address', street);
            formDataToSend.append('city', city);
            formDataToSend.append('postcode', formData.postcode || '');
            formDataToSend.append('message', formData.toelichting);
            formDataToSend.append('square_meters', formData.vierkanteMeters);
            formDataToSend.append('service_options', JSON.stringify(selectedOptions));
            formDataToSend.append('service_plan', selectedPlan);

            photos.forEach((p, i) => formDataToSend.append(`photo_${i}`, p));

            const { data, error } = await supabase.functions.invoke('calculate-ad-quote', {
                body: formDataToSend
            });

            if (error) throw error;
            if (data.error) throw new Error(data.error);

            // Ignore data result price, just show success
            setIsSubmitted(true);

        } catch (err) {
            console.error(err);
            setError(err.message || 'Er is iets misgegaan.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const cardClasses = "bg-white rounded-[2rem] shadow-2xl overflow-hidden min-h-[600px] flex flex-col border border-stone-100 relative";
    const headerClasses = "text-3xl md:text-4xl font-extrabold text-stone-900 mb-3 tracking-tight";
    const subHeaderClasses = "text-stone-500 text-lg font-medium";
    const buttonBaseClasses = "w-full p-6 border-2 rounded-2xl text-left transition-all duration-200 group relative overflow-hidden";
    const buttonActiveClasses = "border-primary bg-primary/5 shadow-lg scale-[1.02] ring-1 ring-primary/20";
    const buttonInactiveClasses = "border-stone-100 hover:border-primary/50 hover:bg-stone-50";

    if (isSubmitted) {
        return (
            <div className={`${cardClasses} items-center justify-center p-12 animate-in fade-in zoom-in duration-500`}>
                <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent pointer-events-none" />
                <div className="relative z-10 max-w-lg w-full text-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 text-green-600 shadow-sm animate-bounce-slow">
                        <Check size={48} strokeWidth={3} />
                    </div>
                    <h3 className={headerClasses}>Aanvraag Ontvangen!</h3>
                    <p className="text-xl text-stone-600 mb-10 leading-relaxed">
                        Bedankt {formData.naam.split(' ')[0]}.<br />
                        We nemen <span className="font-semibold text-primary">binnen 24 uur</span> contact op.
                    </p>

                    <button
                        onClick={() => navigate('/projecten')}
                        className="w-full bg-primary text-white text-xl font-bold py-5 rounded-2xl hover:bg-primary/90 transition-all shadow-xl hover:shadow-primary/30 flex items-center justify-center gap-3 group transform hover:-translate-y-1"
                    >
                        Bekijk onze projecten
                        <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={cardClasses}>
            {/* Glossy Header Effect */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-stone-50/80 to-transparent pointer-events-none z-0" />

            {/* Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-stone-100 z-10">
                <div
                    className="h-full bg-primary transition-all duration-700 ease-out shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                    style={{ width: `${(step / 4) * 100}%` }}
                />
            </div>

            <div className="p-8 md:p-12 flex-grow flex flex-col relative z-20">
                {/* Header */}
                <div className="mb-10 text-center md:text-left">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className={headerClasses}>
                                {step === 1 && "Waarmee kunnen we helpen?"}
                                {step === 2 && "Personaliseer uw aanvraag"}
                                {step === 3 && "Heeft u foto's?"}
                                {step === 4 && "Uw contactgegevens"}
                            </h2>
                            <p className={subHeaderClasses}>{step === 1 ? "Kies de gewenste dienst" : `Stap ${step} van 4 — Bijna klaar`}</p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Steps */}
                {step === 1 && (
                    <div className="space-y-4 animate-in slide-in-from-right-8 fade-in duration-300">
                        {services.map(s => (
                            <button
                                key={s.id}
                                onClick={() => handleServiceSelect(s.id)}
                                className={`${buttonBaseClasses} flex items-center ${selectedService === s.id ? buttonActiveClasses : buttonInactiveClasses}`}
                            >
                                <div className={`p-4 rounded-xl transition-colors ${selectedService === s.id ? 'bg-primary text-white' : 'bg-stone-100 text-stone-600 group-hover:bg-primary/10 group-hover:text-primary'}`}>
                                    <s.icon className="w-8 h-8" />
                                </div>
                                <div className="ml-6 flex-grow">
                                    <div className="font-bold text-xl text-stone-900 mb-1">
                                        {s.label}
                                        {s.labelSuffix && (
                                            <span className="text-stone-400 font-normal text-base ml-1">{s.labelSuffix}</span>
                                        )}
                                    </div>
                                    <div className="text-sm text-stone-500 font-medium group-hover:text-primary/70">{s.desc}</div>
                                </div>
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${selectedService === s.id ? 'bg-primary text-white' : 'bg-stone-100 text-stone-400 group-hover:bg-primary group-hover:text-white'}`}>
                                    <ArrowRight size={22} />
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-8 animate-in slide-in-from-right-8 fade-in duration-300">
                        <div className="space-y-4">
                            {selectedService === 'oprit-terras-terrein' && opritOptions.map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => handleOptionToggle(opt.id)}
                                    className={`${buttonBaseClasses} flex justify-between items-center py-5 ${selectedOptions.includes(opt.id) ? buttonActiveClasses : buttonInactiveClasses}`}
                                >
                                    <div>
                                        <span className="font-bold text-lg text-stone-900 block">{opt.label}</span>
                                        <span className="text-sm text-stone-500">{opt.desc}</span>
                                    </div>
                                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${selectedOptions.includes(opt.id) ? 'border-primary bg-primary text-white' : 'border-stone-200'}`}>
                                        {selectedOptions.includes(opt.id) && <Check size={16} strokeWidth={3} />}
                                    </div>
                                </button>
                            ))}

                            {selectedService === 'gevelreiniging' && gevelOptions.map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => handleOptionToggle(opt.id)}
                                    className={`${buttonBaseClasses} flex justify-between items-center py-5 ${selectedOptions.includes(opt.id) || opt.id === 'gevelreiniging-optie' ? buttonActiveClasses : buttonInactiveClasses}`}
                                >
                                    <div>
                                        <span className="font-bold text-lg text-stone-900 block">{opt.label}</span>
                                        <span className="text-sm text-stone-500">{opt.desc}</span>
                                    </div>
                                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${selectedOptions.includes(opt.id) || opt.id === 'gevelreiniging-optie' ? 'border-primary bg-primary text-white' : 'border-stone-200'}`}>
                                        {(selectedOptions.includes(opt.id) || opt.id === 'gevelreiniging-optie') && <Check size={16} strokeWidth={3} />}
                                    </div>
                                </button>
                            ))}

                            {selectedService === 'onkruidbeheersing' && onkruidPlannen.map(plan => (
                                <button
                                    key={plan.id}
                                    onClick={() => setSelectedPlan(plan.id)}
                                    className={`${buttonBaseClasses} flex justify-between items-center py-5 ${selectedPlan === plan.id ? buttonActiveClasses : buttonInactiveClasses}`}
                                >
                                    <div>
                                        <span className="font-bold text-lg text-stone-900 block">{plan.label}</span>
                                        <span className="text-sm text-stone-500">{plan.desc}</span>
                                    </div>
                                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${selectedPlan === plan.id ? 'border-primary bg-primary text-white' : 'border-stone-200'}`}>
                                        {selectedPlan === plan.id && <Check size={16} strokeWidth={3} />}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200/50">
                            <label className="block text-sm font-bold text-stone-500 mb-3 uppercase tracking-wider">Geschatte oppervlakte (m²)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    placeholder="Bijv. 50"
                                    value={formData.vierkanteMeters}
                                    onChange={e => setFormData({ ...formData, vierkanteMeters: e.target.value })}
                                    className="w-full p-4 pl-4 text-xl font-medium border-2 border-stone-200 rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-stone-300"
                                />
                                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-stone-400 font-bold">m²</span>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button onClick={handleBack} className="w-1/3 flex items-center justify-center p-4 rounded-xl border-2 border-stone-200 font-bold text-stone-600 hover:bg-stone-50 transition-all hover:scale-[1.02]">
                                <ArrowLeft size={20} className="mr-2" /> Terug
                            </button>
                            <button onClick={handleNext} className="flex-grow bg-primary text-white font-bold p-4 rounded-xl hover:bg-primary/90 transition-all shadow-xl hover:shadow-primary/30 flex items-center justify-center hover:scale-[1.02]">
                                Volgende <ArrowRight size={20} className="ml-2" />
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-8 animate-in slide-in-from-right-8 fade-in duration-300">
                        <div className="border-3 border-dashed border-stone-200 rounded-3xl p-12 hover:border-primary hover:bg-primary/5 cursor-pointer transition-all relative text-center group">
                            <input type="file" multiple onChange={handlePhotoUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform text-primary duration-300">
                                <Upload size={36} />
                            </div>
                            <h4 className="text-2xl font-bold text-stone-900 mb-2">Klik om foto's te uploaden</h4>
                            <p className="text-stone-500 text-lg">of sleep bestanden hierheen</p>
                            <p className="text-stone-400 text-sm mt-4">(Optioneel)</p>
                        </div>

                        {photoPreviews.length > 0 && (
                            <div className="grid grid-cols-3 gap-4">
                                {photoPreviews.map((src, i) => (
                                    <div key={i} className="relative aspect-square rounded-2xl overflow-hidden shadow-md ring-2 ring-stone-100">
                                        <img src={src} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" alt="" />
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-4 pt-4">
                            <button onClick={handleBack} className="w-1/3 flex items-center justify-center p-4 rounded-xl border-2 border-stone-200 font-bold text-stone-600 hover:bg-stone-50 transition-all hover:scale-[1.02]">
                                <ArrowLeft size={20} className="mr-2" /> Terug
                            </button>
                            <button onClick={handleNext} className="flex-grow bg-primary text-white font-bold p-4 rounded-xl hover:bg-primary/90 transition-all shadow-xl hover:shadow-primary/30 flex items-center justify-center hover:scale-[1.02]">
                                {photos.length > 0 ? "Doorgaan" : "Overslaan en doorgaan"} <ArrowRight size={20} className="ml-2" />
                            </button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-5 animate-in slide-in-from-right-8 fade-in duration-300">
                        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm flex gap-3 items-center border border-red-100 animate-in fade-in"><AlertCircle size={20} /> {error}</div>}

                        <div className="grid md:grid-cols-2 gap-5">
                            <div className="relative group">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-primary transition-colors" size={22} />
                                <input className="w-full pl-14 p-5 border-2 border-stone-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all bg-stone-50 focus:bg-white text-lg" placeholder="Uw Naam" value={formData.naam} onChange={e => setFormData({ ...formData, naam: e.target.value })} />
                            </div>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-primary transition-colors" size={22} />
                                <input className="w-full pl-14 p-5 border-2 border-stone-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all bg-stone-50 focus:bg-white text-lg" placeholder="Emailadres" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                        </div>
                        <div className="relative group">
                            <Building className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-primary transition-colors" size={22} />
                            <input className="w-full pl-14 p-5 border-2 border-stone-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all bg-stone-50 focus:bg-white text-lg" placeholder="Bedrijfsnaam (Optioneel)" value={formData.bedrijfsnaam} onChange={e => setFormData({ ...formData, bedrijfsnaam: e.target.value })} />
                        </div>
                        <div className="relative group">
                            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-primary transition-colors" size={22} />
                            <input className="w-full pl-14 p-5 border-2 border-stone-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all bg-stone-50 focus:bg-white text-lg" placeholder="Telefoonnummer (Optioneel)" value={formData.telefoon} onChange={e => setFormData({ ...formData, telefoon: e.target.value })} />
                        </div>
                        <div className="relative group">
                            <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-primary transition-colors" size={22} />
                            <input className="w-full pl-14 p-5 border-2 border-stone-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all bg-stone-50 focus:bg-white text-lg" placeholder="Adres + Huisnummer, Plaats" value={formData.adres} onChange={e => setFormData({ ...formData, adres: e.target.value })} />
                        </div>
                        <textarea className="w-full p-5 border-2 border-stone-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all bg-stone-50 focus:bg-white text-lg min-h-[120px]" placeholder="Heeft u nog opmerkingen of specifieke vragen?" value={formData.toelichting} onChange={e => setFormData({ ...formData, toelichting: e.target.value })} />

                        <label className="flex items-center gap-4 py-3 cursor-pointer group">
                            <div className="relative flex items-center">
                                <input type="checkbox" checked={hasAcceptedTerms} onChange={e => setHasAcceptedTerms(e.target.checked)} className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-stone-300 transition-all checked:border-primary checked:bg-primary group-hover:border-primary/50" />
                                <Check size={16} strokeWidth={4} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" />
                            </div>
                            <span className="text-stone-600 text-sm md:text-base">Ik ga akkoord met de <Link to="/algemene-voorwaarden" className="text-primary font-bold hover:underline">algemene voorwaarden</Link></span>
                        </label>

                        <div className="flex gap-4 pt-4">
                            <button onClick={handleBack} className="w-1/3 flex items-center justify-center p-4 rounded-xl border-2 border-stone-200 font-bold text-stone-600 hover:bg-stone-50 transition-all hover:scale-[1.02]">
                                <ArrowLeft size={20} className="mr-2" /> Terug
                            </button>
                            <button onClick={handleSubmit} disabled={isSubmitting || !hasAcceptedTerms} className="flex-grow bg-primary text-white font-bold text-lg p-4 rounded-xl hover:bg-primary/90 transition-all shadow-xl hover:shadow-primary/30 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]">
                                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Verstuur Aanvraag'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdCalculatorForm;
