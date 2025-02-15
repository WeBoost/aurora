import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface PaymentIntent {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
}

export function usePayments() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createPaymentIntent = async (bookingId: string, amount: number) => {
    try {
      setLoading(true);
      setError(null);

      // Get booking and business details to determine commission rate
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .select(`
          *,
          business:businesses (
            id,
            commission_rate,
            package_type
          )
        `)
        .eq('id', bookingId)
        .single();

      if (bookingError) throw bookingError;
      if (!booking) throw new Error('Booking not found');

      // Calculate amounts based on business's commission rate
      const commissionRate = booking.business.commission_rate;
      const businessAmount = Math.floor(amount * (1 - commissionRate / 100));
      const platformAmount = amount - businessAmount;

      // Create payment record
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          booking_id: bookingId,
          business_id: booking.business.id,
          amount,
          business_amount: businessAmount,
          platform_amount: platformAmount,
          commission_rate: commissionRate,
          currency: 'ISK',
          status: 'pending'
        })
        .select()
        .single();

      if (paymentError) throw paymentError;

      // Create Stripe payment intent via Edge Function
      const { data: intent, error: stripeError } = await supabase
        .functions.invoke('create-payment-intent', {
          body: {
            amount,
            bookingId,
            paymentId: payment.id
          }
        });

      if (stripeError) throw stripeError;

      // Update payment with Stripe ID
      await supabase
        .from('payments')
        .update({
          stripe_payment_intent_id: intent.id
        })
        .eq('id', payment.id);

      return intent as PaymentIntent;
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const confirmPayment = async (paymentIntentId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .functions.invoke('confirm-payment', {
          body: { paymentIntentId }
        });

      if (error) throw error;
      return data;
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createPaymentIntent,
    confirmPayment
  };
}