-- Create notifications system for order updates and admin messages
-- Migration: 20260113190000

-- 1. Add external_notes column to orders table
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS external_notes TEXT;

COMMENT ON COLUMN public.orders.external_notes IS 'External notes from admin visible to customers with accounts.';

-- 2. Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('order_status', 'order_note', 'order_shipped', 'order_delivered', 'system')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_order_id ON public.notifications(order_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notifications
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Service role can insert notifications" ON public.notifications;

CREATE POLICY "Users can view their own notifications" ON public.notifications
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert notifications" ON public.notifications
FOR INSERT WITH CHECK (true);

-- 3. Create function to send notification
CREATE OR REPLACE FUNCTION public.create_notification(
    p_user_id UUID,
    p_order_id UUID,
    p_type TEXT,
    p_title TEXT,
    p_message TEXT,
    p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_notification_id UUID;
BEGIN
    -- Only create notification if user_id is not null (user has account)
    IF p_user_id IS NULL THEN
        RETURN NULL;
    END IF;

    INSERT INTO public.notifications (
        user_id,
        order_id,
        type,
        title,
        message,
        metadata
    ) VALUES (
        p_user_id,
        p_order_id,
        p_type,
        p_title,
        p_message,
        p_metadata
    )
    RETURNING id INTO v_notification_id;

    RETURN v_notification_id;
END;
$$;

-- 4. Create function to mark notifications as read
CREATE OR REPLACE FUNCTION public.mark_notifications_read(p_notification_ids UUID[])
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.notifications
    SET read = true,
        read_at = now()
    WHERE id = ANY(p_notification_ids)
        AND user_id = auth.uid();
END;
$$;

-- 5. Create function to mark all notifications as read
CREATE OR REPLACE FUNCTION public.mark_all_notifications_read()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.notifications
    SET read = true,
        read_at = now()
    WHERE user_id = auth.uid()
        AND read = false;
END;
$$;

-- 6. Create trigger function for order status changes
CREATE OR REPLACE FUNCTION public.notify_order_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_title TEXT;
    v_message TEXT;
    v_type TEXT;
BEGIN
    -- Only notify if user_id exists (user has account)
    IF NEW.user_id IS NULL THEN
        RETURN NEW;
    END IF;

    -- Only notify on status changes
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        -- Set notification title and message based on status
        CASE NEW.status
            WHEN 'confirmed' THEN
                v_title := 'Order bevestigd';
                v_message := 'Je bestelling ' || NEW.order_number || ' is bevestigd en wordt verwerkt.';
                v_type := 'order_status';
            WHEN 'processing' THEN
                v_title := 'Order wordt verwerkt';
                v_message := 'Je bestelling ' || NEW.order_number || ' wordt momenteel verwerkt.';
                v_type := 'order_status';
            WHEN 'shipped' THEN
                v_title := '📦 Order verzonden!';
                v_message := 'Je bestelling ' || NEW.order_number || ' is verzonden!';
                v_type := 'order_shipped';
            WHEN 'in_transit' THEN
                v_title := '🚚 Order onderweg';
                v_message := 'Je bestelling ' || NEW.order_number || ' is onderweg naar je toe.';
                v_type := 'order_status';
            WHEN 'delivered' THEN
                v_title := '✅ Order bezorgd!';
                v_message := 'Je bestelling ' || NEW.order_number || ' is bezorgd. Geniet ervan!';
                v_type := 'order_delivered';
            WHEN 'cancelled' THEN
                v_title := 'Order geannuleerd';
                v_message := 'Je bestelling ' || NEW.order_number || ' is geannuleerd.';
                v_type := 'order_status';
            WHEN 'refunded' THEN
                v_title := 'Order terugbetaald';
                v_message := 'Je bestelling ' || NEW.order_number || ' is terugbetaald.';
                v_type := 'order_status';
            ELSE
                -- Don't notify for other status changes
                RETURN NEW;
        END CASE;

        -- Create notification
        PERFORM public.create_notification(
            NEW.user_id,
            NEW.id,
            v_type,
            v_title,
            v_message,
            jsonb_build_object(
                'order_number', NEW.order_number,
                'old_status', OLD.status,
                'new_status', NEW.status
            )
        );
    END IF;

    -- Notify on external_notes change
    IF OLD.external_notes IS DISTINCT FROM NEW.external_notes AND NEW.external_notes IS NOT NULL AND NEW.external_notes != '' THEN
        PERFORM public.create_notification(
            NEW.user_id,
            NEW.id,
            'order_note',
            '💬 Nieuwe notitie bij je bestelling',
            'Er is een notitie toegevoegd aan je bestelling ' || NEW.order_number || '.',
            jsonb_build_object(
                'order_number', NEW.order_number,
                'note', NEW.external_notes
            )
        );
    END IF;

    RETURN NEW;
END;
$$;

-- 7. Create trigger for order updates
DROP TRIGGER IF EXISTS trigger_notify_order_changes ON public.orders;
CREATE TRIGGER trigger_notify_order_changes
    AFTER UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_order_status_change();

-- 8. Grant permissions
GRANT SELECT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;

