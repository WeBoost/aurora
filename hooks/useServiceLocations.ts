import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface ServiceLocation {
  id: string;
  service_id: string;
  location_id: string;
  custom_title: string | null;
  custom_description: string | null;
  custom_content: any;
  location?: {
    name: string;
    type: string;
  };
}

export function useServiceLocations(serviceId: string | undefined) {
  const [locations, setLocations] = useState<ServiceLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!serviceId) {
      setLoading(false);
      return;
    }

    const fetchLocations = async () => {
      try {
        const { data, error } = await supabase
          .from('service_locations')
          .select(`
            *,
            location:locations (name, type)
          `)
          .eq('service_id', serviceId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setLocations(data || []);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();

    // Subscribe to changes
    const subscription = supabase
      .channel('service_locations_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'service_locations',
          filter: `service_id=eq.${serviceId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setLocations(current => [payload.new as ServiceLocation, ...current]);
          } else if (payload.eventType === 'UPDATE') {
            setLocations(current =>
              current.map(loc =>
                loc.id === payload.new.id ? payload.new as ServiceLocation : loc
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setLocations(current =>
              current.filter(loc => loc.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [serviceId]);

  const addLocation = async (locationId: string, customData?: {
    title?: string;
    description?: string;
    content?: any;
  }) => {
    if (!serviceId) throw new Error('Service ID is required');

    try {
      const { error } = await supabase
        .from('service_locations')
        .insert({
          service_id: serviceId,
          location_id: locationId,
          custom_title: customData?.title,
          custom_description: customData?.description,
          custom_content: customData?.content,
        });

      if (error) throw error;
    } catch (e) {
      setError(e as Error);
      throw e;
    }
  };

  const removeLocation = async (locationId: string) => {
    if (!serviceId) throw new Error('Service ID is required');

    try {
      const { error } = await supabase
        .from('service_locations')
        .delete()
        .eq('service_id', serviceId)
        .eq('location_id', locationId);

      if (error) throw error;
    } catch (e) {
      setError(e as Error);
      throw e;
    }
  };

  return {
    locations,
    loading,
    error,
    addLocation,
    removeLocation,
  };
}