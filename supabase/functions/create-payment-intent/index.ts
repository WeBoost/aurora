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
    const { amount, bookingId, paymentId } = await req.json();

    // Get booking and business details
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        *,
        business:businesses (
          id,
          stripe_account_id,
          name,
          commission_rate
        )
      `)
      .eq('id', bookingId)
      .single();

    if (bookingError) throw bookingError;
    if (!booking) throw new Error('Booking not found');
    if (!booking.business?.stripe_account_id) throw new Error('Business not configured for payments');

    // Calculate amounts using business's commission rate
    const commissionRate = booking.business.commission_rate;
    const platformAmount = Math.floor(amount * (commissionRate / 100));
    const businessAmount = amount - platformAmount;

    // Create payment intent with dynamic fee splitting
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'isk',
      payment_method_types: ['card'],
      metadata: {
        bookingId,
        paymentId,
        businessId: booking.business.id,
        commissionRate,
      },
      application_fee_amount: platformAmount,
      transfer_data: {
        destination: booking.business.stripe_account_id,
      },
    });

    return new Response(
      JSON.stringify({
        id: paymentIntent.id,
        client_secret: paymentIntent.client_secret,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
      }),
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