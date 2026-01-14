-- Seed projects table with example data
-- Note: Replace these image URLs with actual URLs from your storage or public folder

INSERT INTO public.projects (name, date, before_image_url, after_image_url) VALUES
  ('1', '2024-01-15', '/images/images_optimized/1voor.webp', '/images/images_optimized/1na.webp'),
  ('Gevers', '2024-02-20', '/images/images_optimized/gevers voor.webp', '/images/images_optimized/gevers na.webp'),
  ('Gevers 2', '2024-02-21', '/images/images_optimized/gevers voor.webp', '/images/images_optimized/gevers na 2.webp'),
  ('Hoek 1', '2024-03-10', '/images/images_optimized/hoek 1 voor.webp', '/images/images_optimized/hoek 1 na.webp'),
  ('Hoek 1 Ingeveegd', '2024-03-11', '/images/images_optimized/hoek 1 voor.webp', '/images/images_optimized/hoek 1 ingeveegd na.webp'),
  ('Mac Drive', '2024-04-05', '/images/images_optimized/mac drive voor.webp', '/images/images_optimized/mac drive na.webp'),
  ('Mac Drive 2', '2024-04-06', '/images/images_optimized/mac drive 2 voor.webp', '/images/images_optimized/mac drive 2 na.webp'),
  ('Mac Ingang', '2024-04-15', '/images/images_optimized/mac ingang voor.webp', '/images/images_optimized/mac ingang na.webp'),
  ('Mac', '2024-04-20', '/images/images_optimized/mac voor.webp', '/images/images_optimized/mac na.webp'),
  ('Onkruid Tuin', '2024-05-10', '/images/images_optimized/onkruid tuin voor.webp', '/images/images_optimized/onkruid tuin na.webp'),
  ('Rood Huis', '2024-06-01', '/images/images_optimized/rood huis voor.webp', '/images/images_optimized/rood huis na.webp'),
  ('Villa', '2024-07-15', '/images/images_optimized/villa voor.webp', '/images/images_optimized/villa na.webp')
ON CONFLICT (id) DO NOTHING;

