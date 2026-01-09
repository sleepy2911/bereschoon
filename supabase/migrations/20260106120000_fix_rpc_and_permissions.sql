-- Re-create the function to ensure it exists and is accessible
CREATE OR REPLACE FUNCTION public.get_monthly_generation_costs(year_input int, month_input int)
RETURNS NUMERIC AS $$
DECLARE
    total_cost NUMERIC;
BEGIN
    SELECT COALESCE(SUM(amount), 0)
    INTO total_cost
    FROM public.generation_costs
    WHERE EXTRACT(YEAR FROM created_at) = year_input
    AND EXTRACT(MONTH FROM created_at) = month_input;
    
    RETURN total_cost;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_monthly_generation_costs(int, int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_monthly_generation_costs(int, int) TO service_role;

-- Ensure generation_costs table has correct policies
ALTER TABLE public.generation_costs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'generation_costs' 
        AND policyname = 'Allow read access for authenticated users'
    ) THEN
        CREATE POLICY "Allow read access for authenticated users" ON public.generation_costs
            FOR SELECT TO authenticated USING (true);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'generation_costs' 
        AND policyname = 'Allow insert for service role'
    ) THEN
        CREATE POLICY "Allow insert for service role" ON public.generation_costs
            FOR INSERT TO service_role WITH CHECK (true);
    END IF;
END
$$;

