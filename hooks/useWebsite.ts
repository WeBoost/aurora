import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Website {
  id: string;
  business_id: string;
  template_id: string;
  subdomain: string;
  custom_domain: string | null;
  status: 'active' | 'building' | 'error';
  created_at: string;
  updated_at: string;
}

interface WebsiteUpdate {
  template_id: string;
  custom_domain: string | null;
  subdomain: string;
}

export function useWebsite(businessId: string | undefined) {
  const [website, setWebsite] = useState<Website | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!businessId) {
      setLoading(false);
      return;
    }

    const fetchWebsite = async () => {
      try {
        const { data, error } = await supabase
          .from('websites')
          .select('*')
          .eq('business_id', businessId)
          .single();

        if (error) throw error;
        setWebsite(data);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchWebsite();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel('websites_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'websites',
          filter: `business_id=eq.${businessId}`,
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setWebsite(payload.new as Website);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [businessId]);

  const updateWebsite = async (data: WebsiteUpdate) => {
    if (!businessId) throw new Error('Business ID is required');

    const { data: updatedWebsite, error } = await supabase
      .from('websites')
      .upsert(
        {
          business_id: businessId,
          ...data,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'business_id' }
      )
      .select()
      .single();

    if (error) throw error;
    return updatedWebsite;
  };

  return {
    website,
    loading,
    error,
    updateWebsite,
  };
}