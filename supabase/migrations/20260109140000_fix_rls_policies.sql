-- Fix RLS policies for service_requests table

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Allow service role full access to service_requests" ON public.service_requests;

-- Create a policy that allows service role to do everything
CREATE POLICY "Service role full access" ON public.service_requests
    FOR ALL USING (true) WITH CHECK (true);

-- Allow anonymous inserts (for edge function using service key)
DROP POLICY IF EXISTS "Allow inserts to service_requests" ON public.service_requests;
CREATE POLICY "Allow inserts to service_requests" ON public.service_requests
    FOR INSERT WITH CHECK (true);

-- Allow service role to read all
DROP POLICY IF EXISTS "Allow reads to service_requests" ON public.service_requests;
CREATE POLICY "Allow reads to service_requests" ON public.service_requests
    FOR SELECT USING (true);

