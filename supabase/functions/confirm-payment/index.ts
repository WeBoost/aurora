import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import Stripe from 'https://esm.sh/stripe@13.11.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  try {
    const { paymentIntentId } = await req.json();

    // Retrieve payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    const { bookingId, paymentId } = paymentIntent.metadata;

    // Update payment status
    await supabase
      .from('payments')
      .update({
        status: paymentIntent.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', paymentId);

    // Update booking payment status
    await supabase
      .from('bookings')
      .update({
        payment_status: paymentIntent.status === 'succeeded' ? 'paid' : 'failed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookingId);

    return new Response(
      JSON.stringify({ status: paymentIntent.status }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});