import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const MOLLIE_API_KEY = Deno.env.get('MOLLIE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!MOLLIE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Configuratie ontbreekt');
    }

    // Initialize Supabase client with service role
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Parse form data (Mollie sends as form-urlencoded)
    const formData = await req.formData();
    const paymentId = formData.get('id');

    if (!paymentId) {
      throw new Error('Payment ID ontbreekt');
    }

    console.log('Webhook received for payment:', paymentId);

    // Fetch payment details from Mollie
    const mollieResponse = await fetch(`https://api.mollie.com/v2/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${MOLLIE_API_KEY}`
      }
    });

    if (!mollieResponse.ok) {
      const errorData = await mollieResponse.json();
      console.error('Mollie fetch error:', errorData);
      throw new Error('Kon betaling niet ophalen van Mollie');
    }

    const payment = await mollieResponse.json();
    console.log('Payment status:', payment.status);

    // Extract order ID from metadata
    if (!orderId) {
      console.error('No order_id in payment metadata');
      throw new Error('Order ID ontbreekt in payment metadata');
    }

    // Prevent usage of invalid UUIDs via SQL injection attempts (UUID validation)
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId)) {
       throw new Error('Invalid Order ID format');
    }

    // Fetch current order status FIRST to ensure idempotency
    const { data: currentOrder, error: fetchError } = await supabase
       .from('orders')
       .select('status')
       .eq('id', orderId)
       .single();
    
    if (fetchError || !currentOrder) {
        console.error('Error fetching order for idempotency check:', fetchError);
        throw new Error('Order niet gevonden');
    }

    // IDEMPOTENCY CHECK: If already paid, stop duplicate processing
    // Only stop if we are trying to set it to paid again. If it's a refund/chargeback (cancelled), we might want to allow it?
    // The prompt/report specific issue was "stock corruption" on replay of "paid".
    if (currentOrder.status === 'paid' && payment.status === 'paid') {
        console.log(`Order ${orderId} reeds betaald. Stopping duplicate processing.`);
        return new Response(JSON.stringify({ success: true, message: 'Already processed' }), { headers: corsHeaders });
    }

    // Map Mollie status to our order status
    let orderStatus: string;
    let paidAt: string | null = null;

    switch (payment.status) {
      case 'paid':
        orderStatus = 'paid';
        paidAt = payment.paidAt || new Date().toISOString();
        break;
      case 'canceled':
      case 'cancelled':
        orderStatus = 'cancelled';
        break;
      case 'expired':
        orderStatus = 'cancelled';
        break;
      case 'failed':
        orderStatus = 'cancelled';
        break;
      case 'pending':
      case 'open':
        orderStatus = 'pending';
        break;
      default:
        console.log('Unknown payment status:', payment.status);
        orderStatus = 'pending';
    }

    // Update order in database
    const updateData: Record<string, any> = {
      status: orderStatus,
      payment_method: payment.method || null
    };

    if (paidAt) {
      updateData.paid_at = paidAt;
    }

    const { error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId);

    if (updateError) {
      console.error('Order update error:', updateError);
      throw new Error('Kon order status niet updaten');
    }

    console.log(`Order ${orderId} updated to status: ${orderStatus}`);

    // Add tracking history entry for status change
    try {
      let status = orderStatus;
      let description = '';
      
      switch (orderStatus) {
        case 'paid':
          status = 'confirmed';  // Beter voor klant: "Order bevestigd"
          description = '✅ Betaling succesvol ontvangen. Je bestelling is bevestigd en wordt voorbereid.';
          break;
        case 'cancelled':
          description = '❌ Bestelling geannuleerd of betaling mislukt.';
          break;
        case 'pending':
          description = '⏳ Wachten op betaling.';
          break;
        default:
          description = `Status gewijzigd naar: ${orderStatus}`;
      }

      const { error: historyError } = await supabase
        .from('order_tracking_history')
        .insert({
          order_id: orderId,
          status: status,
          description: description,
          is_automated: true
        });

      if (historyError) {
        console.error('Tracking history error:', historyError);
      }
    } catch (trackingError) {
      console.error('Failed to add tracking history:', trackingError);
      // Don't fail the webhook if tracking fails
    }

    // If payment is successful, update product stock
    if (orderStatus === 'paid') {
      // Fetch order items
      const { data: orderItems, error: itemsError } = await supabase
        .from('order_items')
        .select('product_id, quantity')
        .eq('order_id', orderId);

      if (!itemsError && orderItems) {
        // Update stock for each product
        for (const item of orderItems) {
          if (item.product_id) {
            await supabase.rpc('decrement_stock', {
              product_uuid: item.product_id,
              quantity: item.quantity
            }).catch(err => {
              console.error('Stock update error for product', item.product_id, err);
            });
          }
        }
      }

      // TODO: Send confirmation email to customer
      // This could be done via another edge function or service like Resend/SendGrid
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Webhook error:', error);
    
    // Return 200 even on error to prevent Mollie from retrying
    // (we log the error for debugging)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  }
});

