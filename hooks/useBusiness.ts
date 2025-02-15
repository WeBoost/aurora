import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Tables } from '../lib/supabase';

type Business = Tables['businesses']['Row'];

export function useBusiness(businessId: string | undefined) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!businessId) {
      setLoading(false);
      return;
    }

    const fetchBusiness = async () => {
      try {
        const { data, error } = await supabase
          .from('businesses')
          .select(`
            *,
            business_hours (*),
            services (*)
          `)
          .eq('id', businessId)
          .single();

        if (error) throw error;
        setBusiness(data);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [businessId]);

  const updateBusiness = async (updates: Partial<Business>) => {
    try {
      const { error } = await supabase
        .from('businesses')
        .update(updates)
        .eq('id', businessId);

      if (error) throw error;
      setBusiness((prev) => prev ? { ...prev, ...updates } : null);
    } catch (e) {
      throw e;
    }
  };

  return {
    business,
    loading,
    error,
    updateBusiness,
  };
}