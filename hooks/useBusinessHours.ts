import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Tables } from '@/lib/supabase';

type BusinessHours = Tables['business_hours']['Row'];
type SpecialHours = Tables['business_special_hours']['Row'];

interface UseBusinessHoursReturn {
  regularHours: BusinessHours[];
  specialHours: SpecialHours[];
  loading: boolean;
  error: Error | null;
  updateRegularHours: (dayOfWeek: number, updates: Partial<BusinessHours>) => Promise<void>;
  updateSpecialHours: (date: string, updates: Partial<SpecialHours>) => Promise<void>;
  deleteSpecialHours: (id: string) => Promise<void>;
}

export function useBusinessHours(businessId: string | undefined): UseBusinessHoursReturn {
  const [regularHours, setRegularHours] = useState<BusinessHours[]>([]);
  const [specialHours, setSpecialHours] = useState<SpecialHours[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!businessId) {
      setLoading(false);
      return;
    }

    const fetchHours = async () => {
      try {
        const [regularResponse, specialResponse] = await Promise.all([
          supabase
            .from('business_hours')
            .select('*')
            .eq('business_id', businessId)
            .order('day_of_week'),
          supabase
            .from('business_special_hours')
            .select('*')
            .eq('business_id', businessId)
            .gte('date', new Date().toISOString().split('T')[0])
            .order('date'),
        ]);

        if (regularResponse.error) throw regularResponse.error;
        if (specialResponse.error) throw specialResponse.error;

        setRegularHours(regularResponse.data || []);
        setSpecialHours(specialResponse.data || []);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchHours();

    // Subscribe to changes
    const regularSubscription = supabase
      .channel('business_hours_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'business_hours',
          filter: `business_id=eq.${businessId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            setRegularHours((current) => {
              const index = current.findIndex((h) => h.day_of_week === payload.new.day_of_week);
              if (index === -1) {
                return [...current, payload.new as BusinessHours];
              }
              return current.map((h) =>
                h.day_of_week === payload.new.day_of_week ? (payload.new as BusinessHours) : h
              );
            });
          }
        }
      )
      .subscribe();

    const specialSubscription = supabase
      .channel('special_hours_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'business_special_hours',
          filter: `business_id=eq.${businessId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setSpecialHours((current) => [...current, payload.new as SpecialHours]);
          } else if (payload.eventType === 'UPDATE') {
            setSpecialHours((current) =>
              current.map((h) => (h.id === payload.new.id ? (payload.new as SpecialHours) : h))
            );
          } else if (payload.eventType === 'DELETE') {
            setSpecialHours((current) => current.filter((h) => h.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      regularSubscription.unsubscribe();
      specialSubscription.unsubscribe();
    };
  }, [businessId]);

  const updateRegularHours = useCallback(
    async (dayOfWeek: number, updates: Partial<BusinessHours>) => {
      if (!businessId) throw new Error('Business ID is required');

      const { error } = await supabase
        .from('business_hours')
        .upsert({
          business_id: businessId,
          day_of_week: dayOfWeek,
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('business_id', businessId)
        .eq('day_of_week', dayOfWeek);

      if (error) throw error;
    },
    [businessId]
  );

  const updateSpecialHours = useCallback(
    async (date: string, updates: Partial<SpecialHours>) => {
      if (!businessId) throw new Error('Business ID is required');

      const { error } = await supabase
        .from('business_special_hours')
        .upsert({
          business_id: businessId,
          date,
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('business_id', businessId)
        .eq('date', date);

      if (error) throw error;
    },
    [businessId]
  );

  const deleteSpecialHours = useCallback(
    async (id: string) => {
      const { error } = await supabase.from('business_special_hours').delete().eq('id', id);

      if (error) throw error;
    },
    []
  );

  return {
    regularHours,
    specialHours,
    loading,
    error,
    updateRegularHours,
    updateSpecialHours,
    deleteSpecialHours,
  };
}