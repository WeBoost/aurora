import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface TravelTimeOptions {
  origin: {
    latitude: number;
    longitude: number;
  };
  destination: {
    latitude: number;
    longitude: number;
  };
  mode: 'walking' | 'driving';
}

export function useTravelTime() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const calculateTime = async ({ origin, destination, mode }: TravelTimeOptions) => {
    try {
      setLoading(true);
      setError(null);

      // Call Mapbox API via Edge Function
      const { data, error } = await supabase.functions.invoke('calculate-travel-time', {
        body: {
          origin,
          destination,
          mode,
        },
      });

      if (error) throw error;
      return data;
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return {
    calculateTime,
    loading,
    error,
  };
}