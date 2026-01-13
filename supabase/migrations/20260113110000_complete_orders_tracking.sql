-- Complete tracking system for orders table
-- This migration adds missing columns and ensures everything is properly set up

-- Add missing tracking columns
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_link TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS carrier_name TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS carrier_tracking_url TEXT;

-- Rename tracking_url to carrier_tracking_url if it exists and carrier_tracking_url doesn't
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'tracking_url'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'carrier_tracking_url'
    ) THEN
        -- Copy data from tracking_url to carrier_tracking_url
        UPDATE public.orders SET carrier_tracking_url = tracking_url WHERE tracking_url IS NOT NULL;
    END IF;
END $$;

-- Create index for tracking_link if not exists
CREATE INDEX IF NOT EXISTS idx_orders_tracking_link ON public.orders(tracking_link);

-- Drop old tracking_url column if it still exists (after copying data)
ALTER TABLE public.orders DROP COLUMN IF EXISTS tracking_url;

-- Make sure tracking_code has unique constraint
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'orders_tracking_code_key'
    ) THEN
        ALTER TABLE public.orders ADD CONSTRAINT orders_tracking_code_key UNIQUE (tracking_code);
    END IF;
END $$;

-- Update the set_tracking_code function to also set tracking_link
CREATE OR REPLACE FUNCTION set_tracking_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.tracking_code IS NULL THEN
        NEW.tracking_code := generate_tracking_code();
    END IF;
    
    -- Generate tracking link based on tracking code
    IF NEW.tracking_link IS NULL AND NEW.tracking_code IS NOT NULL THEN
        NEW.tracking_link := 'https://bereschoon.nl/track/' || NEW.tracking_code;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS auto_set_tracking_code ON public.orders;
CREATE TRIGGER auto_set_tracking_code
    BEFORE INSERT ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION set_tracking_code();

-- Generate tracking_link for existing orders that don't have one
UPDATE public.orders 
SET tracking_link = 'https://bereschoon.nl/track/' || tracking_code
WHERE tracking_code IS NOT NULL AND tracking_link IS NULL;

-- Add comments for clarity
COMMENT ON COLUMN public.orders.tracking_code IS 'Unique tracking code for customer (e.g., BS-A2B4-C6D8-E1F3)';
COMMENT ON COLUMN public.orders.tracking_link IS 'Full tracking URL on our website (e.g., https://bereschoon.nl/track/BS-A2B4-C6D8-E1F3)';
COMMENT ON COLUMN public.orders.carrier_name IS 'Name of shipping carrier (e.g., PostNL, DHL, DPD)';
COMMENT ON COLUMN public.orders.carrier_tracking_url IS 'Tracking URL from the shipping carrier';

-- Ensure order_items table has all necessary columns
-- This table links orders to products
DO $$
BEGIN
    -- Check if order_items table exists, if not create it
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'order_items') THEN
        CREATE TABLE public.order_items (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
            product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
            product_name TEXT NOT NULL,
            product_slug TEXT,
            quantity INTEGER NOT NULL CHECK (quantity > 0),
            price_at_purchase NUMERIC(10,2) NOT NULL,
            created_at TIMESTAMPTZ DEFAULT now()
        );
        
        -- Create indexes
        CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
        CREATE INDEX idx_order_items_product_id ON public.order_items(product_id);
        
        -- Enable RLS
        ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
        
        -- Policies for order_items
        CREATE POLICY "Users can view own order items" ON public.order_items
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM public.orders o 
                    WHERE o.id = order_id AND o.user_id = auth.uid()
                )
            );
        
        CREATE POLICY "Service role can manage order items" ON public.order_items
            FOR ALL USING (auth.role() = 'service_role');
        
        CREATE POLICY "Admins can view all order items" ON public.order_items
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM public.admin_users au 
                    WHERE au.user_id = auth.uid()
                )
            );
    END IF;
END $$;

COMMENT ON TABLE public.order_items IS 'Individual products in each order with price snapshot';

