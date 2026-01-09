-- Ensure service role can insert with photo_url
-- Service role bypasses RLS, but let's add explicit policy for safety
CREATE POLICY "Service role can insert submissions"
ON public.driveway_submissions
FOR INSERT
TO service_role
WITH CHECK (true);

-- Also ensure authenticated users can see photo_url in their queries
-- (This is already covered by the existing SELECT policy, but making it explicit)

