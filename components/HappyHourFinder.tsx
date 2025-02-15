import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHappyHours } from '@/hooks/useHappyHours';
import { BusinessCard } from './BusinessCard';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function HappyHourFinder() {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const { happyHours, loading, error } = useHappyHours({
    day: selectedDay,
    time: selectedTime,
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Happy Hour Finder</Text>
        <Text style={styles.subtitle}>Find the best deals near you</Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.dayPicker}>
        {DAYS.map((day, index) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayButton,
              selectedDay === index && styles.dayButtonActive,
            ]}
            onPress={() => setSelectedDay(index)}>
            <Text
              style={[
                styles.dayButtonText,
                selectedDay === index && styles.dayButtonTextActive,
              ]}>
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content}>
        {loading ? (
          <Text style={styles.message}>Finding happy hours...</Text>
        ) : error ? (
          <Text style={styles.error}>Failed to load happy hours</Text>
        ) : happyHours.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="beer" size={48} color="#45B08C" />
            <Text style={styles.emptyTitle}>No Happy Hours Found</Text>
            <Text style={styles.emptyDescription}>
              Try selecting a different day or time
            </Text>
          </View>
        ) : (
          <View style={styles.happyHoursList}>
            {happyHours.map((happyHour) => (
              <View key={happyHour.id} style={styles.happyHourCard}>
                <BusinessCard business={happyHour.business} />
                <View style={styles.dealInfo}>
                  <View style={styles.timeSlot}>
                    <Ionicons name="time" size={16} color="#45B08C" />
                    <Text style={styles.timeText}>
                      {happyHour.start_time} - {happyHour.end_time}
                    </Text>
                  </View>
                  <Text style={styles.description}>
                    {happyHour.description}
                  </Text>
                  <View style={styles.deals}>
                    {happyHour.deals.map((deal, index) => (
                      <View key={index} style={styles.deal}>
                        <Text style={styles.dealType}>{deal.type}</Text>
                        <Text style={styles.dealDescription}>
                          {deal.description}
                        </Text>
                        <Text style={styles.dealDiscount}>
                          {deal.discount}% off
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
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
  dayPicker: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  dayButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
    marginRight: 8,
  },
  dayButtonActive: {
    backgroundColor: '#45B08C',
  },
  dayButtonText: {
    color: '#A0AEC0',
    fontSize: 14,
  },
  dayButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  message: {
    color: '#A0AEC0',
    fontSize: 16,
    textAlign: 'center',
  },
  error: {
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#A0AEC0',
    textAlign: 'center',
  },
  happyHoursList: {
    gap: 20,
  },
  happyHourCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  dealInfo: {
    padding: 16,
  },
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  description: {
    color: '#A0AEC0',
    fontSize: 14,
    marginBottom: 16,
  },
  deals: {
    gap: 12,
  },
  deal: {
    backgroundColor: 'rgba(69, 176, 140, 0.1)',
    padding: 12,
    borderRadius: 8,
  },
  dealType: {
    color: '#45B08C',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  dealDescription: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 4,
  },
  dealDiscount: {
    color: '#45B08C',
    fontSize: 16,
    fontWeight: 'bold',
  },
});