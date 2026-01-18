-- Migration to expand products table with detailed information and reviews
-- Generated based on user request for additional product details and review storage

alter table public.products
add column if not exists usage_instructions text null,
add column if not exists dilution_instructions text null,
add column if not exists warnings text null,
add column if not exists safety_info text null,
add column if not exists reviews jsonb null default '[]'::jsonb;

-- Add comments to columns for clarity in Supabase dashboard
comment on column public.products.usage_instructions is 'Instructions for using the product (Gebruiksaanwijzing)';
comment on column public.products.dilution_instructions is 'Dilution ratios and instructions (VERDUNNINGEN)';
comment on column public.products.warnings is 'Important warnings and cautions (BELANGRIJK)';
comment on column public.products.safety_info is 'Ingredients and safety data sheet info (Ingrediënten en veiligheidsinformatieblad)';
comment on column public.products.reviews is 'Array of user reviews';
