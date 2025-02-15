import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface TimeSlot {
  time: string;
  available: boolean;
}

export function useBookingSlots(businessId: string | undefined, serviceId: string | undefined, date: string) {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!businessId || !serviceId || !date) {
      setLoading(false);
      return;
    }

    const fetchSlots = async () => {
      try {
        // Get business hours for the day
        const dayOfWeek = new Date(date).getDay();
        const { data: hoursData, error: hoursError } = await supabase
          .from('business_hours')
          .select('*')
          .eq('business_id', businessId)
          .eq('day_of_week', dayOfWeek)
          .single();

        if (hoursError) throw hoursError;

        // Get existing bookings
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('start_time, end_time')
          .eq('business_id', businessId)
          .eq('service_id', serviceId)
          .eq('booking_date', date)
          .not('status', 'eq', 'cancelled');

        if (bookingsError) throw bookingsError;

        // Generate available time slots
        const slots = generateTimeSlots(
          hoursData.open_time,
          hoursData.close_time,
          bookingsData || []
        );

        setSlots(slots);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [businessId, serviceId, date]);

  return {
    slots,
    loading,
    error,
  };
}

function generateTimeSlots(openTime: string, closeTime: string, bookings: any[]) {
  const slots: TimeSlot[] = [];
  const interval = 30; // 30-minute slots

  let currentTime = new Date(`2000-01-01T${openTime}`);
  const endTime = new Date(`2000-01-01T${closeTime}`);

  while (currentTime < endTime) {
    const timeString = currentTime.toTimeString().slice(0, 5);
    const isAvailable = !bookings.some(
      booking => booking.start_time === timeString
    );

    slots.push({
      time: timeString,
      available: isAvailable,
    });

    currentTime = new Date(currentTime.getTime() + interval * 60000);
  }

  return slots;
}