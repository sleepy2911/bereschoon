import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Pricing Constants
const PRICES = {
    oprit: {
        base: 4.00,
        options: {
            invegen: 0.75,
            'preventieve-onkruid': 0.50, // "Preventieve zoutbehandeling"
            beschermlaag: 1.75
        }
    },
    gevel: {
        base: 7.00,
        options: {
            // 'gevelreiniging-optie': 0, // Standard
            gevelimpregnatie: 4.50
        }
    },
    onkruid: {
        base: 1.00,
        fixed: 40.00
    }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const logs: string[] = [];
  const addLog = (msg: string) => {
    console.log(msg);
    logs.push(msg);
  };

  try {
    const formData = await req.formData();
    
    // Extract fields matching service_requests schema
    const serviceType = formData.get('service_type') as string;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const companyName = formData.get('company_name') as string | null;
    const phone = formData.get('phone') as string;
    const streetAddress = formData.get('street_address') as string;
    const postcode = formData.get('postcode') as string;
    const city = formData.get('city') as string;
    const message = formData.get('message') as string;
    const squareMetersStr = formData.get('square_meters') as string;
    const serviceOptionsStr = formData.get('service_options') as string; // JSON string from frontend
    const servicePlan = formData.get('service_plan') as string;

    const squareMeters = parseFloat(squareMetersStr) || 0;
    
    let serviceOptions: string[] = [];
    try {
        serviceOptions = serviceOptionsStr ? JSON.parse(serviceOptionsStr) : [];
    } catch {
        serviceOptions = [];
    }

    addLog(`Received request: Service=${serviceType}, Area=${squareMeters}, Options=${serviceOptions.join(', ')}`);

    // Photos - handle array of files
    const photos: File[] = [];
    let i = 0;
    while (formData.get(`photo_${i}`)) {
        photos.push(formData.get(`photo_${i}`) as File);
        i++;
    }

    // Init Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Upload Photos
    const photoUrls: string[] = [];
    for (let j = 0; j < photos.length; j++) {
        const file = photos[j];
        const fileExt = file.name.split('.').pop() || 'jpg';
        const fileName = `ad-${Date.now()}-${j}.${fileExt}`;
        
        const { data, error } = await supabase.storage
            .from('service-request-photos')
            .upload(fileName, file, { contentType: file.type || 'image/jpeg' });
        
        if (!error && data) {
            const { data: { publicUrl } } = supabase.storage
                .from('service-request-photos')
                .getPublicUrl(fileName);
            photoUrls.push(publicUrl);
        }
    }

    // Pricing Calculation
    let totalPrice = 0;
    let breakdown: any[] = [];
    let messageCalc = '';

    if (squareMeters > 0) {
        if (serviceType === 'oprit-terras-terrein') {
            let rate = PRICES.oprit.base;
            breakdown.push({ item: 'Basisreiniging', rate: PRICES.oprit.base, amount: PRICES.oprit.base * squareMeters });
            
            if (serviceOptions.includes('invegen')) {
                rate += PRICES.oprit.options.invegen;
                breakdown.push({ item: 'Invegen', rate: PRICES.oprit.options.invegen, amount: PRICES.oprit.options.invegen * squareMeters });
            }
            if (serviceOptions.includes('preventieve-onkruid')) {
                rate += PRICES.oprit.options['preventieve-onkruid'];
                breakdown.push({ item: 'Preventieve behandeling', rate: PRICES.oprit.options['preventieve-onkruid'], amount: PRICES.oprit.options['preventieve-onkruid'] * squareMeters });
            }
            if (serviceOptions.includes('beschermlaag')) {
                rate += PRICES.oprit.options.beschermlaag;
                breakdown.push({ item: 'Beschermlaag', rate: PRICES.oprit.options.beschermlaag, amount: PRICES.oprit.options.beschermlaag * squareMeters });
            }
            
            totalPrice = rate * squareMeters;
            
        } else if (serviceType === 'gevelreiniging') {
            let rate = PRICES.gevel.base;
            breakdown.push({ item: 'Gevelreiniging', rate: PRICES.gevel.base, amount: PRICES.gevel.base * squareMeters });

            if (serviceOptions.includes('gevelimpregnatie')) {
                rate += PRICES.gevel.options.gevelimpregnatie;
                breakdown.push({ item: 'Gevelimpregnatie', rate: PRICES.gevel.options.gevelimpregnatie, amount: PRICES.gevel.options.gevelimpregnatie * squareMeters });
            }
            
            totalPrice = rate * squareMeters;

        } else if (serviceType === 'onkruidbeheersing') {
            totalPrice = (PRICES.onkruid.base * squareMeters) + PRICES.onkruid.fixed;
            breakdown.push({ item: 'Onkruidbeheersing', rate: PRICES.onkruid.base, amount: PRICES.onkruid.base * squareMeters });
            breakdown.push({ item: 'Materiaalkosten (vast)', amount: PRICES.onkruid.fixed });
        }
    }

    const quoteDetails = {
        total_excl_vat: totalPrice, // Assuming prices are excl VAT as per prompt "kost het X euro" usually implies base. Prompt didn't specify incl/excl. Assume check with user or default.
        currency: 'EUR',
        area: squareMeters,
        breakdown: breakdown
    };

    // Store in DB
    const { data: record, error: dbError } = await supabase
        .from('service_requests_ad')
        .insert({
            service_type: serviceType,
            name,
            email,
            company_name: companyName || null,
            phone,
            street_address: streetAddress,
            postcode,
            city,
            message,
            square_meters: squareMetersStr,
            photo_url: photoUrls.length > 0 ? JSON.stringify(photoUrls) : null,
            status: 'nieuw',
            service_options: serviceOptionsStr, // Store original string
            service_plan: servicePlan,
            quote_details: quoteDetails
        })
        .select('id')
        .single();

    if (dbError) {
        addLog(`DB Insert Error: ${dbError.message}`);
        throw dbError;
    }

    // Send to Webhook
    const webhookUrl = Deno.env.get('N8N_WEBHOOK_URL'); // User said "webhook vul ik in bij secrets"
    if (webhookUrl) {
        try {
            await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: record.id,
                    service_type: serviceType,
                    contact: { name, email, phone, address: `${streetAddress}, ${postcode} ${city}` },
                    quote: quoteDetails,
                    photos: photoUrls,
                    raw_options: serviceOptions,
                    plan: servicePlan
                })
            });
            addLog(`Webhook sent to ${webhookUrl}`);
        } catch (err) {
            addLog(`Webhook failed: ${err}`);
        }
    } else {
        addLog('No N8N_WEBHOOK_URL env var found');
    }

    return new Response(
        JSON.stringify({ 
            success: true, 
            quote: quoteDetails,
            message: 'Aanvraag succesvol verwerkt'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
        JSON.stringify({ error: error instanceof Error ? error.message : String(error), logs }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
