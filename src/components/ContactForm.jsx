import React, { useState, useRef } from 'react';
import { ArrowRight, ArrowLeft, Check, Loader2, Mail, Grid3X3, Home, Droplets, Leaf, Upload, X, Camera } from 'lucide-react';

const ContactForm = () => {
    const [step, setStep] = useState(1);
    const [selectedService, setSelectedService] = useState('');
    const [selectedOptions, setSelectedOptions] = useState([]); // For multi-select options
    const [selectedPlan, setSelectedPlan] = useState(''); // For onkruidbeheersing plan
    const [photos, setPhotos] = useState([]);
    const [photoPreviews, setPhotoPreviews] = useState([]);
    const [formData, setFormData] = useState({
        vierkanteMeters: '',
        naam: '',
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
    const fileInputRef = useRef(null);

    const services = [
        { id: 'oprit-terras-terrein', label: 'Oprit, Terras of Terreinreiniging', icon: Grid3X3, category: 'oprit-terras-terrein' },
        { id: 'gevelreiniging', label: 'Gevelreiniging', icon: Home, category: 'gevelreiniging' },
        { id: 'onkruidbeheersing', label: 'Onkruidbeheersing', icon: Leaf, category: 'onkruidbeheersing' }
    ];

    const opritTerrasTerreinOptions = [
        { id: 'invegen', label: 'Invegen' },
        { id: 'preventieve-onkruid', label: 'Preventieve onkruid behandeling' },
        { id: 'beschermlaag', label: 'Nieuwe beschermlaag toepassen' }
    ];

    const gevelOptions = [
        { id: 'gevelimpregnatie', label: 'Gevelimpregnatie' },
        { id: 'gevelreiniging-optie', label: 'Gevelreiniging' }
    ];

    const onkruidPlannen = [
        { id: '4-weken', label: 'Plan per 4 weken' },
        { id: '8-weken', label: 'Plan per 8 weken' },
        { id: '12-weken', label: 'Plan per 12 weken' },
        { id: '16-weken', label: 'Plan per 16 weken' }
    ];

    const handleServiceSelect = (serviceId) => {
        setSelectedService(serviceId);
        setSelectedOptions([]);
        setSelectedPlan('');
        setStep(2);
    };

    const handleOptionToggle = (optionId) => {
        setSelectedOptions(prev => 
            prev.includes(optionId) 
                ? prev.filter(id => id !== optionId)
                : [...prev, optionId]
        );
    };

    const handlePlanSelect = (planId) => {
        setSelectedPlan(planId);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const isOpritTerrasTerreinCategory = (serviceId) => {
        return serviceId === 'oprit-terras-terrein';
    };

    const canProceedToNextStep = () => {
        if (step === 1) return selectedService !== '';
        if (step === 2) {
            if (selectedService === 'onkruidbeheersing') {
                return selectedPlan !== '';
            } else {
                return selectedOptions.length > 0;
            }
        }
        if (step === 3) return true; // Optional step, always can proceed
        return false;
    };

    const getStep2Title = () => {
        if (selectedService === 'onkruidbeheersing') {
            return 'Kies een plan';
        } else if (selectedService === 'gevelreiniging') {
            return 'Welke gevelbehandeling(en) heeft u nodig?';
        } else if (isOpritTerrasTerreinCategory(selectedService)) {
            return 'Welke dienst(en) heeft u nodig?';
        }
        return 'Welke dienst(en) heeft u nodig?';
    };

    const handleNext = () => {
        if (step === 1 && selectedService) {
            setStep(2);
        } else if (step === 2) {
            if (canProceedToNextStep()) {
                setStep(3);
            }
        } else if (step === 3) {
            setStep(4); // Go to photo upload
        } else if (step === 4) {
            setStep(5); // Go to contact form
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleSkip = () => {
        if (step === 3) {
            setStep(4); // Skip to photo upload (or contact if we skip photos too)
        } else if (step === 4) {
            setStep(5); // Skip photo upload, go to contact form
        }
    };

    const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const newPhotos = [...photos];
        const newPreviews = [...photoPreviews];

        files.forEach((file) => {
            if (file.type.startsWith('image/')) {
                newPhotos.push(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    newPreviews.push(reader.result);
                    setPhotoPreviews([...newPreviews]);
                };
                reader.readAsDataURL(file);
            }
        });

        setPhotos(newPhotos);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRemovePhoto = (index) => {
        const newPhotos = photos.filter((_, i) => i !== index);
        const newPreviews = photoPreviews.filter((_, i) => i !== index);
        setPhotos(newPhotos);
        setPhotoPreviews(newPreviews);
    };

    // Parse address string into components (simple parsing)
    const parseAddress = (address) => {
        if (!address) return { street: null, postcode: null, city: null };
        
        // Try to extract postcode (Dutch format: 1234AB)
        const postcodeMatch = address.match(/\b\d{4}\s?[A-Z]{2}\b/i);
        let postcode = postcodeMatch ? postcodeMatch[0].replace(/\s/g, '').toUpperCase() : null;
        
        // Remove postcode from address
        let remaining = address.replace(/\b\d{4}\s?[A-Z]{2}\b/i, '').trim();
        
        // Try to split on comma (format: "street, city")
        const parts = remaining.split(',').map(p => p.trim());
        let street = parts[0] || null;
        let city = parts.length > 1 ? parts[parts.length - 1] : null;

        // If no comma and no postcode, assume everything is street
        if (!city && !postcode) {
            street = remaining || address;
        }

        return {
            street: street || null,
            postcode: postcode || null,
            city: city || null
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // Construct the URL directly to ensure we use the correct function
            const baseUrl = import.meta.env.VITE_SUPABASE_URL;
            if (!baseUrl) {
                throw new Error('VITE_SUPABASE_URL is not configured');
            }
            
            // Explicitly use submit-service-request function
            const edgeFunctionUrl = `${baseUrl}/functions/v1/submit-service-request`;

            // Parse address
            const addressParts = parseAddress(formData.adres);

            // Create FormData
            const formDataToSend = new FormData();
            formDataToSend.append('service_type', selectedService);
            formDataToSend.append('name', formData.naam);
            formDataToSend.append('email', formData.email);
            if (formData.telefoon) formDataToSend.append('phone', formData.telefoon);
            if (addressParts.street) formDataToSend.append('street_address', addressParts.street);
            if (addressParts.postcode) formDataToSend.append('postcode', addressParts.postcode);
            if (addressParts.city) formDataToSend.append('city', addressParts.city);
            if (formData.toelichting) formDataToSend.append('message', formData.toelichting);
            if (formData.vierkanteMeters) formDataToSend.append('square_meters', formData.vierkanteMeters);
            
            // Add service options
            if (selectedOptions.length > 0) {
                formDataToSend.append('service_options', JSON.stringify(selectedOptions));
            }
            if (selectedPlan) {
                formDataToSend.append('service_plan', selectedPlan);
            }

            // Add photos
            photos.forEach((photo, index) => {
                formDataToSend.append(`photo_${index}`, photo);
            });

            console.log('Submitting service request:', {
                serviceType: selectedService,
                name: formData.naam,
                email: formData.email,
                photoCount: photos.length
            });

            const response = await fetch(edgeFunctionUrl, {
                method: 'POST',
                headers: {
                    'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || ''
                },
                body: formDataToSend
            });

            const responseData = await response.json().catch(() => ({ error: 'Kon response niet lezen' }));
            
            if (!response.ok) {
                console.error('Server error response:', responseData);
                // Show detailed error including logs
                let errorMessage = responseData.error || 'Onbekende fout';
                if (responseData.message) errorMessage += `: ${responseData.message}`;
                if (responseData.code) errorMessage += ` (code: ${responseData.code})`;
                if (responseData.details) errorMessage += ` - ${responseData.details}`;
                if (responseData.hint) errorMessage += ` [Hint: ${responseData.hint}]`;
                
                // Log the full details including server logs
                if (responseData.logs) {
                    console.log('=== Server Logs ===');
                    responseData.logs.forEach(log => console.log(log));
                    console.log('=== End Server Logs ===');
                }
                
                throw new Error(errorMessage);
            }

            console.log('Service request submitted successfully:', responseData);
            if (responseData.logs) {
                console.log('=== Server Logs ===');
                responseData.logs.forEach(log => console.log(log));
            }
            setIsSubmitted(true);
        } catch (err) {
            console.error('Error submitting form:', err);
            setError(err instanceof Error ? err.message : 'Er is een fout opgetreden bij het verzenden');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="text-primary" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Aanvraag Verzonden!</h3>
                <p className="text-muted-foreground mb-6">
                    Bedankt voor uw aanvraag. We nemen zo snel mogelijk contact met u op om een offerte op te stellen.
                </p>
                <button
                    onClick={() => {
                        setIsSubmitted(false);
                        setStep(1);
                        setSelectedService('');
                        setSelectedOptions([]);
                        setSelectedPlan('');
                        setPhotos([]);
                        setPhotoPreviews([]);
                        setFormData({
                            vierkanteMeters: '',
                            naam: '',
                            email: '',
                            telefoon: '',
                            adres: '',
                            postcode: '',
                            city: '',
                            toelichting: ''
                        });
                        setError(null);
                        if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                        }
                    }}
                    className="text-primary hover:underline font-medium"
                >
                    Nieuwe aanvraag starten
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-foreground mb-2">Keuzehulp</h2>
            <p className="text-muted-foreground mb-6">Stap {step} van 5</p>

            {/* Progress Bar */}
            <div className="flex space-x-2 mb-8">
                {[1, 2, 3, 4, 5].map((s) => (
                    <div
                        key={s}
                        className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                            s <= step ? 'bg-primary' : 'bg-gray-200'
                        }`}
                    />
                ))}
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {/* Step 1: Service Selection */}
            {step === 1 && (
                <div className="animate-in slide-in-from-right-8 duration-500">
                    <h3 className="text-2xl font-bold text-foreground mb-6">Welke dienst heeft u nodig?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {services.map((service) => {
                            const Icon = service.icon;
                            return (
                                <button
                                    key={service.id}
                                    onClick={() => handleServiceSelect(service.id)}
                                    className={`p-6 border-2 rounded-xl text-left transition-all hover:scale-105 ${
                                        selectedService === service.id
                                            ? 'border-primary bg-primary/5 shadow-lg'
                                            : 'border-gray-200 hover:border-primary/50'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <Icon className={`${selectedService === service.id ? 'text-primary' : 'text-gray-400'}`} size={32} />
                                        {selectedService === service.id && (
                                            <Check className="text-primary" size={24} />
                                        )}
                                    </div>
                                    <h4 className="text-lg font-bold text-foreground">{service.label}</h4>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Step 2: Options/Plan Selection */}
            {step === 2 && (
                <div className="animate-in slide-in-from-right-8 duration-500">
                    <h3 className="text-2xl font-bold text-foreground mb-6">{getStep2Title()}</h3>
                    
                    {selectedService === 'onkruidbeheersing' ? (
                        <div className="space-y-3">
                            {onkruidPlannen.map((plan) => (
                                <button
                                    key={plan.id}
                                    onClick={() => handlePlanSelect(plan.id)}
                                    className={`w-full p-5 border-2 rounded-xl text-left transition-all ${
                                        selectedPlan === plan.id
                                            ? 'border-primary bg-primary/5 shadow-lg'
                                            : 'border-gray-200 hover:border-primary/50'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-foreground">{plan.label}</span>
                                        {selectedPlan === plan.id && (
                                            <Check className="text-primary" size={20} />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : selectedService === 'gevelreiniging' ? (
                        <div className="space-y-3">
                            {gevelOptions.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => handleOptionToggle(option.id)}
                                    className={`w-full p-5 border-2 rounded-xl text-left transition-all ${
                                        selectedOptions.includes(option.id)
                                            ? 'border-primary bg-primary/5 shadow-lg'
                                            : 'border-gray-200 hover:border-primary/50'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-foreground">{option.label}</span>
                                        {selectedOptions.includes(option.id) && (
                                            <Check className="text-primary" size={20} />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : isOpritTerrasTerreinCategory(selectedService) ? (
                        <div className="space-y-3">
                            {opritTerrasTerreinOptions.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => handleOptionToggle(option.id)}
                                    className={`w-full p-5 border-2 rounded-xl text-left transition-all ${
                                        selectedOptions.includes(option.id)
                                            ? 'border-primary bg-primary/5 shadow-lg'
                                            : 'border-gray-200 hover:border-primary/50'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-foreground">{option.label}</span>
                                        {selectedOptions.includes(option.id) && (
                                            <Check className="text-primary" size={20} />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : null}

                    <div className="flex gap-4 mt-8">
                        <button
                            onClick={handleBack}
                            className="flex items-center px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-all"
                        >
                            <ArrowLeft className="mr-2" size={20} />
                            Terug
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={!canProceedToNextStep()}
                            className="flex-1 flex items-center justify-center bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Volgende
                            <ArrowRight className="ml-2" size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Square Meters */}
            {step === 3 && (
                <div className="animate-in slide-in-from-right-8 duration-500">
                    <h3 className="text-2xl font-bold text-foreground mb-2">Geschatte vierkante meters</h3>
                    <p className="text-muted-foreground mb-6">Dit veld is optioneel. U kunt deze stap overslaan.</p>
                    
                    <div className="mb-8">
                        <label htmlFor="vierkanteMeters" className="block text-sm font-medium text-foreground mb-2">
                            Vierkante meters
                        </label>
                        <input
                            type="number"
                            id="vierkanteMeters"
                            name="vierkanteMeters"
                            value={formData.vierkanteMeters}
                            onChange={handleInputChange}
                            placeholder="bijv. 50"
                            min="0"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={handleBack}
                            className="flex items-center px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-all"
                        >
                            <ArrowLeft className="mr-2" size={20} />
                            Terug
                        </button>
                        <button
                            type="button"
                            onClick={handleSkip}
                            className="flex items-center px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-all"
                        >
                            Overslaan
                        </button>
                        <button
                            type="button"
                            onClick={handleNext}
                            className="flex-1 flex items-center justify-center bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-all"
                        >
                            Volgende
                            <ArrowRight className="ml-2" size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* Step 4: Photo Upload */}
            {step === 4 && (
                <div className="animate-in slide-in-from-right-8 duration-500">
                    <h3 className="text-2xl font-bold text-foreground mb-2">Foto's toevoegen</h3>
                    <p className="text-muted-foreground mb-6">U kunt meerdere foto's uploaden (optioneel). U kunt deze stap overslaan.</p>
                    
                    <div className="mb-6">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handlePhotoUpload}
                            className="hidden"
                        />
                        
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary hover:bg-primary/5 transition-all cursor-pointer"
                        >
                            <Upload className="mx-auto mb-3 text-gray-400" size={32} />
                            <p className="text-sm font-medium text-foreground mb-1">Klik om foto's te uploaden</p>
                            <p className="text-xs text-muted-foreground">of sleep bestanden hierheen</p>
                        </button>

                        {photoPreviews.length > 0 && (
                            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                                {photoPreviews.map((preview, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemovePhoto(index)}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={handleBack}
                            className="flex items-center px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-all"
                        >
                            <ArrowLeft className="mr-2" size={20} />
                            Terug
                        </button>
                        <button
                            type="button"
                            onClick={handleSkip}
                            className="flex items-center px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-all"
                        >
                            Overslaan
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep(5)}
                            className="flex-1 flex items-center justify-center bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-all"
                        >
                            Volgende
                            <ArrowRight className="ml-2" size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* Step 5: Contact Information */}
            {step === 5 && (
                <form onSubmit={handleSubmit} className="animate-in slide-in-from-right-8 duration-500">
                    <h3 className="text-2xl font-bold text-foreground mb-6">Uw contactgegevens</h3>
                    
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="naam" className="block text-sm font-medium text-foreground mb-2">
                                Naam <span className="text-primary">*</span>
                            </label>
                            <input
                                type="text"
                                id="naam"
                                name="naam"
                                required
                                value={formData.naam}
                                onChange={handleInputChange}
                                placeholder="Volledige naam"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                                E-mailadres <span className="text-primary">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="uw@email.nl"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label htmlFor="telefoon" className="block text-sm font-medium text-foreground mb-2">
                                Telefoonnummer <span className="text-gray-400 text-sm">(optioneel)</span>
                            </label>
                            <input
                                type="tel"
                                id="telefoon"
                                name="telefoon"
                                value={formData.telefoon}
                                onChange={handleInputChange}
                                placeholder="+31 6 12345678"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label htmlFor="adres" className="block text-sm font-medium text-foreground mb-2">
                                Adres <span className="text-gray-400 text-sm">(optioneel)</span>
                            </label>
                            <input
                                type="text"
                                id="adres"
                                name="adres"
                                value={formData.adres}
                                onChange={handleInputChange}
                                placeholder="Straatnaam + huisnummer, plaats"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label htmlFor="toelichting" className="block text-sm font-medium text-foreground mb-2">
                                Toelichting <span className="text-gray-400 text-sm">(optioneel)</span>
                            </label>
                            <textarea
                                id="toelichting"
                                name="toelichting"
                                rows={4}
                                value={formData.toelichting}
                                onChange={handleInputChange}
                                placeholder="Heeft u aanvullende vragen of opmerkingen?"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 mt-8">
                        <button
                            type="button"
                            onClick={handleBack}
                            className="flex items-center px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-all"
                        >
                            <ArrowLeft className="mr-2" size={20} />
                            Terug
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 flex items-center justify-center bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" size={20} />
                                    Verzenden...
                                </>
                            ) : (
                                <>
                                    Verzenden
                                    <ArrowRight className="ml-2" size={20} />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ContactForm;
