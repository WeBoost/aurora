import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface SEOData {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: 'summary' | 'summary_large_image';
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  structuredData: string;
}

export function useWebsiteSEO(businessId: string | undefined) {
  const [seoData, setSEOData] = useState<SEOData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!businessId) {
      setLoading(false);
      return;
    }

    const fetchSEO = async () => {
      try {
        const { data, error } = await supabase
          .from('website_seo')
          .select('*')
          .eq('business_id', businessId)
          .single();

        if (error) throw error;
        setSEOData(data);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchSEO();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('website_seo_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'website_seo',
          filter: `business_id=eq.${businessId}`,
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setSEOData(payload.new as SEOData);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [businessId]);

  const updateSEO = async (data: Partial<SEOData>) => {
    if (!businessId) throw new Error('Business ID is required');

    try {
      const { error } = await supabase
        .from('website_seo')
        .upsert({
          business_id: businessId,
          ...data,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'business_id',
        });

      if (error) throw error;
    } catch (e) {
      setError(e as Error);
      throw e;
    }
  };

  return {
    seoData,
    loading,
    error,
    updateSEO,
  };
}