-- Create storage bucket for service request photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'service-request-photos',
    'service-request-photos',
    true,
    52428800, -- 50MB limit
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy to allow public read access
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT
USING (bucket_id = 'service-request-photos');

-- Create storage policy to allow authenticated uploads
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT
WITH CHECK (
    bucket_id = 'service-request-photos' AND
    auth.role() = 'authenticated'
);

-- Allow service role to upload (for edge functions)
CREATE POLICY "Service role can upload" ON storage.objects
FOR INSERT
WITH CHECK (
    bucket_id = 'service-request-photos' AND
    auth.role() = 'service_role'
);

