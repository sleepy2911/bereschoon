-- Function to decrement product stock
CREATE OR REPLACE FUNCTION public.decrement_stock(product_uuid UUID, quantity INTEGER)
RETURNS void AS $$
BEGIN
    UPDATE public.products 
    SET stock = GREATEST(0, stock - quantity)
    WHERE id = product_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to service role
GRANT EXECUTE ON FUNCTION public.decrement_stock(UUID, INTEGER) TO service_role;

