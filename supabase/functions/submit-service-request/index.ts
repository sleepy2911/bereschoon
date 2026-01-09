import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const logs: string[] = [];
  const addLog = (msg: string) => {
    console.log(msg);
    logs.push(msg);
  };

  try {
    addLog('Step 1: Parsing form data...');
    
    let formData: FormData;
    try {
      formData = await req.formData();
      addLog('Step 1: SUCCESS - Form data parsed');
    } catch (e) {
      addLog(`Step 1: FAILED - ${e}`);
      return new Response(
        JSON.stringify({ error: 'Kon formulier niet lezen', details: String(e), logs }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Extract form fields
    const serviceType = formData.get('service_type') as string | null;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string | null;
    const streetAddress = formData.get('street_address') as string | null;
    const postcode = formData.get('postcode') as string | null;
    const city = formData.get('city') as string | null;
    const message = formData.get('message') as string | null;
    const squareMeters = formData.get('square_meters') as string | null;
    const serviceOptions = formData.get('service_options') as string | null;
    const servicePlan = formData.get('service_plan') as string | null;
    
    addLog(`Step 2: Extracted fields - name: ${name}, email: ${email}, serviceType: ${serviceType}`);

    // Extract all photo files
    const photos: File[] = [];
    for (let i = 0; i < 10; i++) {
      const photo = formData.get(`photo_${i}`) as File | null;
      if (photo && photo.size > 0) {
        photos.push(photo);
        addLog(`Found photo ${i}: ${photo.name} (${photo.size} bytes)`);
      }
    }
    addLog(`Step 2: Found ${photos.length} photos`);

    // Validate required fields
    if (!name || !email) {
      addLog('Step 3: FAILED - Missing name or email');
      return new Response(
        JSON.stringify({ error: 'Naam en e-mailadres zijn verplicht', logs }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    addLog('Step 3: Validation passed');

    // Initialize Supabase client
    addLog('Step 4: Initializing Supabase client...');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      addLog(`Step 4: FAILED - Missing env vars. URL: ${!!supabaseUrl}, Key: ${!!supabaseServiceKey}`);
      return new Response(
        JSON.stringify({ error: 'Server configuratie fout - missing env vars', logs }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    addLog(`Step 4: SUCCESS - Supabase URL: ${supabaseUrl}`);

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Test database connection first
    addLog('Step 5: Testing database connection...');
    try {
      const { data: testData, error: testError } = await supabase
        .from('service_requests')
        .select('id')
        .limit(1);
      
      if (testError) {
        addLog(`Step 5: FAILED - ${testError.message} (code: ${testError.code})`);
        return new Response(
          JSON.stringify({ 
            error: 'Database connectie mislukt', 
            details: testError.message,
            code: testError.code,
            logs 
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      addLog(`Step 5: SUCCESS - Database connected, found ${testData?.length || 0} existing records`);
    } catch (e) {
      addLog(`Step 5: EXCEPTION - ${e}`);
      return new Response(
        JSON.stringify({ error: 'Database test exception', details: String(e), logs }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Upload photos to storage (if any)
    addLog('Step 6: Uploading photos...');
    const photoUrls: string[] = [];
    
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      addLog(`Step 6.${i}: Uploading ${photo.name}...`);
      
      try {
        const fileExt = photo.name.split('.').pop() || 'jpg';
        const fileName = `${Date.now()}-${i}.${fileExt}`;
        
        const arrayBuffer = await photo.arrayBuffer();
        addLog(`Step 6.${i}: Got array buffer (${arrayBuffer.byteLength} bytes)`);
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('service-request-photos')
          .upload(fileName, arrayBuffer, {
            contentType: photo.type || 'image/jpeg',
            upsert: false,
          });

        if (uploadError) {
          addLog(`Step 6.${i}: Upload FAILED - ${uploadError.message}`);
          // Continue with other photos, don't fail the whole request
        } else {
          addLog(`Step 6.${i}: Upload SUCCESS - path: ${uploadData?.path}`);
          
          const { data: publicUrlData } = supabase.storage
            .from('service-request-photos')
            .getPublicUrl(fileName);
          
          if (publicUrlData?.publicUrl) {
            photoUrls.push(publicUrlData.publicUrl);
            addLog(`Step 6.${i}: Public URL: ${publicUrlData.publicUrl}`);
          }
        }
      } catch (e) {
        addLog(`Step 6.${i}: EXCEPTION - ${e}`);
      }
    }
    addLog(`Step 6: Completed - ${photoUrls.length} photos uploaded successfully`);

    // Build insert data
    addLog('Step 7: Building insert data...');
    const insertData = {
      service_type: serviceType?.trim() || null,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      street_address: streetAddress?.trim() || null,
      postcode: postcode?.trim() || null,
      city: city?.trim() || null,
      message: message?.trim() || null,
      square_meters: squareMeters?.trim() || null,
      photo_url: photoUrls.length > 0 ? JSON.stringify(photoUrls) : null,
      status: 'nieuw',
      service_options: serviceOptions || null,
      service_plan: servicePlan?.trim() || null
    };
    addLog(`Step 7: Insert data prepared: ${JSON.stringify(insertData)}`);

    // Insert into database
    addLog('Step 8: Inserting into database...');
    const { data, error: dbError } = await supabase
      .from('service_requests')
      .insert(insertData)
      .select('id')
      .single();

    if (dbError) {
      addLog(`Step 8: INSERT FAILED`);
      addLog(`  - Message: ${dbError.message}`);
      addLog(`  - Code: ${dbError.code}`);
      addLog(`  - Details: ${dbError.details}`);
      addLog(`  - Hint: ${dbError.hint}`);
      
      return new Response(
        JSON.stringify({ 
          error: 'Database insert mislukt', 
          message: dbError.message,
          code: dbError.code,
          details: dbError.details,
          hint: dbError.hint,
          logs 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    addLog(`Step 8: SUCCESS - Record created with ID: ${data?.id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Aanvraag succesvol ontvangen',
        request_id: data?.id,
        photo_count: photoUrls.length,
        photo_urls: photoUrls,
        logs
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    addLog(`UNEXPECTED ERROR: ${error}`);
    return new Response(
      JSON.stringify({ 
        error: 'Onverwachte fout',
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        logs
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
