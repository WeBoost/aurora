import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '@/hooks/useAuth';
import { useBusiness } from '@/hooks/useBusiness';
import { useBookings } from '@/hooks/useBookings';

const STATUSES = [
  { value: 'all', label: 'All Bookings', color: '#A0AEC0' },
  { value: 'pending', label: 'Pending', color: '#F59E0B' },
  { value: 'confirmed', label: 'Confirmed', color: '#45B08C' },
  { value: 'completed', label: 'Completed', color: '#3B82F6' },
  { value: 'cancelled', label: 'Cancelled', color: '#EF4444' },
];

const formatTime = (time: string) => {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('is-IS', {
    style: 'currency',
    currency: 'ISK',
  }).format(amount);
};

export default function BookingsPage() {
  const router = useRouter();
  const { session } = useAuth();
  const { business, loading: businessLoading } = useBusiness(session?.user?.id);
  const { bookings, loading: bookingsLoading, error, updateBookingStatus, stats } = useBookings(business?.id);
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');

  const loading = businessLoading || bookingsLoading;

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const dateMatches = booking.booking_date === selectedDate.toISOString().split('T')[0];
      const statusMatches = selectedStatus === 'all' || booking.status === selectedStatus;
      return dateMatches && statusMatches;
    });
  }, [bookings, selectedDate, selectedStatus]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load bookings</Text>
      </View>
    );
  }

  if (!business) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Ionicons name="business" size={48} color="#45B08C" />
          <Text style={styles.emptyStateTitle}>Create Your Business First</Text>
          <Text style={styles.emptyStateDescription}>
            You need to create a business profile before managing bookings
          </Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => router.push('/business/edit')}>
            <Text style={styles.createButtonText}>Create Business Profile</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Bookings</Text>
        <Text style={styles.subtitle}>
          Manage your bookings and reservations
        </Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Ionicons name="time" size={24} color="#F59E0B" />
            <Text style={styles.statValue}>{stats.pending}</Text>
          </View>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Ionicons name="checkmark-circle" size={24} color="#45B08C" />
            <Text style={styles.statValue}>{stats.confirmed}</Text>
          </View>
          <Text style={styles.statLabel}>Confirmed</Text>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Ionicons name="close-circle" size={24} color="#EF4444" />
            <Text style={styles.statValue}>{stats.cancelled}</Text>
          </View>
          <Text style={styles.statLabel}>Cancelled</Text>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Ionicons name="cash" size={24} color="#45B08C" />
            <Text style={[styles.statValue, styles.statValueSmall]}>
              {formatCurrency(stats.totalRevenue)}
            </Text>
          </View>
          <Text style={styles.statLabel}>Revenue</Text>
        </View>
      </View>

      <View style={styles.filters}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}>
          <Ionicons name="calendar" size={20} color="#FFFFFF" />
          <Text style={styles.dateButtonText}>
            {selectedDate.toLocaleDateString(undefined, {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </TouchableOpacity>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.statusFilters}>
          {STATUSES.map((status) => (
            <TouchableOpacity
              key={status.value}
              style={[
                styles.statusButton,
                selectedStatus === status.value && styles.statusButtonActive,
                selectedStatus === status.value && { borderColor: status.color },
              ]}
              onPress={() => setSelectedStatus(status.value)}>
              <Text
                style={[
                  styles.statusButtonText,
                  selectedStatus === status.value && { color: status.color },
                ]}>
                {status.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {filteredBookings.length === 0 ? (
        <View style={styles.emptyBookings}>
          <Ionicons name="calendar" size={48} color="#45B08C" />
          <Text style={styles.emptyBookingsTitle}>No Bookings Found</Text>
          <Text style={styles.emptyBookingsDescription}>
            There are no bookings for the selected date and status
          </Text>
        </View>
      ) : (
        <View style={styles.bookingsList}>
          {filteredBookings.map((booking) => (
            <View key={booking.id} style={styles.bookingCard}>
              <View style={styles.bookingHeader}>
                <View>
                  <Text style={styles.bookingTime}>
                    {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                  </Text>
                  <Text style={styles.bookingService}>
                    {booking.service?.name || 'Service Unavailable'}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        booking.status === 'confirmed'
                          ? 'rgba(69, 176, 140, 0.1)'
                          : booking.status === 'pending'
                          ? 'rgba(245, 158, 11, 0.1)'
                          : booking.status === 'completed'
                          ? 'rgba(59, 130, 246, 0.1)'
                          : 'rgba(239, 68, 68, 0.1)',
                    },
                  ]}>
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color:
                          booking.status === 'confirmed'
                            ? '#45B08C'
                            : booking.status === 'pending'
                            ? '#F59E0B'
                            : booking.status === 'completed'
                            ? '#3B82F6'
                            : '#EF4444',
                      },
                    ]}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Text>
                </View>
              </View>

              <View style={styles.bookingDetails}>
                <View style={styles.bookingDetail}>
                  <Ionicons name="person" size={16} color="#A0AEC0" />
                  <Text style={styles.bookingDetailText}>{booking.customer_name}</Text>
                </View>
                <View style={styles.bookingDetail}>
                  <Ionicons name="mail" size={16} color="#A0AEC0" />
                  <Text style={styles.bookingDetailText}>{booking.customer_email}</Text>
                </View>
                {booking.customer_phone && (
                  <View style={styles.bookingDetail}>
                    <Ionicons name="call" size={16} color="#A0AEC0" />
                    <Text style={styles.bookingDetailText}>{booking.customer_phone}</Text>
                  </View>
                )}
                <View style={styles.bookingDetail}>
                  <Ionicons name="people" size={16} color="#A0AEC0" />
                  <Text style={styles.bookingDetailText}>
                    {booking.number_of_people} {booking.number_of_people === 1 ? 'person' : 'people'}
                  </Text>
                </View>
                <View style={styles.bookingDetail}>
                  <Ionicons name="cash" size={16} color="#A0AEC0" />
                  <Text style={styles.bookingDetailText}>
                    {formatCurrency(Number(booking.total_amount))}
                  </Text>
                </View>
              </View>

              {booking.special_requests && (
                <View style={styles.specialRequests}>
                  <Text style={styles.specialRequestsLabel}>Special Requests:</Text>
                  <Text style={styles.specialRequestsText}>{booking.special_requests}</Text>
                </View>
              )}

              {booking.status === 'pending' && (
                <View style={styles.bookingActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.confirmButton]}
                    onPress={() => updateBookingStatus(booking.id, 'confirmed')}>
                    <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Confirm</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.cancelButton]}
                    onPress={() => updateBookingStatus(booking.id, 'cancelled')}>
                    <Ionicons name="close" size={20} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {showDatePicker && Platform.OS !== 'web' && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) setSelectedDate(date);
          }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1021',
  },
  content: {
    padding: 20,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 16,
    color: '#A0AEC0',
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#45B08C',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#A0AEC0',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: Platform.OS === 'web' ? 200 : '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statValueSmall: {
    fontSize: 18,
  },
  statLabel: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  filters: {
    marginBottom: 24,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  dateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  statusFilters: {
    marginHorizontal: -20,
  },
  statusButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  statusButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  statusButtonText: {
    color: '#A0AEC0',
    fontSize: 14,
  },
  emptyBookings: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 32,
  },
  emptyBookingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyBookingsDescription: {
    fontSize: 14,
    color: '#A0AEC0',
    textAlign: 'center',
  },
  bookingsList: {
    gap: 16,
  },
  bookingCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  bookingTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  bookingService: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 100,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  bookingDetails: {
    gap: 8,
    marginBottom: 16,
  },
  bookingDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bookingDetailText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  specialRequests: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  specialRequestsLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  specialRequestsText: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  bookingActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  confirmButton: {
    backgroundColor: '#45B08C',
  },
  cancelButton: {
    backgroundColor: '#EF4444',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});