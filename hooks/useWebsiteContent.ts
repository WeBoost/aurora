import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useWebsiteContent(businessId: string | undefined) {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!businessId) {
      setLoading(false);
      return;
    }

    const fetchSections = async () => {
      try {
        const { data, error } = await supabase
          .from('website_content')
          .select('*')
          .eq('business_id', businessId)
          .order('order');

        if (error) throw error;
        setSections(data || []);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();

    // Subscribe to real-time updates
    const subscription = supabase
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
            setSections((current) => [...current, payload.new]);
          } else if (payload.eventType === 'UPDATE') {
            setSections((current) =>
              current.map((section) =>
                section.id === payload.new.id ? payload.new : section
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setSections((current) =>
              current.filter((section) => section.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [businessId]);

  const addSection = async (type: string) => {
    if (!businessId) return;

    try {
      const { data, error } = await supabase
        .from('website_content')
        .insert([
          {
            business_id: businessId,
            type,
            content: getDefaultContent(type),
            order: sections.length,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      setSections([...sections, data]);
      return data;
    } catch (e) {
      throw e;
    }
  };

  const updateSection = async (sectionId: string, content: any) => {
    try {
      const { error } = await supabase
        .from('website_content')
        .update({ content })
        .eq('id', sectionId);

      if (error) throw error;
      setSections(sections.map(s => s.id === sectionId ? { ...s, content } : s));
    } catch (e) {
      throw e;
    }
  };

  const deleteSection = async (sectionId: string) => {
    try {
      const { error } = await supabase
        .from('website_content')
        .delete()
        .eq('id', sectionId);

      if (error) throw error;
      setSections(sections.filter(s => s.id !== sectionId));
    } catch (e) {
      throw e;
    }
  };

  function getDefaultContent(type: string) {
    switch (type) {
      case 'weather':
        return {
          title: 'Current Weather',
          description: 'Check the current weather and aurora forecast',
          showAuroraForecast: true,
          showSunTimes: true,
          compact: false,
        };
      case 'hero':
        return {
          heading: 'Welcome to Our Business',
          subheading: 'Discover what makes us unique',
          backgroundImage: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=2850&q=80',
          cta: {
            text: 'Learn More',
            url: '#',
          },
        };
      case 'features':
        return {
          title: 'Our Features',
          features: [
            {
              title: 'Feature 1',
              description: 'Description of feature 1',
              icon: 'star',
            },
          ],
        };
      case 'contact':
        return {
          title: 'Contact Us',
          email: '',
          phone: '',
          address: '',
        };
      default:
        return {};
    }
  }

  return {
    sections,
    loading,
    error,
    addSection,
    updateSection,
    deleteSection,
  };
}