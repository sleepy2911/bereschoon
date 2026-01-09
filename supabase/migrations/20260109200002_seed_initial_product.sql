-- =====================================================
-- SEED INITIAL PRODUCT: Bereschoon Ultra Protect
-- =====================================================

INSERT INTO public.products (
    name,
    slug,
    description,
    short_description,
    price,
    compare_price,
    stock,
    active,
    featured,
    features,
    images,
    video_url,
    category,
    weight,
    sku
) VALUES (
    'Bereschoon Ultra Protect',
    'bereschoon-ultra-protect',
    'De ultieme bescherming voor uw terras en oprit. Onze speciaal ontwikkelde formule trekt diep in de steen, stoot vuil en water af en remt de groei van algen en mossen. Het resultaat? Een oprit die langer schoon blijft, met een frisse, nieuwe uitstraling.

Dit professionele beschermingsmiddel is nu voor iedereen beschikbaar. Na jarenlang gebruik door onze eigen reinigingsteams, bieden wij dit product nu ook aan voor particulieren die hun terras of oprit zelf willen behandelen.

Gebruik:
1. Zorg dat de ondergrond schoon en droog is
2. Breng het product gelijkmatig aan met een tuinspuit of roller
3. Laat minimaal 24 uur drogen
4. Geniet van langdurige bescherming

Inhoud: 5 liter - voldoende voor circa 50m²',
    'Professionele bescherming voor uw terras en oprit',
    24.95,
    29.95,
    100,
    true,
    true,
    '["Langdurige bescherming tegen vuil en vocht", "Remt groene aanslag en onkruid", "Geschikt voor alle soorten bestrating", "Eenvoudig zelf aan te brengen", "Professionele formule"]'::jsonb,
    '["/images/product-protector.jpg"]'::jsonb,
    '/product-video.mp4',
    'Bescherming',
    5.5,
    'BS-PROTECT-5L'
) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    short_description = EXCLUDED.short_description,
    price = EXCLUDED.price,
    compare_price = EXCLUDED.compare_price,
    features = EXCLUDED.features,
    images = EXCLUDED.images,
    video_url = EXCLUDED.video_url,
    updated_at = now();

