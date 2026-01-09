-- =====================================================
-- FIX RLS POLICIES - PREVENT INFINITE RECURSION
-- =====================================================

-- Drop the problematic policies
DROP POLICY IF EXISTS "Admins can view all products" ON public.products;
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
DROP POLICY IF EXISTS "Admins can view admin_users" ON public.admin_users;

-- Recreate admin_users policy without recursion
-- Service role handles admin_users management
CREATE POLICY "Authenticated users can check own admin status" ON public.admin_users
    FOR SELECT USING (auth.uid() = user_id);

-- Create a security definer function to check admin status
CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  is_admin BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  ) INTO is_admin;
  RETURN COALESCE(is_admin, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Recreate product policies using the function
CREATE POLICY "Admins can view all products" ON public.products
    FOR SELECT USING (public.check_is_admin());

CREATE POLICY "Admins can insert products" ON public.products
    FOR INSERT WITH CHECK (public.check_is_admin());

CREATE POLICY "Admins can update products" ON public.products
    FOR UPDATE USING (public.check_is_admin());

CREATE POLICY "Admins can delete products" ON public.products
    FOR DELETE USING (public.check_is_admin());

-- Also fix orders policies
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;

CREATE POLICY "Admins can view all orders" ON public.orders
    FOR SELECT USING (public.check_is_admin());

CREATE POLICY "Admins can update orders" ON public.orders
    FOR UPDATE USING (public.check_is_admin());

-- Fix order_items policies
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;

CREATE POLICY "Admins can view all order items" ON public.order_items
    FOR SELECT USING (public.check_is_admin());

-- Fix shipping_settings policies
DROP POLICY IF EXISTS "Admins can manage shipping settings" ON public.shipping_settings;

CREATE POLICY "Admins can manage shipping settings" ON public.shipping_settings
    FOR ALL USING (public.check_is_admin());

-- Grant execute on the function
GRANT EXECUTE ON FUNCTION public.check_is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_is_admin() TO anon;

