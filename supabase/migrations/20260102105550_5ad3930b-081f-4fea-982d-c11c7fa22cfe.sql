-- Create public storage bucket for driveway photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('driveway-photos', 'driveway-photos', true);

-- Allow anyone to upload to the bucket
CREATE POLICY "Anyone can upload driveway photos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'driveway-photos');

-- Allow public read access
CREATE POLICY "Public read access for driveway photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'driveway-photos');