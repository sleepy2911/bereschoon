-- Create contacts table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    street_address TEXT,
    postcode TEXT,
    city TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create service_requests table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.service_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    service_type TEXT,
    name TEXT,
    email TEXT,
    status TEXT DEFAULT 'nieuw',
    phone TEXT,
    street_address TEXT,
    postcode TEXT,
    city TEXT,
    message TEXT,
    square_meters TEXT,
    photo_url TEXT,
    contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
    service_options TEXT,
    service_plan TEXT
);

-- Ensure all columns exist (in case table already existed but was incomplete)
DO $$
BEGIN
    ALTER TABLE public.service_requests ADD COLUMN IF NOT EXISTS service_type TEXT;
    ALTER TABLE public.service_requests ADD COLUMN IF NOT EXISTS name TEXT;
    ALTER TABLE public.service_requests ADD COLUMN IF NOT EXISTS email TEXT;
    ALTER TABLE public.service_requests ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'nieuw';
    ALTER TABLE public.service_requests ADD COLUMN IF NOT EXISTS phone TEXT;
    ALTER TABLE public.service_requests ADD COLUMN IF NOT EXISTS street_address TEXT;
    ALTER TABLE public.service_requests ADD COLUMN IF NOT EXISTS postcode TEXT;
    ALTER TABLE public.service_requests ADD COLUMN IF NOT EXISTS city TEXT;
    ALTER TABLE public.service_requests ADD COLUMN IF NOT EXISTS message TEXT;
    ALTER TABLE public.service_requests ADD COLUMN IF NOT EXISTS square_meters TEXT;
    ALTER TABLE public.service_requests ADD COLUMN IF NOT EXISTS photo_url TEXT;
    ALTER TABLE public.service_requests ADD COLUMN IF NOT EXISTS contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL;
    ALTER TABLE public.service_requests ADD COLUMN IF NOT EXISTS service_options TEXT;
    ALTER TABLE public.service_requests ADD COLUMN IF NOT EXISTS service_plan TEXT;
EXCEPTION
    WHEN duplicate_column THEN RAISE NOTICE 'Column already exists in service_requests.';
END
$$;

-- Create indexes for better query performance (IF NOT EXISTS is implied or handled safely)
CREATE INDEX IF NOT EXISTS idx_service_requests_contact_id ON public.service_requests(contact_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON public.service_requests(status);
CREATE INDEX IF NOT EXISTS idx_service_requests_created_at ON public.service_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON public.contacts(email);

-- Enable Row Level Security
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

-- Create policies (drop first to avoid conflicts if they exist)
DROP POLICY IF EXISTS "Allow service role full access to contacts" ON public.contacts;
CREATE POLICY "Allow service role full access to contacts" ON public.contacts
    FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Allow service role full access to service_requests" ON public.service_requests;
CREATE POLICY "Allow service role full access to service_requests" ON public.service_requests
    FOR ALL USING (auth.role() = 'service_role');

-- Add comment to tables
COMMENT ON TABLE public.contacts IS 'Contact information for service requests';
COMMENT ON TABLE public.service_requests IS 'Service requests submitted through the contact form';
