-- =====================================================
-- PRODUCT IMAGES STORAGE BUCKET
-- =====================================================

-- Create the storage bucket for product images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'product-images',
    'product-images',
    true, -- Public bucket so images can be viewed without auth
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to view product images (public bucket)
CREATE POLICY "Anyone can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Allow admins to upload product images
CREATE POLICY "Admins can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'product-images' AND
    EXISTS (
        SELECT 1 FROM public.admin_users au 
        WHERE au.user_id = auth.uid()
    )
);

-- Allow admins to update product images
CREATE POLICY "Admins can update product images"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'product-images' AND
    EXISTS (
        SELECT 1 FROM public.admin_users au 
        WHERE au.user_id = auth.uid()
    )
);

-- Allow admins to delete product images
CREATE POLICY "Admins can delete product images"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'product-images' AND
    EXISTS (
        SELECT 1 FROM public.admin_users au 
        WHERE au.user_id = auth.uid()
    )
);

