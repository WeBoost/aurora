import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Tables } from '../lib/supabase';

type Business = Tables['businesses']['Row'] & {
  rating?: number;
  price_level?: number;
};

interface SearchParams {
  query?: string;
  category?: string | null;
  sort?: string;
  location?: string;
  priceRange?: string[];
  rating?: number;
}

export function useBusinessSearch({ 
  query, 
  category, 
  sort,
  location,
  priceRange,
  rating 
}: SearchParams) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        setError(null);

        let queryBuilder = supabase
          .from('businesses')
          .select('*, services(*)', { count: 'exact' })
          .eq('status', 'active');

        // Apply search filters
        if (query) {
          queryBuilder = queryBuilder.or(
            `name.ilike.%${query}%,description.ilike.%${query}%`
          );
        }

        if (category) {
          queryBuilder = queryBuilder.eq('category', category);
        }

        if (location) {
          queryBuilder = queryBuilder.eq('city', location);
        }

        if (priceRange && priceRange.length > 0) {
          queryBuilder = queryBuilder.in('price_level', priceRange);
        }

        if (rating) {
          queryBuilder = queryBuilder.gte('rating', rating);
        }

        // Apply sorting
        switch (sort) {
          case 'rating':
            queryBuilder = queryBuilder.order('rating', { ascending: false });
            break;
          case 'price_low':
            queryBuilder = queryBuilder.order('price_level', { ascending: true });
            break;
          case 'price_high':
            queryBuilder = queryBuilder.order('price_level', { ascending: false });
            break;
          default:
            queryBuilder = queryBuilder.order('created_at', { ascending: false });
        }

        const { data, error: fetchError, count } = await queryBuilder;

        if (fetchError) throw fetchError;

        // Add mock rating and price level for demo
        const enhancedData = data?.map(business => ({
          ...business,
          rating: Math.random() * 2 + 3, // Random rating between 3 and 5
          price_level: Math.floor(Math.random() * 3) + 1, // Random price level between 1 and 3
        }));

        setBusinesses(enhancedData || []);
        setTotal(count || 0);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [query, category, sort, location, priceRange, rating]);

  return {
    businesses,
    loading,
    error,
    total,
  };
}