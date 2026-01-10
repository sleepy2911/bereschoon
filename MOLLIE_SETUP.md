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

## 6. Testen met Nep Geld (Test Modus)

### 6.1 Test API Key Instellen

**Belangrijk**: Zorg dat je de **Test API Key** gebruikt (begint met `test_`), niet de Live key!

1. Log in op [https://my.mollie.com](https://my.mollie.com)
2. Ga naar **Developers** → **API-sleutels**
3. Kopieer de **Test API key** (begint met `test_`)
4. Stel deze in als Supabase secret:

```bash
npx supabase secrets set MOLLIE_API_KEY=test_xxxxxxxxxxxxxxxxxxxxxxxx
```

5. Zorg dat `SITE_URL` is ingesteld (voor lokale ontwikkeling):

```bash
# Voor lokale ontwikkeling
npx supabase secrets set SITE_URL=http://localhost:5173

# Of voor staging/productie
npx supabase secrets set SITE_URL=https://bereschoon.nl
```

6. Deploy de Edge Functions opnieuw:

```bash
npx supabase functions deploy create-payment
npx supabase functions deploy mollie-webhook
```

### 6.2 Volledige Test Flow

#### Stap 1: Product toevoegen aan winkelmandje

1. Ga naar `http://localhost:5173/winkel`
2. Klik op **"In Winkelmandje"** bij een product
3. Het winkelmandje opent automatisch

#### Stap 2: Naar checkout gaan

1. Klik op **"Winkelmandje"** rechtsboven (of gebruik de knop in het winkelmandje)
2. Klik op **"Afrekenen"** of ga direct naar `/winkel/checkout`

#### Stap 3: Gegevens invullen

Vul de checkout formulier in:
- **E-mail**: Gebruik een test e-mail (bijv. `test@example.com`)
- **Naam**: Test Naam
- **Adres**: Test adres (bijv. `Teststraat 1, 1234 AB Amsterdam`)
- **Land**: Selecteer Nederland, België of Luxemburg

> 💡 **Tip**: Je kunt ook eerst een account aanmaken via `/winkel/account` om je gegevens automatisch in te vullen.

#### Stap 4: Betalen

1. Klik op **"Betalen - €XX.XX"**
2. Je wordt doorgestuurd naar de **Mollie Test Omgeving**

### 6.3 Mollie Test Omgeving - Betaalstatussen Simuleren

In de Mollie test omgeving zie je verschillende opties om de betaling te simuleren:

#### ✅ Succesvolle Betaling (Betaald)

1. Kies **"Betaald"** of **"Paid"**
2. Je wordt doorgestuurd naar `/winkel/betaling-succes`
3. De order status wordt automatisch bijgewerkt naar `paid` via de webhook
4. Check in je admin panel of de order correct is opgeslagen

#### ❌ Geannuleerde Betaling

1. Kies **"Geannuleerd"** of **"Cancelled"**
2. Je wordt doorgestuurd naar `/winkel/betaling-mislukt`
3. De order blijft in status `pending` of wordt `cancelled`

#### ⏱️ Verlopen Betaling

1. Kies **"Verlopen"** of **"Expired"**
2. Je wordt doorgestuurd naar `/winkel/betaling-mislukt`
3. De order status wordt `failed`

#### ❌ Mislukte Betaling

1. Kies **"Mislukt"** of **"Failed"**
2. Je wordt doorgestuurd naar `/winkel/betaling-mislukt`
3. De order status wordt `failed`

### 6.4 Test Betaalmethoden

In test modus kun je alle betaalmethoden testen:

#### iDEAL Test

1. Kies **iDEAL** als betaalmethode
2. Selecteer een test bank (bijv. "Test Issuer")
3. Kies een betaalstatus (Betaald/Geannuleerd/etc.)
4. De betaling wordt gesimuleerd

#### Bancontact Test

1. Kies **Bancontact** als betaalmethode
2. Volg de test flow
3. Kies een betaalstatus

#### Creditcard Test

1. Kies **Creditcard** als betaalmethode
2. Gebruik test creditcard nummers:
   - **Visa**: `4111111111111111`
   - **Mastercard**: `5555555555554444`
   - **American Express**: `378282246310005`
3. Gebruik een willekeurige toekomstige vervaldatum (bijv. `12/25`)
4. Gebruik een willekeurige CVC (bijv. `123`)
5. Kies een betaalstatus

> 📚 **Meer test nummers**: Zie [Mollie Test Cards](https://docs.mollie.com/overview/testing#test-card-numbers)

### 6.5 Controleren of Alles Werkt

#### Check 1: Order in Database

1. Ga naar je Supabase Dashboard
2. Open de **Table Editor**
3. Bekijk de `orders` tabel
4. Controleer:
   - ✅ Order is aangemaakt
   - ✅ `payment_id` is ingevuld
   - ✅ `status` is correct (bijv. `paid` na succesvolle betaling)
   - ✅ `total`, `subtotal`, `shipping_cost` zijn correct

#### Check 2: Order Items

1. Bekijk de `order_items` tabel
2. Controleer:
   - ✅ Alle producten zijn opgeslagen
   - ✅ `quantity` en `price_at_purchase` zijn correct

#### Check 3: Mollie Dashboard

1. Ga naar [https://my.mollie.com](https://my.mollie.com)
2. Ga naar **Payments**
3. Je ziet alle testbetalingen
4. Controleer de status en details

#### Check 4: Webhook Logs

1. Ga naar Supabase Dashboard → **Edge Functions** → **Logs**
2. Selecteer `mollie-webhook`
3. Controleer of webhooks zijn ontvangen en verwerkt

#### Check 5: Admin Panel

1. Ga naar `/winkel/admin` (als je admin bent)
2. Bekijk de bestellingen
3. Controleer of alles correct wordt weergegeven

### 6.6 Test Scenario's

Test de volgende scenario's:

#### Scenario 1: Succesvolle Bestelling
- [ ] Product toevoegen
- [ ] Checkout voltooien
- [ ] Betaling succesvol simuleren
- [ ] Order status is `paid`
- [ ] Webhook is ontvangen
- [ ] Email bevestiging (als geïmplementeerd)

#### Scenario 2: Geannuleerde Betaling
- [ ] Betaling annuleren in Mollie
- [ ] Terugkeren naar `/winkel/betaling-mislukt`
- [ ] Order blijft in `pending` of wordt `cancelled`
- [ ] Producten zijn niet uit voorraad gehaald

#### Scenario 3: Gratis Verzending
- [ ] Bestelling boven €50
- [ ] Verzendkosten zijn €0.00
- [ ] Correct weergegeven in checkout

#### Scenario 4: Meerdere Producten
- [ ] Meerdere producten toevoegen
- [ ] Verschillende hoeveelheden
- [ ] Totaal is correct berekend

#### Scenario 5: Account vs Gast
- [ ] Bestellen zonder account
- [ ] Bestellen met account
- [ ] Order wordt gekoppeld aan account (als ingelogd)

### 6.7 Lokale Webhook Testen (Geavanceerd)

Voor lokale webhook testing heb je een tool zoals **ngrok** nodig:

1. Installeer ngrok: [https://ngrok.com](https://ngrok.com)
2. Start ngrok tunnel:
```bash
ngrok http 54321
```
3. Kopieer de HTTPS URL (bijv. `https://abc123.ngrok.io`)
4. Stel webhook in Mollie in op:
```
https://abc123.ngrok.io/functions/v1/mollie-webhook
```

> ⚠️ **Let op**: Voor productie gebruik je de Supabase URL direct, geen ngrok nodig!

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

