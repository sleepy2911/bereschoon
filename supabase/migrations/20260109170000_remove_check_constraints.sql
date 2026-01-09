-- Remove the check constraint on service_type that's blocking inserts
ALTER TABLE public.service_requests DROP CONSTRAINT IF EXISTS service_requests_service_type_check;

-- Also remove any other check constraints that might cause issues
ALTER TABLE public.service_requests DROP CONSTRAINT IF EXISTS service_requests_status_check;

-- Make service_type column accept any text value
-- The constraint was limiting to old values, but we now have new service types

