import { useState } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { stripe, createPaymentIntent, confirmPayment } from '../lib/stripe';
import { supabase } from '../lib/supabase';

interface PaymentFlowOptions {
  businessId: string;
  bookingId: string;
  amount: number;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function usePaymentFlow() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const processPayment = async ({
    businessId,
    bookingId,
    amount,
    onSuccess,
    onError
  }: PaymentFlowOptions) => {
    try {
      setLoading(true);
      setError(null);

      // Create payment intent
      const { clientSecret } = await createPaymentIntent(bookingId, amount);

      if (Platform.OS === 'web') {
        // Handle web payment flow
        const { error: stripeError } = await stripe!.confirmPayment({
          elements: null,
          clientSecret,
          confirmParams: {
            return_url: `${window.location.origin}/payment/success`,
          },
        });

        if (stripeError) throw stripeError;
      } else {
        // Handle native payment flow
        // Note: For native platforms, you'd need to implement a native payment UI
        throw new Error('Native payment flow not implemented');
      }

      onSuccess?.();
    } catch (e) {
      setError(e as Error);
      onError?.(e as Error);
    } finally {
      setLoading(false);
    }
  };

  return {
    processPayment,
    loading,
    error,
  };
}