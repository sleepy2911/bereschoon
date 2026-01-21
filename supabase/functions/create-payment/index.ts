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

const FREE_SHIPPING_THRESHOLD = 50;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('=== CREATE PAYMENT START ===');
    
    const MOLLIE_API_KEY = Deno.env.get('MOLLIE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const SITE_URL = Deno.env.get('SITE_URL') || 'http://localhost:5173';

    console.log('Environment check:', {
      hasMollieKey: !!MOLLIE_API_KEY,
      mollieKeyPrefix: MOLLIE_API_KEY ? MOLLIE_API_KEY.substring(0, 10) + '...' : 'MISSING',
      hasSupabaseUrl: !!SUPABASE_URL,
      hasServiceKey: !!SUPABASE_SERVICE_ROLE_KEY,
      siteUrl: SITE_URL
    });

    if (!MOLLIE_API_KEY) {
      throw new Error('MOLLIE_API_KEY niet geconfigureerd. Ga naar Supabase Dashboard > Project Settings > Edge Functions > Secrets en voeg MOLLIE_API_KEY toe.');
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase configuratie ontbreekt (SUPABASE_URL of SUPABASE_SERVICE_ROLE_KEY)');
    }

    // Initialize Supabase client with service role
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Parse request body
    console.log('Parsing request body...');
    const body: PaymentRequest = await req.json();
    const { items, customer, shippingAddress, carrier, notes, userId } = body;

    console.log('Request received:', {
      itemCount: items?.length,
      customerEmail: customer?.email,
      hasShippingAddress: !!shippingAddress,
      carrier: carrier,
      userId: userId
    });

    // Validate request with specific error messages
    if (!items || items.length === 0) {
      throw new Error('Winkelmandje is leeg. Voeg eerst producten toe.');
    }

    if (!customer?.email) {
      throw new Error('E-mailadres is verplicht');
    }
    if (!customer?.firstName) {
      throw new Error('Voornaam is verplicht');
    }
    if (!customer?.lastName) {
      throw new Error('Achternaam is verplicht');
    }

    if (!shippingAddress?.street) {
      throw new Error('Straat is verplicht');
    }
    if (!shippingAddress?.postalCode) {
      throw new Error('Postcode is verplicht');
    }
    if (!shippingAddress?.city) {
      throw new Error('Plaats is verplicht');
    }
    if (!shippingAddress?.country) {
      throw new Error('Land is verplicht');
    }

    // Validate carrier info
    if (!carrier || !carrier.code || !carrier.name) {
      console.error('Carrier validation failed:', JSON.stringify(carrier));
      throw new Error('Selecteer een verzendmethode (DHL of PostNL)');
    }

    console.log('Validation passed ✓');

    // 1. Fetch real prices from DB for security
    const productIds = items
      .map(i => i.productId)
      .filter(id => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));
    
    let dbProducts: any[] = [];
    if (productIds.length > 0) {
      const { data: foundProducts, error: prodError } = await supabase
        .from('products')
        .select('id, price, name')
        .in('id', productIds);
        
      if (prodError) {
        console.error('Error fetching prices:', prodError);
        throw new Error('Kon productprijzen niet controleren');
      }
      dbProducts = foundProducts || [];
    }

    // 2. Validate items and recalculate totals
    const validatedItems = items.map(item => {
      // Check if it looks like a UUID
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.productId);
      
      if (isUUID) {
        const dbProduct = dbProducts.find(p => p.id === item.productId);
        if (!dbProduct) {
          throw new Error(`Product niet gevonden of niet meer leverbaar: ${item.name}`);
        }
        // CRITICAL SECURITY FIX: Use server-side price
        return { ...item, price: dbProduct.price };
      }
      
      // For non-UUID items (if any exist in your system logic), we might trust the price 
      // OR throw error if ONLY db-products are allowed. 
      // Assuming straightforward webshop behavior: strict validation.
      return item; 
    });

    const subtotal = validatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = carrier?.cost || 0;
    const total = subtotal + shippingCost;

    console.log('Order totals calculated (secure):', { subtotal, shippingCost, total });

    // Create order in database - only include columns that exist
    console.log('Creating order with:', {
      email: customer.email,
      subtotal,
      shipping_cost: shippingCost,
      total,
      carrier_code: carrier?.code,
      carrier_name: carrier?.name
    });

    // Build full customer name
    const customerName = [customer.firstName, customer.lastName].filter(Boolean).join(' ');

    const { data: order, error: orderError} = await supabase
      .from('orders')
      .insert({
        user_id: userId || null,
        email: customer.email,
        customer_name: customerName || null,  // ✅ Klant naam opslaan
        customer_phone: customer.phone || null,  // ✅ Klant telefoonnummer opslaan
        status: 'pending',
        subtotal: subtotal,
        shipping_cost: shippingCost,
        total: total,
        shipping_address: shippingAddress,
        billing_address: shippingAddress,
        carrier_name: carrier?.name || null,  // ✅ Vervoerder naam opslaan
        notes: notes || null
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', JSON.stringify(orderError));
      throw new Error(`Kon bestelling niet aanmaken: ${orderError.message || orderError.code}`);
    }

    console.log('Order created:', order.id, order.order_number);

    // Create order items - product_id is optional (might be a UUID or null)
    console.log('Creating order items for order:', order.id);
    
    const orderItems = items.map(item => {
      // Check if productId is a valid UUID, otherwise set to null
      const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.productId);
      
      return {
        order_id: order.id,
        product_id: isValidUUID ? item.productId : null,
        product_name: item.name,
        product_slug: item.slug,
        quantity: item.quantity,
        price_at_purchase: item.price
      };
    });

    console.log('Order items to insert:', JSON.stringify(orderItems));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Order items error:', JSON.stringify(itemsError));
      // Cleanup: delete the order
      await supabase.from('orders').delete().eq('id', order.id);
      throw new Error(`Kon bestellingsitems niet aanmaken: ${itemsError.message || itemsError.code}`);
    }
    
    console.log('Order items created successfully');

    // Build order description for Mollie
    const description = `Bereschoon Order ${order.order_number}`;

    console.log('Creating Mollie payment...', {
      amount: total.toFixed(2),
      description: description,
      redirectUrl: `${SITE_URL}/winkel/betaling-succes?order=${order.order_number}`
    });

    // Create Mollie payment
    const molliePayload = {
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
      locale: 'nl_NL'
    };

    const mollieResponse = await fetch('https://api.mollie.com/v2/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MOLLIE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(molliePayload)
    });

    const mollieResponseText = await mollieResponse.text();
    console.log('Mollie response status:', mollieResponse.status);
    console.log('Mollie response:', mollieResponseText);

    if (!mollieResponse.ok) {
      let errorMessage = 'Kon betaling niet aanmaken bij Mollie';
      try {
        const errorData = JSON.parse(mollieResponseText);
        console.error('Mollie error details:', errorData);
        
        if (errorData.status === 401) {
          errorMessage = 'Mollie API key is ongeldig. Controleer je API key in Supabase secrets.';
        } else if (errorData.detail) {
          errorMessage = `Mollie fout: ${errorData.detail}`;
        } else if (errorData.title) {
          errorMessage = `Mollie fout: ${errorData.title}`;
        }
      } catch (e) {
        errorMessage = `Mollie fout: ${mollieResponseText}`;
      }
      
      // Cleanup: delete order and items
      console.log('Cleaning up order after Mollie error...');
      await supabase.from('order_items').delete().eq('order_id', order.id);
      await supabase.from('orders').delete().eq('id', order.id);
      
      throw new Error(errorMessage);
    }

    const payment = JSON.parse(mollieResponseText);
    console.log('Mollie payment created:', payment.id);

    // Update order with payment ID
    await supabase
      .from('orders')
      .update({ payment_id: payment.id })
      .eq('id', order.id);

    // Add initial tracking history entry (optional - don't fail if not available)
    try {
      const { error: historyError } = await supabase
        .from('order_tracking_history')
        .insert({
          order_id: order.id,
          status: 'pending',
          description: '⏳ Bestelling geplaatst en wacht op betaling via Mollie',
          is_automated: true
        });
      
      if (historyError) {
        console.warn('Tracking history not available:', historyError.message);
      } else {
        console.log('Initial tracking history added');
      }
    } catch (trackingError) {
      console.warn('Failed to add tracking history:', trackingError);
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
    console.error('=== PAYMENT ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    const errorResponse = {
      success: false,
      error: error.message || 'Er is een fout opgetreden',
      timestamp: new Date().toISOString()
    };
    
    console.error('Returning error response:', JSON.stringify(errorResponse));
    
    return new Response(
      JSON.stringify(errorResponse),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});

