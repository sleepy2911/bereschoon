/**
 * Voorbeeld backend server voor Google Reviews
 * 
 * Installatie:
 * npm install express axios cors dotenv
 * 
 * Gebruik:
 * node server-example.js
 * 
 * Zorg ervoor dat je een .env bestand hebt met:
 * GOOGLE_PLACES_API_KEY=your_api_key_here
 * GOOGLE_PLACE_ID=your_place_id_here
 * PORT=3000
 */

import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuratie - pas de origin aan naar je frontend URL
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());

// Reviews endpoint
app.get('/api/reviews', async (req, res) => {
    try {
        const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
        const PLACE_ID = process.env.GOOGLE_PLACE_ID;

        if (!API_KEY || !PLACE_ID) {
            return res.status(500).json({ 
                error: 'Google Places API key of Place ID niet geconfigureerd' 
            });
        }

        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews,rating,user_ratings_total&key=${API_KEY}`;

        const response = await axios.get(url);

        if (response.data.status === 'OK' && response.data.result.reviews) {
            // Transformeer de reviews naar het gewenste format
            const reviews = response.data.result.reviews.map((review) => ({
                author_name: review.author_name,
                text: review.text,
                rating: review.rating,
                time: review.time,
                profile_photo_url: review.profile_photo_url,
                relative_time_description: review.relative_time_description
            }));

            res.json({
                reviews: reviews,
                rating: response.data.result.rating,
                total_ratings: response.data.result.user_ratings_total
            });
        } else {
            console.error('Google Places API error:', response.data.status);
            res.status(500).json({ 
                error: 'Kon reviews niet ophalen',
                status: response.data.status 
            });
        }
    } catch (error) {
        console.error('Error fetching Google Reviews:', error.message);
        res.status(500).json({ 
            error: 'Interne server fout',
            message: error.message 
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Server draait op http://localhost:${PORT}`);
    console.log(`Reviews endpoint: http://localhost:${PORT}/api/reviews`);
});

