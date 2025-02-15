import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Tables } from '@/lib/supabase';

type Website = Tables['websites']['Row'];
type WebsiteContent = Tables['website_content']['Row'];

interface UseWebsiteBuilderReturn {
  website: Website | null;
  content: WebsiteContent[];
  loading: boolean;
  error: Error | null;
  updateWebsite: (updates: Partial<Website>) => Promise<void>;
  updateContent: (sectionId: string, updates: Partial<WebsiteContent>) => Promise<void>;
  reorderContent: (orderedIds: string[]) => Promise<void>;
  addSection: (type: string) => Promise<void>;
  removeSection: (sectionId: string) => Promise<void>;
  publishWebsite: () => Promise<void>;
}

export function useWebsiteBuilder(businessId: string | undefined): UseWebsiteBuilderReturn {
  const [website, setWebsite] = useState<Website | null>(null);
  const [content, setContent] = useState<WebsiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!businessId) {
      setLoading(false);
      return;
    }

    const fetchWebsite = async () => {
      try {
        const [websiteResponse, contentResponse] = await Promise.all([
          supabase
            .from('websites')
            .select('*')
            .eq('business_id', businessId)
            .single(),
          supabase
            .from('website_content')
            .select('*')
            .eq('business_id', businessId)
            .order('order'),
        ]);

        if (websiteResponse.error) throw websiteResponse.error;
        if (contentResponse.error) throw contentResponse.error;

        setWebsite(websiteResponse.data);
        setContent(contentResponse.data || []);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchWebsite();

    // Subscribe to changes
    const websiteSubscription = supabase
      .channel('website_changes')
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

    const contentSubscription = supabase
      .channel('website_content_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'website_content',
          filter: `business_id=eq.${businessId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setContent((current) => [...current, payload.new as WebsiteContent]);
          } else if (payload.eventType === 'UPDATE') {
            setContent((current) =>
              current.map((section) =>
                section.id === payload.new.id ? (payload.new as WebsiteContent) : section
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setContent((current) =>
              current.filter((section) => section.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      websiteSubscription.unsubscribe();
      contentSubscription.unsubscribe();
    };
  }, [businessId]);

  const updateWebsite = useCallback(
    async (updates: Partial<Website>) => {
      if (!businessId || !website) throw new Error('Website not found');

      const { error } = await supabase
        .from('websites')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', website.id);

      if (error) throw error;
    },
    [businessId, website]
  );

  const updateContent = useCallback(
    async (sectionId: string, updates: Partial<WebsiteContent>) => {
      if (!businessId) throw new Error('Business ID is required');

      const { error } = await supabase
        .from('website_content')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', sectionId);

      if (error) throw error;
    },
    [businessId]
  );

  const reorderContent = useCallback(
    async (orderedIds: string[]) => {
      if (!businessId) throw new Error('Business ID is required');

      const updates = orderedIds.map((id, index) => ({
        id,
        order: index,
      }));

      const { error } = await supabase.from('website_content').upsert(updates);

      if (error) throw error;
    },
    [businessId]
  );

  const addSection = useCallback(
    async (type: string) => {
      if (!businessId) throw new Error('Business ID is required');

      const maxOrder = content.reduce((max, section) => Math.max(max, section.order), -1);

      const { error } = await supabase.from('website_content').insert({
        business_id: businessId,
        type,
        content: {},
        order: maxOrder + 1,
      });

      if (error) throw error;
    },
    [businessId, content]
  );

  const removeSection = useCallback(
    async (sectionId: string) => {
      const { error } = await supabase.from('website_content').delete().eq('id', sectionId);

      if (error) throw error;
    },
    []
  );

  const publishWebsite = useCallback(async () => {
    if (!businessId || !website) throw new Error('Website not found');

    const { error } = await supabase
      .from('websites')
      .update({
        status: 'published',
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', website.id);

    if (error) throw error;
  }, [businessId, website]);

  return {
    website,
    content,
    loading,
    error,
    updateWebsite,
    updateContent,
    reorderContent,
    addSection,
    removeSection,
    publishWebsite,
  };
}