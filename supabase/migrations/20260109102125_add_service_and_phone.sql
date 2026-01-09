-- Add service and phone columns to driveway_submissions table
-- Migration: 001_add_service_and_phone

-- Add service column (nullable, can be 'terras', 'gevel', 'dak', 'overig', or NULL)
ALTER TABLE driveway_submissions
ADD COLUMN IF NOT EXISTS service TEXT;

-- Add phone column (nullable)
ALTER TABLE driveway_submissions
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Create index on service for better query performance (optional but recommended)
CREATE INDEX IF NOT EXISTS idx_driveway_submissions_service ON driveway_submissions(service);

-- Add comment to service column for documentation
COMMENT ON COLUMN driveway_submissions.service IS 'Service type: terras, gevel, dak, overig, or NULL';

