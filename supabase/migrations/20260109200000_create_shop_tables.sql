-- =====================================================
-- BERESCHOON WEBSHOP DATABASE SCHEMA
-- =====================================================

-- 1. PROFILES TABLE (extends Supabase Auth)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    default_address JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read and update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. ADMIN_USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'manager')),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Only admins can view admin_users
CREATE POLICY "Admins can view admin_users" ON public.admin_users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admin_users au 
            WHERE au.user_id = auth.uid()
        )
    );

-- Service role can manage admin_users
CREATE POLICY "Service role can manage admin_users" ON public.admin_users
    FOR ALL USING (auth.role() = 'service_role');

-- 3. PRODUCTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    short_description TEXT,
    price DECIMAL(10,2) NOT NULL,
    compare_price DECIMAL(10,2), -- Original price for showing discount
    stock INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    features JSONB DEFAULT '[]'::jsonb, -- Array of feature strings
    images JSONB DEFAULT '[]'::jsonb, -- Array of image URLs
    video_url TEXT,
    category TEXT,
    weight DECIMAL(10,3), -- Weight in kg for shipping
    sku TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Everyone can view active products
CREATE POLICY "Anyone can view active products" ON public.products
    FOR SELECT USING (active = true);

-- Admins can view all products
CREATE POLICY "Admins can view all products" ON public.products
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admin_users au 
            WHERE au.user_id = auth.uid()
        )
    );

-- Admins can insert products
CREATE POLICY "Admins can insert products" ON public.products
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.admin_users au 
            WHERE au.user_id = auth.uid()
        )
    );

-- Admins can update products
CREATE POLICY "Admins can update products" ON public.products
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.admin_users au 
            WHERE au.user_id = auth.uid()
        )
    );

-- Admins can delete products
CREATE POLICY "Admins can delete products" ON public.products
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.admin_users au 
            WHERE au.user_id = auth.uid()
        )
    );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(active);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);

-- 4. ORDERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE, -- Human readable order number like BS-20260109-001
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    subtotal DECIMAL(10,2) NOT NULL,
    shipping_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    payment_id TEXT, -- Mollie payment ID
    payment_method TEXT, -- ideal, bancontact, creditcard, etc.
    shipping_address JSONB NOT NULL,
    billing_address JSONB,
    notes TEXT, -- Customer notes
    admin_notes TEXT, -- Internal notes
    tracking_code TEXT,
    tracking_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    paid_at TIMESTAMPTZ,
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Users can view their own orders
CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

-- Users can view orders by email (for guest checkout)
CREATE POLICY "Anyone can view orders by payment_id" ON public.orders
    FOR SELECT USING (payment_id IS NOT NULL);

-- Service role can manage all orders
CREATE POLICY "Service role can manage orders" ON public.orders
    FOR ALL USING (auth.role() = 'service_role');

-- Admins can view all orders
CREATE POLICY "Admins can view all orders" ON public.orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admin_users au 
            WHERE au.user_id = auth.uid()
        )
    );

-- Admins can update orders
CREATE POLICY "Admins can update orders" ON public.orders
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.admin_users au 
            WHERE au.user_id = auth.uid()
        )
    );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON public.orders(payment_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
    today_date TEXT;
    order_count INTEGER;
BEGIN
    today_date := TO_CHAR(NOW(), 'YYYYMMDD');
    
    SELECT COUNT(*) + 1 INTO order_count
    FROM public.orders
    WHERE DATE(created_at) = CURRENT_DATE;
    
    NEW.order_number := 'BS-' || today_date || '-' || LPAD(order_count::TEXT, 3, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_order_number ON public.orders;
CREATE TRIGGER set_order_number
    BEFORE INSERT ON public.orders
    FOR EACH ROW
    WHEN (NEW.order_number IS NULL)
    EXECUTE FUNCTION generate_order_number();

-- 5. ORDER_ITEMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL, -- Store name in case product is deleted
    product_slug TEXT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price_at_purchase DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Users can view their own order items
CREATE POLICY "Users can view own order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders o 
            WHERE o.id = order_id AND o.user_id = auth.uid()
        )
    );

-- Service role can manage all order items
CREATE POLICY "Service role can manage order items" ON public.order_items
    FOR ALL USING (auth.role() = 'service_role');

-- Admins can view all order items
CREATE POLICY "Admins can view all order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admin_users au 
            WHERE au.user_id = auth.uid()
        )
    );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

-- 6. SHIPPING_SETTINGS TABLE (for admin configuration)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.shipping_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_code TEXT NOT NULL, -- NL, BE, LU
    country_name TEXT NOT NULL,
    flat_rate DECIMAL(10,2) NOT NULL DEFAULT 4.95,
    free_shipping_threshold DECIMAL(10,2) DEFAULT 50.00,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(country_code)
);

-- Enable RLS
ALTER TABLE public.shipping_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can view active shipping settings
CREATE POLICY "Anyone can view shipping settings" ON public.shipping_settings
    FOR SELECT USING (active = true);

-- Admins can manage shipping settings
CREATE POLICY "Admins can manage shipping settings" ON public.shipping_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admin_users au 
            WHERE au.user_id = auth.uid()
        )
    );

-- Insert default shipping settings for Benelux
INSERT INTO public.shipping_settings (country_code, country_name, flat_rate, free_shipping_threshold)
VALUES 
    ('NL', 'Nederland', 4.95, 50.00),
    ('BE', 'België', 5.95, 50.00),
    ('LU', 'Luxemburg', 6.95, 50.00)
ON CONFLICT (country_code) DO NOTHING;

-- 7. UPDATE TIMESTAMPS TRIGGER
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_shipping_settings_updated_at ON public.shipping_settings;
CREATE TRIGGER update_shipping_settings_updated_at
    BEFORE UPDATE ON public.shipping_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. HELPER FUNCTIONS
-- =====================================================

-- Check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users 
        WHERE user_id = user_uuid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get shipping cost for country
CREATE OR REPLACE FUNCTION public.get_shipping_cost(country TEXT, order_total DECIMAL)
RETURNS DECIMAL AS $$
DECLARE
    settings RECORD;
BEGIN
    SELECT * INTO settings FROM public.shipping_settings 
    WHERE country_code = country AND active = true;
    
    IF NOT FOUND THEN
        RETURN NULL; -- Country not supported
    END IF;
    
    IF order_total >= settings.free_shipping_threshold THEN
        RETURN 0;
    END IF;
    
    RETURN settings.flat_rate;
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON TABLE public.products IS 'Products available in the webshop';
COMMENT ON TABLE public.orders IS 'Customer orders';
COMMENT ON TABLE public.order_items IS 'Individual items in an order';
COMMENT ON TABLE public.profiles IS 'Extended user profiles';
COMMENT ON TABLE public.admin_users IS 'Users with admin access to the shop';
COMMENT ON TABLE public.shipping_settings IS 'Shipping rates per country';

