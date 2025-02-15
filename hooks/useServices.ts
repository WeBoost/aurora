import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Tables } from '@/lib/supabase';

type Service = Tables['services']['Row'];
type ServiceInsert = Tables['services']['Insert'];

export function useServices(businessId: string | undefined) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!businessId) {
      setLoading(false);
      return;
    }

    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('business_id', businessId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setServices(data || []);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel('services_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'services',
          filter: `business_id=eq.${businessId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setServices((current) => [payload.new as Service, ...current]);
          } else if (payload.eventType === 'UPDATE') {
            setServices((current) =>
              current.map((service) =>
                service.id === payload.new.id ? (payload.new as Service) : service
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setServices((current) =>
              current.filter((service) => service.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [businessId]);

  const createService = async (data: Omit<ServiceInsert, 'id' | 'business_id'>) => {
    if (!businessId) throw new Error('Business ID is required');

    const { data: newService, error } = await supabase
      .from('services')
      .insert([{ ...data, business_id: businessId }])
      .select()
      .single();

    if (error) throw error;
    return newService;
  };

  const updateService = async (id: string, data: Partial<ServiceInsert>) => {
    const { data: updatedService, error } = await supabase
      .from('services')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return updatedService;
  };

  const deleteService = async (id: string) => {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) throw error;
  };

  return {
    services,
    loading,
    error,
    createService,
    updateService,
    deleteService,
  };
}