-- Add shipping carrier selection (DHL vs PostNL)
-- Extends shipping_settings to support multiple carriers per country

-- Add carrier columns to shipping_settings
ALTER TABLE public.shipping_settings ADD COLUMN IF NOT EXISTS carrier_code TEXT;
ALTER TABLE public.shipping_settings ADD COLUMN IF NOT EXISTS carrier_name TEXT;
ALTER TABLE public.shipping_settings ADD COLUMN IF NOT EXISTS delivery_time TEXT;

-- Drop old unique constraint on country_code
ALTER TABLE public.shipping_settings DROP CONSTRAINT IF EXISTS shipping_settings_country_code_key;

-- Add new unique constraint on country_code + carrier_code combination
ALTER TABLE public.shipping_settings ADD CONSTRAINT shipping_settings_country_carrier_key 
    UNIQUE (country_code, carrier_code);

-- Update existing records to have a default carrier
UPDATE public.shipping_settings 
SET carrier_code = 'standard',
    carrier_name = 'Standaard Verzending'
WHERE carrier_code IS NULL;

-- Clear existing shipping settings to start fresh with new carrier structure
DELETE FROM public.shipping_settings;

-- Insert PostNL shipping options for Benelux
INSERT INTO public.shipping_settings (country_code, country_name, carrier_code, carrier_name, flat_rate, free_shipping_threshold, delivery_time, active)
VALUES 
    ('NL', 'Nederland', 'postnl', 'PostNL', 6.95, 50.00, '1-2 werkdagen', true),
    ('BE', 'België', 'postnl', 'PostNL', 7.95, 50.00, '2-3 werkdagen', true),
    ('LU', 'Luxemburg', 'postnl', 'PostNL', 8.95, 50.00, '3-4 werkdagen', true);

-- Insert DHL shipping options for Benelux
INSERT INTO public.shipping_settings (country_code, country_name, carrier_code, carrier_name, flat_rate, free_shipping_threshold, delivery_time, active)
VALUES 
    ('NL', 'Nederland', 'dhl', 'DHL', 5.95, 50.00, '1-2 werkdagen', true),
    ('BE', 'België', 'dhl', 'DHL', 6.95, 50.00, '2-3 werkdagen', true),
    ('LU', 'Luxemburg', 'dhl', 'DHL', 7.95, 50.00, '3-4 werkdagen', true);

-- Add carrier_code to orders table to track which carrier was chosen
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS chosen_carrier_code TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS chosen_carrier_name TEXT;

-- Create index for carrier lookups
CREATE INDEX IF NOT EXISTS idx_shipping_settings_carrier ON public.shipping_settings(carrier_code, country_code);
CREATE INDEX IF NOT EXISTS idx_orders_carrier ON public.orders(chosen_carrier_code);

-- Drop old get_shipping_cost function first
DROP FUNCTION IF EXISTS public.get_shipping_cost(TEXT, DECIMAL);

-- Update get_shipping_cost function to support carrier selection
CREATE OR REPLACE FUNCTION public.get_shipping_cost(
    country TEXT, 
    order_total DECIMAL,
    carrier TEXT DEFAULT 'dhl'
)
RETURNS DECIMAL AS $$
DECLARE
    settings RECORD;
BEGIN
    SELECT * INTO settings FROM public.shipping_settings 
    WHERE country_code = country 
      AND carrier_code = carrier 
      AND active = true;
    
    IF NOT FOUND THEN
        RETURN NULL; -- Carrier/country combination not supported
    END IF;
    
    IF order_total >= settings.free_shipping_threshold THEN
        RETURN 0;
    END IF;
    
    RETURN settings.flat_rate;
END;
$$ LANGUAGE plpgsql;

-- Function to get available carriers for a country
CREATE OR REPLACE FUNCTION public.get_available_carriers(country TEXT)
RETURNS TABLE (
    carrier_code TEXT,
    carrier_name TEXT,
    flat_rate NUMERIC,
    delivery_time TEXT,
    free_shipping_threshold NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ss.carrier_code,
        ss.carrier_name,
        ss.flat_rate,
        ss.delivery_time,
        ss.free_shipping_threshold
    FROM public.shipping_settings ss
    WHERE ss.country_code = country AND ss.active = true
    ORDER BY ss.flat_rate ASC; -- Cheapest first
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.get_shipping_cost TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_available_carriers TO anon, authenticated;

-- Comments
COMMENT ON COLUMN public.shipping_settings.carrier_code IS 'Carrier code (dhl, postnl, etc.)';
COMMENT ON COLUMN public.shipping_settings.carrier_name IS 'Display name of carrier';
COMMENT ON COLUMN public.shipping_settings.delivery_time IS 'Estimated delivery time';
COMMENT ON COLUMN public.orders.chosen_carrier_code IS 'Carrier code chosen by customer at checkout';
COMMENT ON COLUMN public.orders.chosen_carrier_name IS 'Carrier name chosen by customer at checkout';

