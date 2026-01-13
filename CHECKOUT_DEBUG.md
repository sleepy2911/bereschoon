# 🐛 Checkout Debug Gids

## Huidige Status

### ✅ Gefixt:
1. **AuthContext** - `.catch()` syntax error opgelost
2. **NotificationContext** - Fail-safe voor ontbrekende tabel
3. **Edge Functions** - Alle 3 deployed met extra logging
4. **Performance** - Pagina's laden snel

### ⚠️ Nog Testen:
- [ ] Order creatie met carrier info
- [ ] Tracking code generatie
- [ ] Mollie betaling flow
- [ ] Database entries compleet

---

## 🧪 Test Checkout Nu

### **Stap 1: Hard Refresh**
```
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)
```

### **Stap 2: Test Order Plaatsen**

1. **Ga naar winkel**: `http://localhost:5173/winkel`
2. **Voeg product toe** aan cart
3. **Ga naar checkout**: `/winkel/checkout`

#### Vul Gegevens In:
```
Email: test@bereschoon.nl
Voornaam: Test
Achternaam: Gebruiker
Telefoon: 0612345678

Straat: Teststraat
Huisnummer: 123
Postcode: 1234AB
Plaats: Amsterdam
Land: Nederland
```

#### **Kies Verzendmethode:**
- ✅ **DHL** (€5.95) - 1-2 werkdagen
- ✅ **PostNL** (€6.95) - 1-2 werkdagen

#### **Klik "Betalen"**

---

## 🔍 Wat Te Controleren

### **In Browser Console (F12):**

#### ✅ Goede Signalen:
```
✓ Geen rode errors meer
✓ "Order totals: { subtotal, shippingCost, total, carrier }" in console
✓ Redirect naar Mollie checkout
```

#### ❌ Als Je Errors Ziet:

**"Verzendmethode niet geselecteerd"**
- Betekenis: Carrier info niet correct verzonden
- Fix: Zorg dat je een carrier hebt geselecteerd

**"MOLLIE_API_KEY niet geconfigureerd"**
- Check: Supabase Dashboard → Settings → Edge Functions Secrets
- Voeg toe: `MOLLIE_API_KEY` met je test key

**"supabase.from(...).select(...).catch is not a function"**
- Dit is nu gefixt in de nieuwe versie
- Doe een hard refresh!

---

## 📊 Database Check na Order

### **1. Check Orders Tabel:**
```sql
SELECT 
  order_number,
  tracking_code,
  tracking_link,
  chosen_carrier_code,
  chosen_carrier_name,
  status,
  subtotal,
  shipping_cost,
  total,
  created_at
FROM orders
ORDER BY created_at DESC
LIMIT 5;
```

**Verwacht Resultaat:**
```
order_number: 2026-0001
tracking_code: TRACK-2026-0001
tracking_link: http://localhost:5173/track/TRACK-2026-0001
chosen_carrier_code: dhl (of postnl)
chosen_carrier_name: DHL (of PostNL)
status: pending (of paid na betaling)
subtotal: [product prijs]
shipping_cost: 5.95 (of 6.95)
total: [subtotal + shipping_cost]
```

### **2. Check Order Items:**
```sql
SELECT 
  oi.product_name,
  oi.quantity,
  oi.price_at_purchase,
  o.order_number
FROM order_items oi
JOIN orders o ON oi.order_id = o.id
WHERE o.order_number LIKE '2026-%'
ORDER BY o.created_at DESC;
```

**Verwacht:**
- Product naam correct
- Quantity correct
- Prijs correct opgeslagen

### **3. Check Tracking History:**
```sql
SELECT 
  o.order_number,
  h.status,
  h.description,
  h.is_automated,
  h.created_at
FROM order_tracking_history h
JOIN orders o ON h.order_id = o.id
WHERE o.order_number LIKE '2026-%'
ORDER BY h.created_at DESC;
```

**Verwacht:**
```
status: pending
description: Bestelling geplaatst en wacht op betaling
is_automated: true
```

---

## 🎯 Test Mollie Betaling

### **Op Mollie Test Pagina:**

