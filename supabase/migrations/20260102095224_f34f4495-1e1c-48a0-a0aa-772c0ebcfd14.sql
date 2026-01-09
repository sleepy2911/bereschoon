-- Create driveway_submissions table
CREATE TABLE public.driveway_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT
);

-- Enable Row Level Security
ALTER TABLE public.driveway_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting (public access for form submissions)
CREATE POLICY "Anyone can submit driveway requests" 
ON public.driveway_submissions 
FOR INSERT 
WITH CHECK (true);

-- Create policy for service role to read all
CREATE POLICY "Service role can read all submissions" 
ON public.driveway_submissions 
FOR SELECT 
USING (auth.role() = 'service_role');