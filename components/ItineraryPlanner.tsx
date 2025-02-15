import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useItinerary } from '@/hooks/useItinerary';
import { useTravelTime } from '@/hooks/useTravelTime';
import { BusinessCard } from './BusinessCard';

interface ItineraryPlannerProps {
  itineraryId?: string;
  onSave?: () => void;
}

export function ItineraryPlanner({ itineraryId, onSave }: ItineraryPlannerProps) {
  const { itinerary, loading, error, addItem, removeItem, reorderItems } = useItinerary(itineraryId);
  const { calculateTime } = useTravelTime();
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggingIndex(index);
  };

  const handleDragEnd = () => {
    setDraggingIndex(null);
  };

  const handleDrop = async (targetIndex: number) => {
    if (draggingIndex === null || !itinerary) return;
    
    const newItems = [...itinerary.items];
    const [movedItem] = newItems.splice(draggingIndex, 1);
    newItems.splice(targetIndex, 0, movedItem);
    
    await reorderItems(newItems.map(item => item.id));
    setDraggingIndex(null);
  };

  if (loading) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.message}>Loading itinerary...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.error}>Failed to load itinerary</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {itinerary?.title || 'Plan Your Day'}
        </Text>
        {itinerary && (
          <Text style={styles.date}>
            {new Date(itinerary.date).toLocaleDateString()}
          </Text>
        )}
      </View>

      <ScrollView style={styles.content}>
        {itinerary?.items.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.itemCard,
              draggingIndex === index && styles.itemCardDragging,
            ]}
            onTouchStart={() => handleDragStart(index)}
            onTouchEnd={handleDragEnd}
            onMouseDown={() => handleDragStart(index)}
            onMouseUp={handleDragEnd}
            onDragOver={(e) => {
              e.preventDefault();
              handleDrop(index);
            }}>
            <View style={styles.timeSlot}>
              <Text style={styles.time}>{item.start_time}</Text>
              <Text style={styles.duration}>
                {calculateDuration(item.start_time, item.end_time)}
              </Text>
            </View>

            <View style={styles.itemContent}>
              <BusinessCard business={item.business} compact />
              {item.notes && (
                <Text style={styles.notes}>{item.notes}</Text>
              )}
            </View>

            {item.travel_time_to_next && (
              <View style={styles.travelTime}>
                <Ionicons name="walk" size={16} color="#A0AEC0" />
                <Text style={styles.travelTimeText}>
                  {formatTravelTime(item.travel_time_to_next)}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeItem(item.id)}>
              <Ionicons name="close-circle" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        ))}

        {(!itinerary?.items || itinerary.items.length === 0) && (
          <View style={styles.emptyState}>
            <Ionicons name="calendar" size={48} color="#45B08C" />
            <Text style={styles.emptyTitle}>No Items Yet</Text>
            <Text style={styles.emptyDescription}>
              Start adding places to your itinerary
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {/* Open business search */}}>
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Place</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function calculateDuration(start: string, end: string): string {
  const [startHours, startMinutes] = start.split(':').map(Number);
  const [endHours, endMinutes] = end.split(':').map(Number);
  
  let minutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
  if (minutes < 0) minutes += 24 * 60;
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  return hours > 0
    ? `${hours}h ${remainingMinutes}m`
    : `${remainingMinutes}m`;
}

function formatTravelTime(minutes: number): string {
  return minutes >= 60
    ? `${Math.floor(minutes / 60)}h ${minutes % 60}m`
    : `${minutes}m`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageContainer: {
    padding: 20,
    alignItems: 'center',
  },
  message: {
    color: '#A0AEC0',
    fontSize: 16,
  },
  error: {
    color: '#EF4444',
    fontSize: 16,
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
  date: {
    fontSize: 16,
    color: '#A0AEC0',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...(Platform.OS === 'web' ? {
      cursor: 'move',
      userSelect: 'none',
    } : {}),
  },
  itemCardDragging: {
    opacity: 0.5,
    transform: [{ scale: 1.02 }],
  },
  timeSlot: {
    width: 80,
    alignItems: 'center',
  },
  time: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  duration: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  itemContent: {
    flex: 1,
    marginHorizontal: 16,
  },
  notes: {
    fontSize: 14,
    color: '#A0AEC0',
    marginTop: 8,
  },
  travelTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 100,
  },
  travelTimeText: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  removeButton: {
    padding: 8,
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
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#45B08C',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});