#### **Optie 1: Succesvolle Betaling**
1. Klik op **"Paid"** knop
2. Wacht op redirect
3. Check database:
   ```sql
   SELECT status, paid_at FROM orders 
   WHERE order_number = '2026-0001';
   ```
4. **Verwacht**: `status = 'paid'`, `paid_at = [timestamp]`

#### **Optie 2: Mislukte Betaling**
1. Klik op **"Failed"** knop
2. Check database:
   ```sql
   SELECT status FROM orders 
   WHERE order_number = '2026-0001';
   ```
3. **Verwacht**: `status = 'pending'` of `'cancelled'`

---

## 🚨 Troubleshooting

### **Problem: "Edge Function returned a non-2xx status code"**

**Stap 1: Check Browser Console**
- Open F12
- Ga naar Network tab
- Zoek `create-payment` request
- Klik erop → Preview tab
- Lees de error message

**Meest Voorkomende Errors:**

#### **"Verzendmethode niet geselecteerd"**
```javascript
// In Checkout.jsx line 102-105
if (!selectedCarrier) {
  setError('Selecteer een verzendmethode');
  return;
}
```
**Fix**: Zorg dat je DHL of PostNL hebt geselecteerd!

#### **"MOLLIE_API_KEY niet geconfigureerd"**
1. Ga naar Supabase Dashboard
2. Project Settings → Edge Functions
3. Add Secret: `MOLLIE_API_KEY`
4. Value: Je Mollie test key (begint met `test_...`)

#### **"Kon bestelling niet aanmaken"**
- Check database permissions
- Check of `orders` tabel bestaat
- Check of triggers zijn geactiveerd:
  ```sql
  SELECT * FROM pg_trigger WHERE tgname LIKE '%order%';
  ```

---

## ✅ Checklist Voor Complete Test

### **Order Creatie:**
- [ ] Carrier selectie werkt (DHL/PostNL)
- [ ] Shipping cost correct berekend
- [ ] Total = subtotal + shipping_cost
- [ ] Order nummer format: `2026-XXXX`
- [ ] Tracking code format: `TRACK-2026-XXXX`

### **Database:**
- [ ] Order in `orders` tabel
- [ ] Items in `order_items` tabel
- [ ] History entry in `order_tracking_history`
- [ ] Alle velden correct ingevuld:
  - [ ] chosen_carrier_code
  - [ ] chosen_carrier_name
  - [ ] tracking_code
  - [ ] tracking_link
  - [ ] shipping_address (JSON)
  - [ ] subtotal, shipping_cost, total

### **Betaling:**
- [ ] Redirect naar Mollie werkt
- [ ] Test betaling "Paid" werkt
- [ ] Status update naar `paid`
- [ ] `paid_at` timestamp gezet
- [ ] Tracking history entry bij betaling

### **Tracking:**
- [ ] `/track/[tracking_code]` werkt
- [ ] Order details zichtbaar
- [ ] Status tijdlijn correct
- [ ] Producten lijst compleet

---

## 📞 Hulp Nodig?

### **Console Logs Verzamelen:**
1. Open F12 → Console tab
2. Reproduceer de error
3. Right-click in console → Save as...
4. Share de logs

### **Network Logs:**
1. Open F12 → Network tab
2. Filter op "Fetch/XHR"
3. Reproduceer de error
4. Check `create-payment` request
5. Share de Response

### **Database State:**
```sql
-- Laatste order details
SELECT * FROM orders ORDER BY created_at DESC LIMIT 1;

-- Laatste order items
SELECT * FROM order_items 
WHERE order_id = (SELECT id FROM orders ORDER BY created_at DESC LIMIT 1);

-- Laatste tracking history
SELECT * FROM order_tracking_history 
WHERE order_id = (SELECT id FROM orders ORDER BY created_at DESC LIMIT 1);
```

---

## 🎯 Nu Testen!

1. **Hard refresh** je browser
2. **Plaats een test order**
3. **Check alle checkboxes** hierboven
4. **Report** wat werkt en wat niet!

Succes! 🚀

