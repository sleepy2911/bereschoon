# Firebase Setup voor Bereschoon

Deze gids helpt je bij het opzetten van Firebase Cloud Functions voor het ophalen van Google Reviews.

## Stap 1: Firebase Project Aanmaken

1. Ga naar [Firebase Console](https://console.firebase.google.com/)
2. Klik op "Add project" of selecteer een bestaand project
3. Volg de wizard om je project aan te maken
4. Noteer je Project ID

## Stap 2: Firebase CLI Login

Open een terminal en log in bij Firebase:

```bash
firebase login
```

Volg de instructies in de browser om in te loggen.

## Stap 3: Firebase Project Koppelen

Koppel je lokale project aan je Firebase project:

```bash
firebase use --add
```

Selecteer je project uit de lijst.

## Stap 4: Cloud Functions Dependencies Installeren

Installeer de dependencies voor Cloud Functions:

```bash
cd functions
npm install
cd ..
```

## Stap 5: Google Places API Configureren

### 5.1 Google Cloud Console Setup

1. Ga naar [Google Cloud Console](https://console.cloud.google.com/)
2. Selecteer je Firebase project (of maak een nieuw project aan)
3. Ga naar "APIs & Services" > "Library"
4. Zoek naar "Places API" en activeer deze
5. Ga naar "APIs & Services" > "Credentials"
6. Maak een nieuwe API key aan of gebruik een bestaande
7. Beperk de API key tot alleen de Places API voor veiligheid

### 5.2 Google Place ID Vinden

1. Ga naar [Google Maps](https://www.google.com/maps)
2. Zoek je bedrijf "Bereschoon"
3. Klik op je bedrijf
4. Scroll naar beneden in de bedrijfsdetails
5. Je Place ID staat in de URL of in de bedrijfsdetails
   - Of gebruik deze tool: https://developers.google.com/maps/documentation/places/web-service/place-id

## Stap 6: Firebase Functions Configureren

Stel de Google Places API key en Place ID in als Firebase Functions config:

```bash
firebase functions:config:set google.places_api_key="YOUR_API_KEY"
firebase functions:config:set google.place_id="YOUR_PLACE_ID"
```

Vervang `YOUR_API_KEY` en `YOUR_PLACE_ID` met je eigen waarden.

## Stap 7: Cloud Functions Lokaal Testen (Optioneel)

Test je functions lokaal met de Firebase Emulator:

```bash
cd functions
npm run serve
```

Dit start de emulator op `http://localhost:5001`

## Stap 8: Cloud Functions Deployen

Deploy je functions naar Firebase:

```bash
firebase deploy --only functions
```

Na deployment krijg je een URL zoals:
`https://us-central1-bereschoon.cloudfunctions.net/getReviews`

## Stap 9: Frontend Configureren

Voeg de Firebase Function URL toe aan je `.env` bestand:

```env
VITE_FIREBASE_FUNCTION_URL=https://us-central1-bereschoon.cloudfunctions.net/getReviews
```

Vervang de URL met je eigen deployed function URL.

## Stap 10: Testen

Start je development server:

```bash
npm run dev
```

Ga naar de Reviews pagina en controleer of de Google Reviews worden opgehaald.

## Troubleshooting

### Function geeft een error terug

- Controleer of de Google Places API key correct is ingesteld
- Controleer of de Place ID correct is
- Bekijk de logs: `firebase functions:log`

### CORS Errors

De Cloud Function heeft CORS al geconfigureerd. Als je nog steeds CORS errors krijgt:
- Controleer of je de juiste origin gebruikt
- Controleer of de function correct is gedeployed

### Reviews worden niet getoond

- Controleer de browser console voor errors
- Controleer of de Firebase Function URL correct is in `.env`
- Controleer of de function correct is gedeployed
- Fallback reviews worden getoond als de API niet beschikbaar is

## Firebase Hosting (Optioneel)

Je kunt ook je frontend hosten op Firebase Hosting:

```bash
npm run build
firebase deploy --only hosting
```

## Kosten

- Firebase Cloud Functions: Gratis tier (2 miljoen invocations/maand)
- Google Places API: Betaald (zie [pricing](https://developers.google.com/maps/billing-and-pricing/pricing))

## Veiligheid

- **Belangrijk**: Zet je Google Places API key nooit in de frontend code
- Gebruik altijd Firebase Functions als proxy
- Beperk je API key in Google Cloud Console
- Gebruik environment variables voor gevoelige data

