-- Add DELETE policy for authenticated users
CREATE POLICY "Authenticated users can delete submissions" 
ON public.driveway_submissions 
FOR DELETE 
TO authenticated
USING (true);