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

  try {
    const formData = await req.formData();
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const address = formData.get('address') as string | null;
    const phone = formData.get('phone') as string | null;
    const service = formData.get('service') as string | null;
    const photo = formData.get('photo') as File;

    console.log('Received submission:', { name, email, address, phone, service, hasPhoto: !!photo });

    // Validate required fields
    if (!name || !email || !photo) {
      console.error('Missing required fields');
      return new Response(
        JSON.stringify({ error: 'Naam, email en foto zijn verplicht' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate service value if provided (must be one of the allowed values or null/empty)
    const validServices = ['terras', 'gevel', 'dak', 'overig'];
    let validatedService: string | null = null;
    if (service && service.trim() !== '') {
      const serviceLower = service.trim().toLowerCase();
      if (validServices.includes(serviceLower)) {
        validatedService = serviceLower;
      } else {
        console.warn('Invalid service value provided:', service);
        // Don't fail, just set to null
        validatedService = null;
      }
    }
    
    // Log service value for debugging
    console.log('Service received:', service, 'Validated service:', validatedService);

    // Initialize Supabase client with service role key (bypasses RLS)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Generate unique filename
    const fileExt = photo.name.split('.').pop() || 'jpg';
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    // Upload photo to storage bucket
    const arrayBuffer = await photo.arrayBuffer();
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('driveway-photos')
      .upload(fileName, arrayBuffer, {
        contentType: photo.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return new Response(
        JSON.stringify({ error: 'Kon foto niet uploaden' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Photo uploaded:', uploadData.path);

    // Get public URL for the uploaded photo
    // Use the full path from uploadData, not just fileName
    const filePath = uploadData.path;
    console.log('File path from upload:', filePath);
    
    const { data: publicUrlData } = supabase.storage
      .from('driveway-photos')
      .getPublicUrl(filePath);

    const photoUrl = publicUrlData.publicUrl;
    console.log('Photo public URL:', photoUrl);
    console.log('Photo URL type:', typeof photoUrl);
    console.log('Photo URL length:', photoUrl?.length);
    
    // Verify URL is valid
    if (!photoUrl || photoUrl.trim() === '') {
      console.error('Invalid photo URL generated');
      // Clean up uploaded file
      await supabase.storage.from('driveway-photos').remove([filePath]);
      return new Response(
        JSON.stringify({ error: 'Kon foto URL niet genereren' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Ensure URL is a string
    const photoUrlString = String(photoUrl).trim();
    console.log('Final photo URL string:', photoUrlString);

    // Save to database with photo URL
    console.log('Attempting to save to database with photo_url:', photoUrlString);
    const insertData = {
      name: String(name).trim(),
      email: String(email).trim(),
      address: address ? String(address).trim() : null,
      phone: phone ? String(phone).trim() : null,
      service: validatedService,
      photo_url: photoUrlString,
    };
    console.log('Insert data:', JSON.stringify(insertData, null, 2));
    
    const { data: submission, error: dbError } = await supabase
      .from('driveway_submissions')
      .insert(insertData)
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      console.error('Error code:', dbError.code);
      console.error('Error message:', dbError.message);
      console.error('Error details:', JSON.stringify(dbError, null, 2));
      console.error('Error hint:', dbError.hint);
      // Try to delete the uploaded file if database insert fails
      try {
        await supabase.storage.from('driveway-photos').remove([filePath]);
        console.log('Cleaned up uploaded file after database error');
      } catch (cleanupError) {
        console.error('Failed to cleanup file:', cleanupError);
      }
      return new Response(
        JSON.stringify({ 
          error: 'Kon gegevens niet opslaan', 
          details: dbError.message,
          code: dbError.code 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Saved to database successfully');
    console.log('Submission ID:', submission.id);
    console.log('Submission data:', JSON.stringify(submission, null, 2));
    console.log('Photo URL in saved submission:', submission.photo_url);

    // Record generation cost
    try {
      const { error: costError } = await supabase
        .from('generation_costs')
        .insert({
          amount: 0.15,
          source: 'submission'
        });
      
      if (costError) {
        console.error('Failed to record generation cost:', costError);
      } else {
        console.log('Generation cost recorded');
      }
    } catch (costError) {
      console.error('Unexpected error recording generation cost:', costError);
    }

    // Forward to n8n webhook with photo URL instead of binary
    // Note: service is included in the webhook payload (from step 2 selection: terras, gevel, dak, or overig)
    const n8nWebhookUrl = Deno.env.get('N8N_WEBHOOK_URL');
    
    if (n8nWebhookUrl) {
      try {
        // Always include service in webhook payload (can be null if not provided or invalid)
        const webhookPayload = {
          submission_id: submission.id,
          name,
          email,
          address: address || null,
          phone: phone || null,
          service: validatedService || null, // Service choice from step 2 (terras, gevel, dak, or overig) - always included
          photo_url: photoUrlString,
        };
        
        console.log('Webhook payload with service:', JSON.stringify(webhookPayload, null, 2));

        console.log('Forwarding to n8n webhook with payload:', webhookPayload);
        
        const n8nResponse = await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookPayload),
        });

        if (!n8nResponse.ok) {
          console.error('n8n webhook error:', n8nResponse.status, await n8nResponse.text());
        } else {
          console.log('Successfully forwarded to n8n');
        }
      } catch (webhookError) {
        console.error('Error calling n8n webhook:', webhookError);
        // Don't fail the request if webhook fails - data is already saved
      }
    } else {
      console.warn('N8N_WEBHOOK_URL not configured');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Aanvraag succesvol ontvangen',
        submission_id: submission.id,
        photo_url: photoUrlString,
        saved_photo_url: submission.photo_url, // Verify what was actually saved
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Er is een onverwachte fout opgetreden' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
