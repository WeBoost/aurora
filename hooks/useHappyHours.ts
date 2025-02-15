import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface HappyHour {
  id: string;
  business_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  description: string;
  deals: {
    type: string;
    description: string;
    discount: number;
  }[];
  business: {
    name: string;
    category: string;
    city: string;
    latitude: number;
    longitude: number;
  };
}

export function useHappyHours(options?: {
  day?: number;
  time?: string;
  location?: {
    latitude: number;
    longitude: number;
    radius?: number;
  };
}) {
  const [happyHours, setHappyHours] = useState<HappyHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchHappyHours = async () => {
      try {
        let query = supabase
          .from('happy_hours')
          .select(`
            *,
            business:businesses (
              name,
              category,
              city,
              latitude,
              longitude
            )
          `);

        if (options?.day !== undefined) {
          query = query.eq('day_of_week', options.day);
        }

        if (options?.location) {
          const { latitude, longitude, radius = 5000 } = options.location;
          query = query.rpc('nearby_businesses', {
            lat: latitude,
            lng: longitude,
            radius_meters: radius,
          });
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        setHappyHours(data || []);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchHappyHours();
  }, [options]);

  return {
    happyHours,
    loading,
    error,
  };
}