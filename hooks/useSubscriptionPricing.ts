import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const SUBSCRIPTION_TIERS = {
  starter: {
    name: 'Starter',
    price: 9900, // 99.00 ISK
    commission: 5,
    features: [
      'Basic website builder',
      'Booking system',
      'Email support',
      '5% commission rate'
    ]
  },
  professional: {
    name: 'Professional',
    price: 19900, // 199.00 ISK
    commission: 3,
    features: [
      'Advanced website builder',
      'Custom domain',
      'Priority support',
      '3% commission rate'
    ]
  },
  enterprise: {
    name: 'Enterprise',
    price: 49900, // 499.00 ISK
    commission: 1,
    features: [
      'White-label solution',
      'API access',
      'Dedicated support',
      '1% commission rate'
    ]
  }
};

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS;

export function useSubscriptionPricing(businessId?: string) {
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>('starter');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!businessId) {
      setLoading(false);
      return;
    }

    const fetchSubscription = async () => {
      try {
        const { data, error } = await supabase
          .from('businesses')
          .select('package_type, commission_rate')
          .eq('id', businessId)
          .single();

        if (error) throw error;

        setCurrentTier(data.package_type as SubscriptionTier);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [businessId]);

  const updateSubscription = async (tier: SubscriptionTier) => {
    if (!businessId) throw new Error('Business ID is required');

    try {
      setLoading(true);
      const { error } = await supabase
        .from('businesses')
        .update({ package_type: tier })
        .eq('id', businessId);

      if (error) throw error;
      setCurrentTier(tier);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return {
    currentTier,
    updateSubscription,
    loading,
    error,
    pricing: SUBSCRIPTION_TIERS
  };
}