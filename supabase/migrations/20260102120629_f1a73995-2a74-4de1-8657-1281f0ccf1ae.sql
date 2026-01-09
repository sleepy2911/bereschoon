-- Authenticated users kunnen alle submissions lezen
CREATE POLICY "Authenticated users can read all submissions"
ON public.driveway_submissions
FOR SELECT
TO authenticated
USING (true);