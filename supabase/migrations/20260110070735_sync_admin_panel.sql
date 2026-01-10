-- =====================================================
-- SYNC WITH ADMIN PANEL - MIGRATIE 20260110070735
-- Dit synchroniseert de website met alle admin panel wijzigingen
-- =====================================================

-- 1. VOEG COST_PRICE TOE AAN PRODUCTEN (voor winstmargeberekening)
-- =====================================================
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS cost_price DECIMAL(10,2);

COMMENT ON COLUMN public.products.cost_price IS 'Inkoopprijs voor winstmargeberekening';

-- 2. NOTIFICATIES TABEL VOOR KLANTEN
-- =====================================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('order_created', 'order_paid', 'order_shipped', 'order_delivered', 'order_cancelled', 'tracking_updated', 'general')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Service role can manage all notifications
CREATE POLICY "Service role can manage notifications" ON public.notifications
    FOR ALL USING (auth.role() = 'service_role');

-- Admins can view all notifications
CREATE POLICY "Admins can view all notifications" ON public.notifications
    FOR SELECT USING (public.check_is_admin());

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_order_id ON public.notifications(order_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- 3. FUNCTIE OM NOTIFICATIE TE MAKEN
-- =====================================================
CREATE OR REPLACE FUNCTION public.create_notification(
    p_user_id UUID,
    p_order_id UUID,
    p_type TEXT,
    p_title TEXT,
    p_message TEXT,
    p_data JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO public.notifications (user_id, order_id, type, title, message, data)
    VALUES (p_user_id, p_order_id, p_type, p_title, p_message, p_data)
    RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.create_notification TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_notification TO service_role;

-- 4. TRIGGER OM NOTIFICATIES TE MAKEN BIJ ORDER STATUS WIJZIGING
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_order_status_change()
RETURNS TRIGGER AS $$
DECLARE
    notification_title TEXT;
    notification_message TEXT;
    notification_type TEXT;
BEGIN
    -- Alleen doorgaan als de status daadwerkelijk is gewijzigd
    IF OLD.status = NEW.status THEN
        RETURN NEW;
    END IF;
    
    -- Alleen notificaties voor gebruikers met een account
    IF NEW.user_id IS NULL THEN
        RETURN NEW;
    END IF;
    
    -- Bepaal notificatie inhoud op basis van nieuwe status
    CASE NEW.status
        WHEN 'paid' THEN
            notification_type := 'order_paid';
            notification_title := 'Betaling ontvangen! 💳';
            notification_message := 'Je bestelling ' || NEW.order_number || ' is betaald en wordt verwerkt.';
        WHEN 'processing' THEN
            notification_type := 'order_paid';
            notification_title := 'Bestelling in behandeling 📦';
            notification_message := 'We zijn bezig met het verzendklaar maken van je bestelling ' || NEW.order_number || '.';
        WHEN 'shipped' THEN
            notification_type := 'order_shipped';
            notification_title := 'Je bestelling is verzonden! 🚚';
            notification_message := 'Bestelling ' || NEW.order_number || ' is onderweg.';
            IF NEW.tracking_code IS NOT NULL THEN
                notification_message := notification_message || ' Track & Trace: ' || NEW.tracking_code;
            END IF;
        WHEN 'delivered' THEN
            notification_type := 'order_delivered';
            notification_title := 'Bestelling bezorgd! ✅';
            notification_message := 'Je bestelling ' || NEW.order_number || ' is bezorgd. Veel plezier ermee!';
        WHEN 'cancelled' THEN
            notification_type := 'order_cancelled';
            notification_title := 'Bestelling geannuleerd';
            notification_message := 'Je bestelling ' || NEW.order_number || ' is geannuleerd.';
        WHEN 'refunded' THEN
            notification_type := 'order_cancelled';
            notification_title := 'Terugbetaling verwerkt 💰';
            notification_message := 'De terugbetaling voor bestelling ' || NEW.order_number || ' is verwerkt.';
        ELSE
            RETURN NEW;
    END CASE;
    
    -- Maak notificatie aan
    PERFORM public.create_notification(
        NEW.user_id,
        NEW.id,
        notification_type,
        notification_title,
        notification_message,
        jsonb_build_object(
            'order_number', NEW.order_number,
            'status', NEW.status,
            'tracking_code', NEW.tracking_code,
            'tracking_url', NEW.tracking_url
        )
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_order_status_change ON public.orders;

-- Create trigger
CREATE TRIGGER on_order_status_change
    AFTER UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_order_status_change();

-- 5. TRIGGER VOOR TRACKING UPDATE NOTIFICATIES
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_tracking_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Alleen als tracking code is toegevoegd of gewijzigd
    IF (OLD.tracking_code IS NULL AND NEW.tracking_code IS NOT NULL) OR 
       (OLD.tracking_code IS DISTINCT FROM NEW.tracking_code) THEN
        
        IF NEW.user_id IS NOT NULL THEN
            PERFORM public.create_notification(
                NEW.user_id,
                NEW.id,
                'tracking_updated',
                'Track & Trace bijgewerkt 📍',
                'Je kunt je pakket nu volgen met code: ' || NEW.tracking_code,
                jsonb_build_object(
                    'order_number', NEW.order_number,
                    'tracking_code', NEW.tracking_code,
                    'tracking_url', NEW.tracking_url
                )
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_tracking_update ON public.orders;

-- Create trigger
CREATE TRIGGER on_tracking_update
    AFTER UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_tracking_update();

-- 6. HELPER FUNCTIES
-- =====================================================

-- Functie om ongelezen notificaties te tellen
CREATE OR REPLACE FUNCTION public.get_unread_notification_count(p_user_id UUID DEFAULT auth.uid())
RETURNS INTEGER AS $$
DECLARE
    count INTEGER;
BEGIN
    SELECT COUNT(*) INTO count
    FROM public.notifications
    WHERE user_id = p_user_id AND read = false;
    
    RETURN count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

GRANT EXECUTE ON FUNCTION public.get_unread_notification_count TO authenticated;

-- Functie om notificaties als gelezen te markeren
CREATE OR REPLACE FUNCTION public.mark_notifications_read(p_notification_ids UUID[])
RETURNS VOID AS $$
BEGIN
    UPDATE public.notifications
    SET read = true, read_at = now()
    WHERE id = ANY(p_notification_ids)
    AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.mark_notifications_read TO authenticated;

-- Functie om alle notificaties als gelezen te markeren
CREATE OR REPLACE FUNCTION public.mark_all_notifications_read()
RETURNS VOID AS $$
BEGIN
    UPDATE public.notifications
    SET read = true, read_at = now()
    WHERE user_id = auth.uid()
    AND read = false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.mark_all_notifications_read TO authenticated;

-- 7. ENABLE REALTIME VOOR NOTIFICATIES
-- =====================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- 8. COMMENTS
-- =====================================================
COMMENT ON TABLE public.notifications IS 'Notificaties voor klanten over hun bestellingen';
COMMENT ON FUNCTION public.create_notification IS 'Maakt een nieuwe notificatie aan voor een gebruiker';
COMMENT ON FUNCTION public.handle_order_status_change IS 'Trigger functie voor automatische notificaties bij status wijziging';
COMMENT ON FUNCTION public.get_unread_notification_count IS 'Telt ongelezen notificaties voor een gebruiker';

