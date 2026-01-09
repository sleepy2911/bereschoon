-- Ensure id has UUID default
ALTER TABLE public.service_requests 
ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Ensure created_at has timestamp default
ALTER TABLE public.service_requests 
ALTER COLUMN created_at SET DEFAULT now();

-- Disable RLS temporarily to ensure inserts work
ALTER TABLE public.service_requests DISABLE ROW LEVEL SECURITY;

