-- Create admin_submissions table
CREATE TABLE IF NOT EXISTS public.admin_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE,
  original_image_url TEXT NOT NULL,
  result_image_url TEXT,
  status TEXT DEFAULT 'pending'
);

-- Enable Row Level Security
ALTER TABLE public.admin_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users (admins) to manage everything
CREATE POLICY "Authenticated users can manage admin submissions"
ON public.admin_submissions
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create public storage bucket for admin uploads (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('admin-uploads', 'admin-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload/manage in the bucket
CREATE POLICY "Authenticated users can upload admin photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'admin-uploads');

CREATE POLICY "Authenticated users can update admin photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'admin-uploads');

CREATE POLICY "Authenticated users can delete admin photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'admin-uploads');

-- Allow public read access (so we can display them easily)
CREATE POLICY "Public read access for admin photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'admin-uploads');

