-- Add company_name column to service_requests table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'service_requests' AND column_name = 'company_name') THEN
        ALTER TABLE public.service_requests ADD COLUMN company_name TEXT;
    END IF;
END $$;

-- Add company_name column to service_requests_ad table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'service_requests_ad' AND column_name = 'company_name') THEN
        ALTER TABLE public.service_requests_ad ADD COLUMN company_name TEXT;
    END IF;
END $$;
