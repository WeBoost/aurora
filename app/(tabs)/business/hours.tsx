import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '@/hooks/useAuth';
import { useBusiness } from '@/hooks/useBusiness';
import { useBusinessHours } from '@/hooks/useBusinessHours';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const formatTime = (time: string | null) => {
  if (!time) return 'Closed';
  return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
};

export default function BusinessHoursPage() {
  const router = useRouter();
  const { session } = useAuth();
  const { business, loading: businessLoading } = useBusiness(session?.user?.id);
  const {
    regularHours,
    specialHours,
    loading: hoursLoading,
    updateRegularHours,
    updateSpecialHours,
    deleteSpecialHours,
  } = useBusinessHours(business?.id);

  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timeType, setTimeType] = useState<'open' | 'close'>('open');
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [addingSpecialHours, setAddingSpecialHours] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const loading = businessLoading || hoursLoading;

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate && editingDay !== null) {
      const time = selectedDate.toTimeString().split(' ')[0];
      updateRegularHours(editingDay, {
        [timeType === 'open' ? 'open_time' : 'close_time']: time,
      });
    }
  };

  const handleSpecialHoursAdd = async () => {
    const date = selectedDate.toISOString().split('T')[0];
    await updateSpecialHours(date, {
      open_time: '09:00:00',
      close_time: '17:00:00',
      is_closed: false,
    });
    setAddingSpecialHours(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
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
            You need to create a business profile before setting business hours
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
        <Text style={styles.title}>Business Hours</Text>
        <Text style={styles.subtitle}>
          Set your regular business hours and add special hours for holidays
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Regular Hours</Text>
        <View style={styles.hoursGrid}>
          {DAYS.map((day, index) => {
            const hours = regularHours.find((h) => h.day_of_week === index);
            return (
              <View key={day} style={styles.dayRow}>
                <View style={styles.dayInfo}>
                  <Text style={styles.dayName}>{day}</Text>
                  <Text style={styles.hours}>
                    {hours?.is_closed
                      ? 'Closed'
                      : `${formatTime(hours?.open_time || null)} - ${formatTime(
                          hours?.close_time || null
                        )}`}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => {
                    setEditingDay(index);
                    setTimeType('open');
                    setShowTimePicker(true);
                  }}>
                  <Ionicons name="create-outline" size={20} color="#45B08C" />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Special Hours & Holidays</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setAddingSpecialHours(true)}>
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add Special Hours</Text>
          </TouchableOpacity>
        </View>

        {specialHours.length === 0 ? (
          <View style={styles.emptyHours}>
            <Ionicons name="calendar" size={32} color="#45B08C" />
            <Text style={styles.emptyHoursText}>No special hours set</Text>
            <Text style={styles.emptyHoursDescription}>
              Add special hours for holidays or events
            </Text>
          </View>
        ) : (
          <View style={styles.specialHoursGrid}>
            {specialHours.map((special) => (
              <View key={special.id} style={styles.specialDay}>
                <View style={styles.specialDayInfo}>
                  <Text style={styles.specialDate}>
                    {new Date(special.date).toLocaleDateString(undefined, {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Text>
                  <Text style={styles.specialHours}>
                    {special.is_closed
                      ? 'Closed'
                      : `${formatTime(special.open_time)} - ${formatTime(special.close_time)}`}
                  </Text>
                  {special.note && <Text style={styles.specialNote}>{special.note}</Text>}
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteSpecialHours(special.id)}>
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      {(showTimePicker || addingSpecialHours) && Platform.OS !== 'web' && (
        <DateTimePicker
          value={showTimePicker ? selectedTime : selectedDate}
          mode={showTimePicker ? 'time' : 'date'}
          is24Hour={true}
          onChange={showTimePicker ? handleTimeChange : (event, date) => {
            setSelectedDate(date || new Date());
            handleSpecialHoursAdd();
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
    marginBottom: 32,
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
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#45B08C',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  hoursGrid: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  dayInfo: {
    flex: 1,
  },
  dayName: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  hours: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  editButton: {
    padding: 8,
    backgroundColor: 'rgba(69, 176, 140, 0.1)',
    borderRadius: 8,
  },
  specialHoursGrid: {
    gap: 12,
  },
  specialDay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 12,
  },
  specialDayInfo: {
    flex: 1,
  },
  specialDate: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  specialHours: {
    fontSize: 14,
    color: '#A0AEC0',
    marginBottom: 4,
  },
  specialNote: {
    fontSize: 14,
    color: '#45B08C',
  },
  deleteButton: {
    padding: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
  },
  emptyHours: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 32,
  },
  emptyHoursText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyHoursDescription: {
    fontSize: 14,
    color: '#A0AEC0',
    textAlign: 'center',
  },
});