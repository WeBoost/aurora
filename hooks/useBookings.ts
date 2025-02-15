import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Tables } from '@/lib/supabase';

type Booking = Tables['bookings']['Row'] & {
  service?: Tables['services']['Row'];
};

interface UseBookingsReturn {
  bookings: Booking[];
  loading: boolean;
  error: Error | null;
  updateBookingStatus: (id: string, status: string) => Promise<void>;
  getBookingsByDate: (date: string) => Booking[];
  stats: {
    pending: number;
    confirmed: number;
    cancelled: number;
    completed: number;
    totalRevenue: number;
  };
}

export function useBookings(businessId: string | undefined): UseBookingsReturn {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!businessId) {
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            service:services (*)
          `)
          .eq('business_id', businessId)
          .order('booking_date', { ascending: true })
          .order('start_time', { ascending: true });

        if (error) throw error;
        setBookings(data || []);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();

    // Subscribe to changes
    const subscription = supabase
      .channel('bookings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `business_id=eq.${businessId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBookings((current) => [...current, payload.new as Booking]);
          } else if (payload.eventType === 'UPDATE') {
            setBookings((current) =>
              current.map((booking) =>
                booking.id === payload.new.id ? (payload.new as Booking) : booking
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setBookings((current) =>
              current.filter((booking) => booking.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [businessId]);

  const updateBookingStatus = useCallback(
    async (id: string, status: string) => {
      const { error } = await supabase
        .from('bookings')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    []
  );

  const getBookingsByDate = useCallback(
    (date: string) => {
      return bookings.filter((booking) => booking.booking_date === date);
    },
    [bookings]
  );

  const stats = bookings.reduce(
    (acc, booking) => {
      acc[booking.status as keyof typeof acc]++;
      if (booking.status !== 'cancelled' && booking.payment_status === 'paid') {
        acc.totalRevenue += Number(booking.total_amount);
      }
      return acc;
    },
    {
      pending: 0,
      confirmed: 0,
      cancelled: 0,
      completed: 0,
      totalRevenue: 0,
    }
  );

  return {
    bookings,
    loading,
    error,
    updateBookingStatus,
    getBookingsByDate,
    stats,
  };
}