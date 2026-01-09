-- Add photo_url column to driveway_submissions
ALTER TABLE public.driveway_submissions 
ADD COLUMN photo_url text;