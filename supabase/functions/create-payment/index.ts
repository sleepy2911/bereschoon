import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CartItem {
  productId: string;
  name: string;
  slug: string;
  quantity: number;
  price: number;
}

interface CustomerInfo {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface ShippingAddress {
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  country: string;
}

interface CarrierInfo {
  code: string;
  name: string;
  cost: number;
}

interface PaymentRequest {
  items: CartItem[];
  customer: CustomerInfo;
  shippingAddress: ShippingAddress;
  carrier: CarrierInfo;
  notes?: string;
  userId?: string;
}

// Shipping costs per country
const SHIPPING_RATES: Record<string, number> = {
  'NL': 4.95,
  'BE': 5.95,
  'LU': 6.95
};

const FREE_SHIPPING_THRESHOLD = 50;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const MOLLIE_API_KEY = Deno.env.get('MOLLIE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const SITE_URL = Deno.env.get('SITE_URL') || 'http://localhost:5173';

    if (!MOLLIE_API_KEY) {
      throw new Error('MOLLIE_API_KEY niet geconfigureerd');
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase configuratie ontbreekt');
    }

    // Initialize Supabase client with service role
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Parse request body
    const body: PaymentRequest = await req.json();
    const { items, customer, shippingAddress, carrier, notes, userId } = body;

    // Validate request
    if (!items || items.length === 0) {
      throw new Error('Winkelmandje is leeg');
    }

    if (!customer?.email || !customer?.firstName || !customer?.lastName) {
      throw new Error('Klantgegevens zijn onvolledig');
    }

    if (!shippingAddress?.street || !shippingAddress?.postalCode || !shippingAddress?.city || !shippingAddress?.country) {
      throw new Error('Verzendadres is onvolledig');
    }

    // Check if country is supported
    if (!SHIPPING_RATES[shippingAddress.country]) {
      throw new Error(`Verzending naar ${shippingAddress.country} wordt niet ondersteund`);
    }

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = carrier?.cost || 0;
    const total = subtotal + shippingCost;

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId || null,
        email: customer.email,
        status: 'pending',
        subtotal: subtotal,
        shipping_cost: shippingCost,
        total: total,
        shipping_address: shippingAddress,
        billing_address: shippingAddress, // Same as shipping for now
        chosen_carrier_code: carrier?.code || null,
        chosen_carrier_name: carrier?.name || null,
        notes: notes || null
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      throw new Error('Kon bestelling niet aanmaken');
    }

    // Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.name,
      product_slug: item.slug,
      quantity: item.quantity,
      price_at_purchase: item.price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Order items error:', itemsError);
      // Cleanup: delete the order
      await supabase.from('orders').delete().eq('id', order.id);
      throw new Error('Kon bestellingsitems niet aanmaken');
    }

    // Build order description for Mollie
    const description = `Bereschoon Order ${order.order_number}`;

    // Create Mollie payment
    const mollieResponse = await fetch('https://api.mollie.com/v2/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MOLLIE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: {
          currency: 'EUR',
          value: total.toFixed(2)
        },
        description: description,
        redirectUrl: `${SITE_URL}/winkel/betaling-succes?order=${order.order_number}`,
        cancelUrl: `${SITE_URL}/winkel/betaling-mislukt?reason=cancelled`,
        webhookUrl: `${SUPABASE_URL}/functions/v1/mollie-webhook`,
        metadata: {
          order_id: order.id,
          order_number: order.order_number
        },
        locale: 'nl_NL',
        method: ['ideal', 'bancontact', 'creditcard', 'paypal', 'applepay', 'googlepay']
      })
    });

    if (!mollieResponse.ok) {
      const errorData = await mollieResponse.json();
      console.error('Mollie error:', errorData);
      // Cleanup: delete order and items
      await supabase.from('order_items').delete().eq('order_id', order.id);
      await supabase.from('orders').delete().eq('id', order.id);
      throw new Error(errorData.detail || 'Kon betaling niet aanmaken');
    }

    const payment = await mollieResponse.json();

    // Update order with payment ID
    await supabase
      .from('orders')
      .update({ payment_id: payment.id })
      .eq('id', order.id);

    // Add initial tracking history entry
    try {
      await supabase.rpc('add_tracking_history', {
        p_order_id: order.id,
        p_status: 'pending',
        p_description: 'Bestelling geplaatst en wacht op betaling',
        p_is_automated: true
      });
    } catch (trackingError) {
      console.error('Failed to add tracking history:', trackingError);
      // Don't fail the order creation if tracking fails
    }

    // Return checkout URL with tracking code
    return new Response(
      JSON.stringify({
        success: true,
        checkoutUrl: payment._links.checkout.href,
        orderId: order.id,
        orderNumber: order.order_number,
        trackingCode: order.tracking_code,
        trackingLink: order.tracking_link
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Payment creation error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Er is een fout opgetreden'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});

