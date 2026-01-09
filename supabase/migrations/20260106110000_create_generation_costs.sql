CREATE TABLE IF NOT EXISTS public.generation_costs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0.15,
    source TEXT NOT NULL
);

-- Enable RLS
ALTER TABLE public.generation_costs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users (admins) to read all costs
CREATE POLICY "Allow read access for authenticated users" ON public.generation_costs
    FOR SELECT TO authenticated USING (true);

-- Function to get monthly cost
CREATE OR REPLACE FUNCTION get_monthly_generation_costs(year_input int, month_input int)
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

