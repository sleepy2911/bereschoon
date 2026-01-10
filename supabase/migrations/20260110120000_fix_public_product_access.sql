-- =====================================================
-- FIX PUBLIC PRODUCT ACCESS
-- Ensure anyone can view active products (not just admins)
-- =====================================================

-- Drop existing public view policy if it exists (to recreate it cleanly)
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
DROP POLICY IF EXISTS "Public can view active products" ON public.products;

-- Create policy that allows ANYONE (including anonymous users) to view active products
CREATE POLICY "Public can view active products" ON public.products
    FOR SELECT 
    USING (active = true);

-- Verify RLS is enabled
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Grant SELECT permission to anon and authenticated roles
GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.products TO authenticated;

