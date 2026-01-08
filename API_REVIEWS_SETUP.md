# Google Reviews API Setup

De Reviews component haalt automatisch Google Reviews op via een backend endpoint. Hieronder staat hoe je dit kunt instellen.

## Backend Endpoint Setup

Je hebt een backend endpoint nodig die de Google Places API aanroept. Hier is een voorbeeld implementatie:

### Node.js/Express Voorbeeld

```javascript
// server.js of api/reviews.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/api/reviews', async (req, res) => {
    try {
        // Vervang met je Google Places API key
        const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
        
        // Vervang met je Google Place ID (vind je in Google My Business)
        const PLACE_ID = 'YOUR_PLACE_ID';
        
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews&key=${API_KEY}`
        );
        
        if (response.data.status === 'OK' && response.data.result.reviews) {
            res.json({
                reviews: response.data.result.reviews
            });
        } else {
            res.status(500).json({ error: 'Failed to fetch reviews' });
        }
    } catch (error) {
        console.error('Error fetching Google Reviews:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
```

### Python/Flask Voorbeeld

```python
# app.py
from flask import Flask, jsonify
import requests
import os

app = Flask(__name__)

@app.route('/api/reviews')
def get_reviews():
    API_KEY = os.environ.get('GOOGLE_PLACES_API_KEY')
    PLACE_ID = os.environ.get('GOOGLE_PLACE_ID')
    
    url = f'https://maps.googleapis.com/maps/api/place/details/json?place_id={PLACE_ID}&fields=reviews&key={API_KEY}'
    
    response = requests.get(url)
    data = response.json()
    
    if data.get('status') == 'OK' and 'reviews' in data.get('result', {}):
        return jsonify({'reviews': data['result']['reviews']})
    else:
        return jsonify({'error': 'Failed to fetch reviews'}), 500
```

## Environment Variables

Maak een `.env` bestand aan in je project root:

```env
VITE_REVIEWS_API_URL=http://localhost:3000/api/reviews
```

Of stel de backend URL in via environment variables in je deployment.

## Google Places API Setup

1. Ga naar [Google Cloud Console](https://console.cloud.google.com/)
2. Maak een nieuw project aan of selecteer een bestaand project
3. Activeer de "Places API" voor je project
4. Maak een API key aan in "Credentials"
5. Beperk de API key tot alleen de Places API voor veiligheid

## Google Place ID vinden

1. Ga naar [Google Maps](https://www.google.com/maps)
2. Zoek je bedrijf
3. Klik op je bedrijf en scroll naar beneden
4. Je Place ID staat in de URL of in de bedrijfsdetails

## Fallback

Als de API niet beschikbaar is of faalt, worden automatisch de fallback reviews getoond die in de component staan.

## CORS

Zorg ervoor dat je backend CORS headers heeft ingesteld om requests van je frontend toe te staan:

```javascript
// Express.js
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:5173' // of je production URL
}));
```

