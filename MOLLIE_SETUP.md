# Mollie Betalingen Setup Handleiding

Deze handleiding beschrijft stap voor stap hoe je Mollie betalingen configureert voor de Bereschoon webshop.

## Inhoudsopgave

1. [Mollie Account Aanmaken](#1-mollie-account-aanmaken)
2. [API Keys Ophalen](#2-api-keys-ophalen)
3. [Betaalmethoden Activeren](#3-betaalmethoden-activeren)
4. [Supabase Configuratie](#4-supabase-configuratie)
5. [Webhook Configureren](#5-webhook-configureren)
6. [Testen](#6-testen)
7. [Live Gaan](#7-live-gaan)

---

## 1. Mollie Account Aanmaken

1. Ga naar [https://www.mollie.com/nl](https://www.mollie.com/nl)
2. Klik op **Gratis aanmelden**
3. Vul je bedrijfsgegevens in:
   - Bedrijfsnaam: Bereschoon
   - KvK-nummer
   - BTW-nummer
   - Contactgegevens
4. Verifieer je e-mailadres
5. Voltooi de onboarding (kan 1-2 werkdagen duren voor verificatie)

---

## 2. API Keys Ophalen

### Test API Key (voor development)

1. Log in op [https://my.mollie.com](https://my.mollie.com)
2. Ga naar **Developers** → **API-sleutels**
3. Kopieer de **Test API key** (begint met `test_`)

### Live API Key (voor productie)

1. Nadat je account is geverifieerd, ga naar **Developers** → **API-sleutels**
2. Kopieer de **Live API key** (begint met `live_`)

> ⚠️ **Belangrijk**: Deel nooit je API keys. Bewaar ze veilig en voeg ze nooit toe aan Git.

---

## 3. Betaalmethoden Activeren

Ga naar **Instellingen** → **Websiteprofielen** → **Betaalmethoden**

### Aanbevolen betaalmethoden voor Nederland/Benelux:

| Methode | Status | Opmerkingen |
|---------|--------|-------------|
| **iDEAL** | Activeren | Meest populair in NL (60%+ van betalingen) |
| **Bancontact** | Activeren | Populair in België |
| **Creditcard** | Activeren | Visa, Mastercard, American Express |
| **PayPal** | Activeren | Optioneel, populair alternatief |
| **Apple Pay** | Activeren | Voor Apple gebruikers |
| **Google Pay** | Activeren | Voor Android gebruikers |
| **Klarna** | Optioneel | Achteraf betalen |

### Activeren:

1. Klik op de betaalmethode
2. Klik op **Activeren**
3. Volg eventuele extra verificatiestappen
4. Sommige methoden (zoals Klarna) vereisen extra goedkeuring

---

## 4. Supabase Configuratie

### 4.1 Edge Function Secrets Instellen

1. Ga naar je Supabase Dashboard: [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecteer je project (bereschoon)
3. Ga naar **Settings** → **Edge Functions**
4. Scroll naar **Function Secrets**
5. Voeg de volgende secrets toe:

| Secret Name | Value | Beschrijving |
|-------------|-------|--------------|
| `MOLLIE_API_KEY` | `test_xxxxxxxx` of `live_xxxxxxxx` | Je Mollie API key |
| `SITE_URL` | `https://bereschoon.nl` | Je website URL (zonder trailing slash) |

### 4.2 Secrets Toevoegen via CLI

Je kunt ook de CLI gebruiken:

```bash
# Test key
npx supabase secrets set MOLLIE_API_KEY=test_xxxxxxxxxxxxxxxxxxxxxxxx

# Site URL
npx supabase secrets set SITE_URL=https://bereschoon.nl
```

### 4.3 Edge Functions Deployen

```bash
# Deploy alle edge functions
npx supabase functions deploy create-payment
npx supabase functions deploy mollie-webhook
```

---

## 5. Webhook Configureren

De webhook zorgt ervoor dat Mollie je app informeert over betaalstatussen.

### 5.1 Webhook URL

Je webhook URL is:
```
https://[PROJECT_REF].supabase.co/functions/v1/mollie-webhook
```

Vervang `[PROJECT_REF]` met je Supabase project reference (te vinden in Settings → General).

Voorbeeld:
```
https://abcdefghijklmnop.supabase.co/functions/v1/mollie-webhook
```

### 5.2 Webhook Instellen in Mollie

1. Ga naar **Developers** → **Webhooks** in je Mollie Dashboard
2. Of configureer per websiteprofiel: **Instellingen** → **Websiteprofielen** → **[Jouw profiel]**
3. Vul de webhook URL in

> **Let op**: Voor lokaal testen heb je een tool zoals ngrok nodig om je lokale server bereikbaar te maken.

---

## 6. Testen

### 6.1 Test Modus

Zolang je de `test_` API key gebruikt, worden betalingen gesimuleerd.

### 6.2 Test Betaling Maken

1. Ga naar je webshop (`/winkel`)
2. Voeg een product toe aan je winkelmandje
3. Ga naar checkout
4. Vul je gegevens in en klik op **Betalen**
5. Je wordt doorgestuurd naar de Mollie test omgeving

### 6.3 Test Betaalstatussen

In de Mollie test omgeving kun je kiezen:
- **Betaald** → Simuleert succesvolle betaling
- **Geannuleerd** → Simuleert geannuleerde betaling
- **Verlopen** → Simuleert verlopen betaling
- **Mislukt** → Simuleert mislukte betaling

### 6.4 Controleren

Na een testbetaling:
1. Check de order status in je admin panel (`/winkel/admin/bestellingen`)
2. Check de Supabase database (orders tabel)
3. Check de Mollie dashboard voor de betaling

---

## 7. Live Gaan

### Checklist voor productie:

- [ ] Account volledig geverifieerd door Mollie
- [ ] Alle gewenste betaalmethoden geactiveerd
- [ ] `MOLLIE_API_KEY` secret gewijzigd naar `live_` key
- [ ] `SITE_URL` secret ingesteld op productie URL
- [ ] Webhook URL geconfigureerd in Mollie
- [ ] Edge functions opnieuw gedeployed
- [ ] Test betaling gedaan met echte (kleine) bedrag

### API Key Wijzigen

```bash
# Wijzig naar live key
npx supabase secrets set MOLLIE_API_KEY=live_xxxxxxxxxxxxxxxxxxxxxxxx

# Zorg dat SITE_URL correct is
npx supabase secrets set SITE_URL=https://bereschoon.nl
```

---

## Troubleshooting

### Betaling wordt niet aangemaakt

1. Check of `MOLLIE_API_KEY` correct is ingesteld
2. Check de Edge Function logs in Supabase Dashboard
3. Controleer of de API key actief is in Mollie

### Webhook wordt niet ontvangen

1. Controleer of de webhook URL correct is
2. Check of de `mollie-webhook` function is gedeployed
3. Bekijk de Function logs voor errors
4. Test de webhook URL met een tool zoals Postman

### Order status wordt niet bijgewerkt

1. Check de Edge Function logs
2. Controleer of de order_id correct in de metadata zit
3. Bekijk de Supabase logs

### Edge Function errors

Bekijk logs:
```bash
npx supabase functions logs create-payment
npx supabase functions logs mollie-webhook
```

---

## Nuttige Links

- [Mollie Dashboard](https://my.mollie.com)
- [Mollie API Documentatie](https://docs.mollie.com)
- [Mollie Test Modus](https://docs.mollie.com/overview/testing)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)

---

## Support

Bij problemen:
- Mollie Support: [help.mollie.com](https://help.mollie.com)
- Supabase Support: [supabase.com/support](https://supabase.com/support)

