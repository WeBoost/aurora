import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface LocationSEOPage {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: any;
  meta_tags: any;
  service_id: string | null;
  location_id: string;
  business_id: string;
  published: boolean;
  service?: {
    name: string;
    description: string;
  };
  location?: {
    name: string;
    type: string;
  };
}

export function useLocationSEO(locationId: string | undefined) {
  const [pages, setPages] = useState<LocationSEOPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!locationId) {
      setLoading(false);
      return;
    }

    const fetchPages = async () => {
      try {
        const { data, error } = await supabase
          .from('seo_pages')
          .select(`
            *,
            service:services (name, description),
            location:locations (name, type)
          `)
          .eq('location_id', locationId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPages(data || []);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();

    // Subscribe to changes
    const subscription = supabase
      .channel('location_seo_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'seo_pages',
          filter: `location_id=eq.${locationId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setPages(current => [payload.new as LocationSEOPage, ...current]);
          } else if (payload.eventType === 'UPDATE') {
            setPages(current =>
              current.map(page =>
                page.id === payload.new.id ? payload.new as LocationSEOPage : page
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setPages(current =>
              current.filter(page => page.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [locationId]);

  const generateSEOPage = async (serviceId: string, customData?: {
    title?: string;
    description?: string;
    content?: any;
  }) => {
    if (!locationId) throw new Error('Location ID is required');

    try {
      // First create the service-location association
      const { error: locationError } = await supabase
        .from('service_locations')
        .insert({
          service_id: serviceId,
          location_id: locationId,
          custom_title: customData?.title,
          custom_description: customData?.description,
          custom_content: customData?.content,
        });

      if (locationError) throw locationError;

      // The trigger will automatically create the SEO page
    } catch (e) {
      setError(e as Error);
      throw e;
    }
  };

  const updatePage = async (pageId: string, updates: Partial<LocationSEOPage>) => {
    try {
      const { error } = await supabase
        .from('seo_pages')
        .update(updates)
        .eq('id', pageId);

      if (error) throw error;
    } catch (e) {
      setError(e as Error);
      throw e;
    }
  };

  const deletePage = async (pageId: string) => {
    try {
      const { error } = await supabase
        .from('seo_pages')
        .delete()
        .eq('id', pageId);

      if (error) throw error;
    } catch (e) {
      setError(e as Error);
      throw e;
    }
  };

  return {
    pages,
    loading,
    error,
    generateSEOPage,
    updatePage,
    deletePage,
  };
}