# 🧪 Snelle Test Gids - Testbetalingen met Nep Geld

## ⚡ Quick Start (5 minuten)

### Stap 1: Test API Key Instellen

```bash
# 1. Haal je Test API Key op van https://my.mollie.com → Developers → API-sleutels
# 2. Stel deze in:
npx supabase secrets set MOLLIE_API_KEY=test_xxxxxxxxxxxxxxxxxxxxxxxx

# 3. Stel SITE_URL in (voor lokale ontwikkeling):
npx supabase secrets set SITE_URL=http://localhost:5173

# 4. Deploy de functions:
npx supabase functions deploy create-payment
npx supabase functions deploy mollie-webhook
```

### Stap 2: Test Betaling Maken

1. **Start je development server:**
   ```bash
   npm run dev
   ```

2. **Ga naar de webshop:**
   - Open `http://localhost:5173/winkel`
   - Voeg een product toe aan je winkelmandje
   - Klik op "Afrekenen"

3. **Vul test gegevens in:**
   - E-mail: `test@example.com`
   - Naam: `Test Gebruiker`
   - Adres: `Teststraat 1, 1234 AB Amsterdam`
   - Land: `Nederland`

4. **Klik op "Betalen"**
   - Je wordt doorgestuurd naar Mollie Test Omgeving

5. **Kies een betaalstatus:**
   - ✅ **Betaald** → Succesvolle betaling
   - ❌ **Geannuleerd** → Geannuleerde betaling
   - ⏱️ **Verlopen** → Verlopen betaling
   - ❌ **Mislukt** → Mislukte betaling

## 🎯 Test Scenario's

### Test 1: Succesvolle Betaling

1. Kies **iDEAL** als betaalmethode
2. Selecteer **"Betaald"**
3. ✅ Je wordt doorgestuurd naar `/winkel/betaling-succes`
4. ✅ Order status wordt `paid` in database
5. ✅ Check in Supabase: `orders` tabel → status = `paid`

### Test 2: Creditcard Test

1. Kies **Creditcard** als betaalmethode
2. Gebruik test nummer: `4111111111111111`
3. Vervaldatum: `12/25` (willekeurige toekomstige datum)
4. CVC: `123` (willekeurig)
5. Kies **"Betaald"**
6. ✅ Betaling wordt gesimuleerd

### Test 3: Gratis Verzending

1. Voeg producten toe tot totaal > €50
2. Ga naar checkout
3. ✅ Verzendkosten moeten €0.00 zijn
4. ✅ Totaal = subtotaal (geen verzendkosten)

### Test 4: Geannuleerde Betaling

1. Start een betaling
2. Kies **"Geannuleerd"** in Mollie
3. ✅ Je wordt doorgestuurd naar `/winkel/betaling-mislukt`
4. ✅ Order blijft in `pending` status
5. ✅ Producten zijn NIET uit voorraad gehaald

## 📊 Controleren

### Check Database (Supabase)

1. Ga naar [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecteer je project
3. Ga naar **Table Editor** → `orders`
4. Controleer:
   - ✅ Order is aangemaakt
   - ✅ `payment_id` is ingevuld
   - ✅ `status` is correct
   - ✅ `total` is correct

### Check Mollie Dashboard

1. Ga naar [https://my.mollie.com](https://my.mollie.com)
2. Ga naar **Payments**
3. Je ziet alle testbetalingen
4. Controleer status en details

### Check Webhook Logs

1. Supabase Dashboard → **Edge Functions** → **Logs**
2. Selecteer `mollie-webhook`
3. Controleer of webhooks zijn ontvangen

## 🔍 Troubleshooting

### Betaling wordt niet aangemaakt

**Check:**
- [ ] Is `MOLLIE_API_KEY` ingesteld? (`npx supabase secrets list`)
- [ ] Begint de key met `test_`?
- [ ] Zijn de Edge Functions gedeployed?
- [ ] Check de logs: `npx supabase functions logs create-payment`

### Webhook wordt niet ontvangen

**Check:**
- [ ] Is `mollie-webhook` function gedeployed?
- [ ] Check de logs: `npx supabase functions logs mollie-webhook`
- [ ] Is de webhook URL correct in Mollie ingesteld?

### Order status wordt niet bijgewerkt

**Check:**
- [ ] Webhook logs in Supabase
- [ ] Is `order_id` correct in payment metadata?
- [ ] Check database: `orders` tabel

## 📝 Test Checklist

Voordat je live gaat, test:

- [ ] Succesvolle betaling (iDEAL)
- [ ] Succesvolle betaling (Creditcard)
- [ ] Geannuleerde betaling
- [ ] Verlopen betaling
- [ ] Mislukte betaling
- [ ] Gratis verzending (>€50)
- [ ] Verzendkosten berekening
- [ ] Meerdere producten
- [ ] Bestellen zonder account
- [ ] Bestellen met account
- [ ] Order wordt opgeslagen in database
- [ ] Order items zijn correct
- [ ] Webhook werkt
- [ ] Order status updates correct

## 🚀 Live Gaan

Wanneer je klaar bent om live te gaan:

1. **Wijzig naar Live API Key:**
   ```bash
   npx supabase secrets set MOLLIE_API_KEY=live_xxxxxxxxxxxxxxxxxxxxxxxx
   ```

2. **Update SITE_URL:**
   ```bash
   npx supabase secrets set SITE_URL=https://bereschoon.nl
   ```

3. **Deploy opnieuw:**
   ```bash
   npx supabase functions deploy create-payment
   npx supabase functions deploy mollie-webhook
   ```

4. **Test met echt geld (klein bedrag):**
   - Maak een test bestelling met echt geld
   - Controleer of alles werkt
   - Check of je het geld ontvangt

---

## 💡 Tips

- **Test altijd eerst met test API key** voordat je live gaat
- **Gebruik verschillende betaalmethoden** om alles te testen
- **Test ook edge cases** zoals geannuleerde betalingen
- **Check de logs regelmatig** tijdens ontwikkeling
- **Gebruik de Mollie Dashboard** om alle betalingen te monitoren

## 📚 Meer Info

- [Mollie Test Documentatie](https://docs.mollie.com/overview/testing)
- [Mollie Test Cards](https://docs.mollie.com/overview/testing#test-card-numbers)
- [Volledige Setup Gids](./MOLLIE_SETUP.md)


