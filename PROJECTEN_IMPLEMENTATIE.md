# Projecten Pagina - Database Implementatie

## Wat is er veranderd?

De projecten pagina (`/projecten`) is aangepast om projecten dynamisch uit de database te laden in plaats van hardcoded afbeeldingen te gebruiken.

### Aanpassingen:

1. **Gallery Component** (`src/components/Gallery.jsx`)
   - Importeert nu de Supabase client
   - Fetch projecten uit de `projects` tabel bij het laden van de pagina
   - Toont een loading state tijdens het laden
   - Toont "Geen projecten gevonden" als er geen data is
   - De layout blijft exact hetzelfde

2. **Database Tabel** (`projects`)
   - **Kolommen:**
     - `id` (uuid, primary key)
     - `name` (text, project naam)
     - `date` (date, project datum - optioneel)
     - `before_image_url` (text, URL van de "voor" afbeelding)
     - `after_image_url` (text, URL van de "na" afbeelding)
     - `created_at` (timestamp)
     - `updated_at` (timestamp)

3. **Data Flow:**
   - `before_image_url` → Links (VOOR afbeelding in de slider)
   - `after_image_url` → Rechts (NA afbeelding in de slider)
   - `name` → Projectnaam die wordt gerenderd

## Database Setup

### Stap 1: Voer het SQL script uit

1. Open je Supabase Dashboard
2. Ga naar **SQL Editor**
3. Klik op **New Query**
4. Kopieer en plak de inhoud van `PROJECTEN_DATABASE_SETUP.sql`
5. Klik op **Run**

Dit script zal:
- ✅ De `projects` tabel aanmaken
- ✅ RLS (Row Level Security) policies instellen
- ✅ Example projecten toevoegen met de bestaande afbeeldingen
- ✅ Auto-update trigger voor `updated_at` aanmaken

### Stap 2: Controleer de data

Na het uitvoeren van het script zou je 12 projecten moeten zien. Je kunt dit controleren in:
- **Supabase Dashboard** → Table Editor → `projects`
- Of via de query: `SELECT * FROM projects;`

### Stap 3: Test de website

1. Ga naar `http://localhost:5173/projecten` (of je productie URL)
2. Je zou nu alle projecten moeten zien in een grid
3. Klik op een project om de before/after slider te openen
4. Test dat de slider werkt en de juiste afbeeldingen toont

## Afbeeldingen Toevoegen

### Via de Database:

```sql
INSERT INTO projects (name, date, before_image_url, after_image_url) 
VALUES (
  'Project Naam',
  '2024-01-15',
  '/images/images_optimized/project-voor.webp',
  '/images/images_optimized/project-na.webp'
);
```

### Notities:
- De afbeelding URLs kunnen relatieve paden zijn (bijv. `/images/...`)
- Of volledige URLs naar Supabase Storage of een andere CDN
- Zorg ervoor dat beide `before_image_url` EN `after_image_url` ingevuld zijn

## Admin Panel (Toekomstige Verbetering)

In de toekomst kan er een admin panel worden gebouwd om:
- Projecten toe te voegen via een formulier
- Afbeeldingen te uploaden naar Supabase Storage
- Projecten te bewerken en verwijderen
- Drag & drop voor volgorde

## Troubleshooting

### "Geen projecten gevonden"
- Controleer of het SQL script succesvol is uitgevoerd
- Check de browser console voor errors
- Verifieer dat de Supabase credentials correct zijn in `.env`

### Afbeeldingen laden niet
- Controleer of de afbeelding paden correct zijn
- Verifieer dat de afbeeldingen bestaan in `public/images/images_optimized/`
- Check de browser Network tab voor 404 errors

### RLS Errors (403/406)
- Verifieer dat de RLS policies correct zijn ingesteld
- Public read moet enabled zijn voor de `projects` tabel
- Run het SQL script opnieuw als policies ontbreken

## Environment Variables

Zorg ervoor dat je `.env` bestand deze variabelen bevat:

```env
VITE_SUPABASE_URL=https://ajzvywxgzmiwykvnrgsq.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Bestanden Aangepast

- ✅ `src/components/Gallery.jsx` - Aangepast om data uit database te halen
- ✅ `supabase/migrations/20260114000000_create_projects_table.sql` - Nieuwe migratie
- ✅ `supabase/migrations/20260114000001_seed_projects.sql` - Seed data
- ✅ `PROJECTEN_DATABASE_SETUP.sql` - SQL script voor handmatige setup
- ✅ `PROJECTEN_IMPLEMENTATIE.md` - Deze documentatie

