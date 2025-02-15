import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface AnalyticsData {
  views: number;
  bookings: {
    total: number;
    completed: number;
    revenue: number;
    averageValue: number;
  };
  topServices: Array<{
    name: string;
    bookings: number;
    revenue: number;
  }>;
  recentActivity: Array<{
    type: 'booking' | 'view' | 'review';
    timestamp: string;
    details: any;
  }>;
}

export function useAnalytics(businessId: string | undefined) {
  const [data, setData] = useState<AnalyticsData>({
    views: 0,
    bookings: {
      total: 0,
      completed: 0,
      revenue: 0,
      averageValue: 0,
    },
    topServices: [],
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!businessId) {
      setLoading(false);
      return;
    }

    const fetchAnalytics = async () => {
      try {
        // Fetch bookings data
        const { data: bookings, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            *,
            service:services (name)
          `)
          .eq('business_id', businessId)
          .order('created_at', { ascending: false });

        if (bookingsError) throw bookingsError;

        // Calculate metrics
        const completed = bookings.filter(b => b.status === 'completed');
        const totalRevenue = completed.reduce((sum, b) => sum + b.total_amount, 0);

        // Get top services
        const serviceStats = bookings.reduce((acc: any, booking) => {
          const serviceName = booking.service?.name || 'Unknown';
          if (!acc[serviceName]) {
            acc[serviceName] = { bookings: 0, revenue: 0 };
          }
          acc[serviceName].bookings++;
          if (booking.status === 'completed') {
            acc[serviceName].revenue += booking.total_amount;
          }
          return acc;
        }, {});

        const topServices = Object.entries(serviceStats)
          .map(([name, stats]: [string, any]) => ({
            name,
            bookings: stats.bookings,
            revenue: stats.revenue,
          }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5);

        // Update analytics data
        setData({
          views: Math.floor(Math.random() * 1000), // Replace with actual view tracking
          bookings: {
            total: bookings.length,
            completed: completed.length,
            revenue: totalRevenue,
            averageValue: completed.length ? totalRevenue / completed.length : 0,
          },
          topServices,
          recentActivity: bookings.slice(0, 10).map(booking => ({
            type: 'booking',
            timestamp: booking.created_at,
            details: booking,
          })),
        });
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('analytics_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `business_id=eq.${businessId}`,
        },
        () => {
          fetchAnalytics();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [businessId]);

  return {
    data,
    loading,
    error,
  };
}