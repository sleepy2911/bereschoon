const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
const cors = require('cors')({ origin: true });

admin.initializeApp();

/**
 * Google Reviews API endpoint
 * Haalt reviews op van Google Places API
 */
exports.getReviews = functions.https.onRequest((req, res) => {
    return cors(req, res, async () => {
        // Alleen GET requests toestaan
        if (req.method !== 'GET') {
            return res.status(405).json({ error: 'Method not allowed' });
        }

        try {
            // Haal configuratie op uit environment variables
            const API_KEY = functions.config().google?.places_api_key;
            const PLACE_ID = functions.config().google?.place_id;

            if (!API_KEY || !PLACE_ID) {
                console.error('Google Places API key of Place ID niet geconfigureerd');
                return res.status(500).json({
                    error: 'Google Places API niet geconfigureerd',
                    message: 'Contacteer de beheerder'
                });
            }

            // Google Places API aanroepen
            const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews,rating,user_ratings_total&key=${API_KEY}`;

            const response = await axios.get(url);

            if (response.data.status === 'OK' && response.data.result.reviews) {
                // Transformeer reviews naar gewenst format
                const reviews = response.data.result.reviews.map((review) => ({
                    author_name: review.author_name,
                    text: review.text,
                    rating: review.rating,
                    time: review.time,
                    profile_photo_url: review.profile_photo_url,
                    relative_time_description: review.relative_time_description
                }));

                return res.status(200).json({
                    reviews: reviews,
                    rating: response.data.result.rating,
                    total_ratings: response.data.result.user_ratings_total
                });
            } else {
                console.error('Google Places API error:', response.data.status);
                return res.status(500).json({
                    error: 'Kon reviews niet ophalen',
                    status: response.data.status
                });
            }
        } catch (error) {
            console.error('Error fetching Google Reviews:', error.message);
            return res.status(500).json({
                error: 'Interne server fout',
                message: error.message
            });
        }
    });
});

