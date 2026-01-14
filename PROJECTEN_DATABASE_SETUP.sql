-- INSTRUCTIES: Voer dit SQL script uit in de Supabase SQL Editor
-- Dashboard > SQL Editor > New Query > Plak dit script > Run

-- 1. Maak de projects tabel aan (als deze nog niet bestaat)
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  date date NULL,
  before_image_url text NULL,
  after_image_url text NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT projects_pkey PRIMARY KEY (id)
);

-- 2. Maak de update trigger function aan (als deze nog niet bestaat)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- 3. Maak de trigger aan
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at 
  BEFORE UPDATE ON projects 
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 4. Schakel RLS in
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 5. Verwijder oude policies (als ze bestaan)
DROP POLICY IF EXISTS "Allow public read access to projects" ON public.projects;
DROP POLICY IF EXISTS "Allow authenticated users to insert projects" ON public.projects;
DROP POLICY IF EXISTS "Allow authenticated users to update projects" ON public.projects;
DROP POLICY IF EXISTS "Allow authenticated users to delete projects" ON public.projects;

-- 6. Maak nieuwe policies aan
CREATE POLICY "Allow public read access to projects"
  ON public.projects
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to insert projects"
  ON public.projects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update projects"
  ON public.projects
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete projects"
  ON public.projects
  FOR DELETE
  TO authenticated
  USING (true);

-- 7. Voeg example projecten toe
INSERT INTO public.projects (name, date, before_image_url, after_image_url) VALUES
  ('Project 1', '2024-01-15', '/images/images_optimized/1voor.webp', '/images/images_optimized/1na.webp'),
  ('Gevers', '2024-02-20', '/images/images_optimized/gevers voor.webp', '/images/images_optimized/gevers na.webp'),
  ('Gevers Extra', '2024-02-21', '/images/images_optimized/gevers voor.webp', '/images/images_optimized/gevers na 2.webp'),
  ('Hoek 1', '2024-03-10', '/images/images_optimized/hoek 1 voor.webp', '/images/images_optimized/hoek 1 na.webp'),
  ('Hoek 1 Ingeveegd', '2024-03-11', '/images/images_optimized/hoek 1 voor.webp', '/images/images_optimized/hoek 1 ingeveegd na.webp'),
  ('Mac Drive', '2024-04-05', '/images/images_optimized/mac drive voor.webp', '/images/images_optimized/mac drive na.webp'),
  ('Mac Drive 2', '2024-04-06', '/images/images_optimized/mac drive 2 voor.webp', '/images/images_optimized/mac drive 2 na.webp'),
  ('Mac Ingang', '2024-04-15', '/images/images_optimized/mac ingang voor.webp', '/images/images_optimized/mac ingang na.webp'),
  ('Mac', '2024-04-20', '/images/images_optimized/mac voor.webp', '/images/images_optimized/mac na.webp'),
  ('Onkruid Tuin', '2024-05-10', '/images/images_optimized/onkruid tuin voor.webp', '/images/images_optimized/onkruid tuin na.webp'),
  ('Rood Huis', '2024-06-01', '/images/images_optimized/rood huis voor.webp', '/images/images_optimized/rood huis na.webp'),
  ('Villa', '2024-07-15', '/images/images_optimized/villa voor.webp', '/images/images_optimized/villa na.webp')
ON CONFLICT DO NOTHING;

-- Controleer of de data is toegevoegd
SELECT COUNT(*) as aantal_projecten FROM public.projects;
SELECT * FROM public.projects ORDER BY date DESC LIMIT 5;

