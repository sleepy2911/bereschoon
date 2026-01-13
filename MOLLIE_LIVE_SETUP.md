# 🚀 Mollie Live Productie Setup

## Stap 1: Mollie Dashboard - Live Profiel
1. Log in op [Mollie Dashboard](https://my.mollie.com)
2. Ga naar **Settings** → **Website profiles**
3. Maak een **LIVE profiel** aan (of gebruik bestaand)
4. Noteer je **LIVE API key** (begint met `live_`)

## Stap 2: Webhook URL Instellen in Mollie
1. In je **LIVE profiel** settings
2. Zet **Webhook URL** naar:
   ```
   https://ajzvywxgzmiwykvnrgsq.supabase.co/functions/v1/mollie-webhook
   ```
3. **Opslaan**

## Stap 3: Supabase Secrets Instellen

### Mollie LIVE API Key
```bash
npx supabase secrets set MOLLIE_API_KEY="live_jouw_key_hier"
```

### Productie Site URL
```bash
npx supabase secrets set SITE_URL="https://www.bereschoon.nl"
```
*(Pas aan naar jouw echte domein)*

### Controleren
```bash
npx supabase secrets list
```

## Stap 4: Testen
1. Doe een **kleine test bestelling** (€0,01 of €1,00)
2. Controleer in Supabase Dashboard → **Edge Functions** → **Logs**:
   - `create-payment` wordt aangeroepen
   - `mollie-webhook` ontvangt de callback
3. Controleer in **Mollie Dashboard** → **Payments**:
   - Betaling wordt geregistreerd
4. Controleer in **Supabase** → **orders** table:
   - Order status wordt bijgewerkt naar `confirmed`
   - Payment ID is ingevuld

## ✅ Klaar!
Na succesvolle test kun je live gaan met echte bestellingen.

---

## ⚠️ Belangrijk
- **HTTPS is verplicht** voor productie (Mollie accepteert geen HTTP)
- **Webhook URL moet exact kloppen** anders worden orders niet bijgewerkt
- **Test altijd eerst** met kleine bedragen voordat je live gaat

