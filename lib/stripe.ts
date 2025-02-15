import { Platform } from 'react-native';
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabase';

// Initialize Stripe
export const stripe = await loadStripe(
  process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// Get Stripe payment intent
export async function createPaymentIntent(bookingId: string, amount: number) {
  try {
    const { data, error } = await supabase.functions.invoke('create-payment-intent', {
      body: { bookingId, amount }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

// Confirm payment
export async function confirmPayment(paymentIntentId: string) {
  try {
    const { data, error } = await supabase.functions.invoke('confirm-payment', {
      body: { paymentIntentId }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw error;
  }
}

// Create Stripe account for business
export async function createStripeAccount(businessId: string) {
  try {
    const { data, error } = await supabase.functions.invoke('create-stripe-account', {
      body: { businessId }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating Stripe account:', error);
    throw error;
  }
}