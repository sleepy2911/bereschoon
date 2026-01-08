import React, { useState, useEffect } from 'react';
import { Star, Loader2 } from 'lucide-react';

// Fallback reviews als Google Reviews niet beschikbaar zijn
const fallbackReviews = [
    {
        name: 'Jan de Vries',
        role: 'VVE Beheerder',
        text: 'Bereschoon heeft ons appartementencomplex weer als nieuw gemaakt. De communicatie verliep soepel en het resultaat is verbluffend.',
        stars: 5,
    },
    {
        name: 'Sarah van den Berg',
        role: 'Huiseigenaar',
        text: 'Super service! Ze kwamen op tijd, werkten netjes en mijn dak ziet er weer fantastisch uit. Zeker een aanrader.',
        stars: 5,
    },
    {
        name: 'Pieter Janssen',
        role: 'Projectontwikkelaar',
        text: 'Voor onze nieuwbouwprojecten werken wij graag samen met Bereschoon. Kwaliteit staat bij hen altijd op nummer één.',
        stars: 5,
    },
];

// Functie om Google Reviews op te halen via Firebase Cloud Function
const fetchGoogleReviews = async () => {
    try {
        // Firebase Cloud Function URL
        // Vervang met je eigen Firebase project URL na deployment
        // Format: https://[region]-[project-id].cloudfunctions.net/getReviews
        const firebaseFunctionUrl = import.meta.env.VITE_FIREBASE_FUNCTION_URL || 
            'https://us-central1-bereschoon.cloudfunctions.net/getReviews';
        
        const response = await fetch(firebaseFunctionUrl);
        
        if (!response.ok) {
            throw new Error('Failed to fetch reviews');
        }
        
        const data = await response.json();
        
        // Transformeer Google Reviews data naar ons format
        if (data.reviews && Array.isArray(data.reviews)) {
            return data.reviews.map((review) => ({
                name: review.author_name || 'Anonieme klant',
                role: '', // Google Reviews heeft geen "role" veld
                text: review.text || '',
                stars: review.rating || 5,
                date: review.time || null,
                profilePhoto: review.profile_photo_url || null,
            })).slice(0, 6); // Maximaal 6 reviews
        }
        
        return null;
    } catch (error) {
        console.error('Error fetching Google Reviews:', error);
        return null;
    }
};

const Reviews = () => {
    const [reviews, setReviews] = useState(fallbackReviews);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadReviews = async () => {
            setIsLoading(true);
            const googleReviews = await fetchGoogleReviews();
            
            if (googleReviews && googleReviews.length > 0) {
                setReviews(googleReviews);
            } else {
                // Gebruik fallback reviews als Google Reviews niet beschikbaar zijn
                setReviews(fallbackReviews);
            }
            
            setIsLoading(false);
        };

        loadReviews();
    }, []);

    return (
        <section className="py-24 bg-muted/50 border-t border-b border-gray-100">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold text-center mb-16 tracking-tight">Wat onze klanten zeggen</h2>

                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="animate-spin text-primary" size={32} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {reviews.map((review, index) => (
                            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center">
                                <div className="flex space-x-1 mb-6 text-yellow-400">
                                    {[...Array(Math.floor(review.stars))].map((_, i) => (
                                        <Star key={i} size={20} fill="currentColor" />
                                    ))}
                                </div>
                                <p className="text-muted-foreground italic mb-6 leading-relaxed">"{review.text}"</p>
                                <div>
                                    <h4 className="font-bold text-foreground">{review.name}</h4>
                                    {review.role && (
                                        <span className="text-sm text-muted-foreground">{review.role}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Reviews;
