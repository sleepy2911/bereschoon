# Bereschoon Website

Een moderne website voor Bereschoon met geïntegreerde webshop, gebouwd met React, Vite, en Supabase.

## Features

- 🏠 Homepage met diensten overzicht
- 🛒 Volledig functionerende webshop
- 💳 Mollie betalingen (iDEAL, Bancontact, creditcard, PayPal)
- 👤 Gebruikersaccounts met bestelgeschiedenis
- 📦 Admin panel voor producten en orders beheer
- 🚚 Automatische verzendkosten berekening (Benelux)

## Technologie Stack

- **Frontend**: React 19, Vite, TailwindCSS, Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions, Storage)
- **Betalingen**: Mollie

## Installatie

```bash
# Installeer dependencies
npm install

# Kopieer environment variables
cp .env.example .env

# Vul de .env in met je Supabase credentials
```

## Environment Variables

Maak een `.env` bestand aan met:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Supabase Setup

### 1. Database Migraties

Push de database migraties naar je Supabase project:

```bash
npx supabase db push
```

### 2. Edge Functions Secrets

Stel de volgende secrets in via het Supabase Dashboard → Settings → Edge Functions:

- `MOLLIE_API_KEY`: Je Mollie API key (live of test)
- `SITE_URL`: Je website URL (bijv. `https://bereschoon.nl`)

### 3. Admin Gebruiker

Om een admin gebruiker aan te maken, voer het volgende SQL uit in de Supabase SQL Editor:

```sql
-- Vervang 'USER_UUID' met de UUID van de gebruiker die admin moet worden
INSERT INTO admin_users (user_id, role) 
VALUES ('USER_UUID', 'admin');
```

## Development

```bash
# Start de development server
npm run dev

# Build voor productie
npm run build

# Preview productie build
npm run preview
```

## Webshop Routes

| Route | Beschrijving |
|-------|-------------|
| `/winkel` | Producten overzicht |
| `/winkel/product/:slug` | Product detail pagina |
| `/winkel/checkout` | Afrekenen |
| `/winkel/betaling-succes` | Betaling gelukt |
| `/winkel/betaling-mislukt` | Betaling mislukt |
| `/winkel/account` | Inloggen / Account dashboard |
| `/winkel/account/bestellingen` | Bestelgeschiedenis |
| `/winkel/account/instellingen` | Account instellingen |
| `/winkel/admin` | Admin panel (alleen admins) |

## Mollie Webhook

De webhook URL voor Mollie is:
```
https://your-project.supabase.co/functions/v1/mollie-webhook
```

Configureer deze in je Mollie Dashboard onder Website Profiles → Payment Methods.

## Verzendkosten

| Land | Kosten | Gratis vanaf |
|------|--------|--------------|
| Nederland | €4,95 | €50 |
| België | €5,95 | €50 |
| Luxemburg | €6,95 | €50 |

## Database Schema

### Tabellen

- `products` - Producten met prijs, voorraad, afbeeldingen
- `orders` - Bestellingen
- `order_items` - Bestelregels
- `profiles` - Uitgebreide gebruikersprofielen
- `admin_users` - Admin toegang
- `shipping_settings` - Verzendkosten per land

## Licentie

Privé project voor Bereschoon.
