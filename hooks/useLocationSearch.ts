import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useLocationSearch() {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const search = async (query: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: searchError } = await supabase
        .from('locations')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .order('population', { ascending: false })
        .limit(10);

      if (searchError) throw searchError;
      setLocations(data || []);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  };

  return {
    locations,
    loading,
    error,
    search,
  };
}