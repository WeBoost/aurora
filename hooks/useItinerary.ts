import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface ItineraryItem {
  id: string;
  business_id: string;
  start_time: string;
  end_time: string;
  notes: string;
  travel_time_to_next?: number;
  business: {
    name: string;
    category: string;
    latitude: number;
    longitude: number;
  };
}

interface Itinerary {
  id: string;
  user_id: string;
  date: string;
  title: string;
  items: ItineraryItem[];
}

export function useItinerary(itineraryId?: string) {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!itineraryId) {
      setLoading(false);
      return;
    }

    const fetchItinerary = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('itineraries')
          .select(`
            *,
            items:itinerary_items (
              *,
              business:businesses (
                name,
                category,
                latitude,
                longitude
              )
            )
          `)
          .eq('id', itineraryId)
          .single();

        if (fetchError) throw fetchError;
        setItinerary(data);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchItinerary();
  }, [itineraryId]);

  const addItem = async (item: Omit<ItineraryItem, 'id'>) => {
    if (!itineraryId) throw new Error('Itinerary ID is required');

    try {
      const { error } = await supabase
        .from('itinerary_items')
        .insert({
          itinerary_id: itineraryId,
          ...item,
        });

      if (error) throw error;
    } catch (e) {
      setError(e as Error);
      throw e;
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('itinerary_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
    } catch (e) {
      setError(e as Error);
      throw e;
    }
  };

  const reorderItems = async (itemIds: string[]) => {
    try {
      const { error } = await supabase.rpc('reorder_itinerary_items', {
        p_itinerary_id: itineraryId,
        p_item_ids: itemIds,
      });

      if (error) throw error;
    } catch (e) {
      setError(e as Error);
      throw e;
    }
  };

  return {
    itinerary,
    loading,
    error,
    addItem,
    removeItem,
    reorderItems,
  };
}