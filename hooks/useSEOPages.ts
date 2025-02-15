import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface SEOPage {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: any;
  meta_tags: any;
  service_id: string;
  location_id: string;
  business_id: string;
  published: boolean;
}

export function useSEOPages(businessId: string | undefined) {
  const [pages, setPages] = useState<SEOPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!businessId) {
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
          .eq('business_id', businessId)
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
      .channel('seo_pages_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'seo_pages',
          filter: `business_id=eq.${businessId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setPages(current => [payload.new as SEOPage, ...current]);
          } else if (payload.eventType === 'UPDATE') {
            setPages(current =>
              current.map(page =>
                page.id === payload.new.id ? payload.new as SEOPage : page
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
  }, [businessId]);

  const updatePage = async (pageId: string, updates: Partial<SEOPage>) => {
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
    updatePage,
    deletePage,
  };
}