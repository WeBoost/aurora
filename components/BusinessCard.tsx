import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface BusinessCardProps {
  business: any;
  compact?: boolean;
}

export function BusinessCard({ business, compact }: BusinessCardProps) {
  const router = useRouter();

  if (compact) {
    return (
      <TouchableOpacity
        style={styles.compactCard}
        onPress={() => router.push(`/business/${business.id}`)}>
        <Text style={styles.compactName}>{business.name}</Text>
        <Text style={styles.compactCategory}>{business.category}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/business/${business.id}`)}>
      <Image
        source={
          business.logo_url
            ? { uri: business.logo_url }
            : { uri: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=2850&q=80' }
        }
        style={styles.image}
      />
      <View style={styles.content}>
        <View>
          <Text style={styles.name}>{business.name}</Text>
          <Text style={styles.category}>{business.category}</Text>
          <View style={styles.location}>
            <Ionicons name="location" size={16} color="#A0AEC0" />
            <Text style={styles.locationText}>{business.city}</Text>
          </View>
        </View>
        <View style={styles.stats}>
          <View style={styles.rating}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>4.8</Text>
          </View>
          <Text style={styles.reviews}>(124 reviews)</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0B1021',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  image: {
    width: '100%',
    height: 160,
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: '#A0AEC0',
    marginBottom: 8,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  reviews: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  compactCard: {
    backgroundColor: '#0B1021',
    padding: 12,
    borderRadius: 8,
    maxWidth: 200,
  },
  compactName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  compactCategory: {
    fontSize: 12,
    color: '#A0AEC0',
  },
});