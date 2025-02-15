import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWeather } from '@/hooks/useWeather';
import { BlurView } from 'expo-blur';

interface WeatherWidgetProps {
  locationId?: string;
  latitude?: number;
  longitude?: number;
  compact?: boolean;
  useUserLocation?: boolean;
}

export function WeatherWidget({ 
  locationId, 
  latitude, 
  longitude, 
  compact,
  useUserLocation = false
}: WeatherWidgetProps) {
  const { weather, loading, error } = useWeather({
    locationId,
    coordinates: latitude && longitude ? { latitude, longitude } : undefined,
    useUserLocation,
  });

  const BlurComponent = Platform.OS === 'web' ? View : BlurView;

  if (loading) {
    return (
      <BlurComponent intensity={20} style={styles.container}>
        <Text style={styles.loadingText}>Loading weather...</Text>
      </BlurComponent>
    );
  }

  if (error || !weather) {
    return (
      <BlurComponent intensity={20} style={styles.container}>
        <Text style={styles.errorText}>Failed to load weather</Text>
      </BlurComponent>
    );
  }

  if (compact) {
    return (
      <BlurComponent intensity={20} style={styles.compactContainer}>
        <View style={styles.compactRow}>
          <View style={styles.compactTemp}>
            <Text style={styles.compactTempText}>
              {Math.round(weather.temperature)}°C
            </Text>
            <Text style={styles.compactLocation}>{weather.location.name}</Text>
          </View>
          <View style={styles.compactAurora}>
            <Ionicons 
              name="flash" 
              size={16} 
              color={getAuroraColor(weather.auroraForecast.intensity)} 
            />
            <Text style={[
              styles.compactAuroraText,
              { color: getAuroraColor(weather.auroraForecast.intensity) }
            ]}>
              {weather.auroraForecast.probability}% Aurora
            </Text>
          </View>
        </View>
      </BlurComponent>
    );
  }

  return (
    <BlurComponent intensity={20} style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.location}>{weather.location.name}</Text>
          <Text style={styles.condition}>{weather.condition}</Text>
        </View>
        <Text style={styles.temperature}>
          {Math.round(weather.temperature)}°C
        </Text>
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Ionicons name="water" size={20} color="#A0AEC0" />
          <Text style={styles.detailText}>
            {weather.precipitation}% precipitation
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="wind" size={20} color="#A0AEC0" />
          <Text style={styles.detailText}>
            {weather.windSpeed} m/s
          </Text>
        </View>
      </View>

      <View style={styles.sunTimes}>
        <View style={styles.sunTime}>
          <Ionicons name="sunny" size={20} color="#FFD700" />
          <Text style={styles.sunTimeText}>
            Sunrise: {weather.sunrise}
          </Text>
        </View>
        <View style={styles.sunTime}>
          <Ionicons name="moon" size={20} color="#A0AEC0" />
          <Text style={styles.sunTimeText}>
            Sunset: {weather.sunset}
          </Text>
        </View>
      </View>

      <View style={styles.aurora}>
        <View style={styles.auroraHeader}>
          <Ionicons 
            name="flash" 
            size={24} 
            color={getAuroraColor(weather.auroraForecast.intensity)} 
          />
          <Text style={styles.auroraTitle}>Aurora Forecast</Text>
        </View>
        <Text style={[
          styles.auroraText,
          { color: getAuroraColor(weather.auroraForecast.intensity) }
        ]}>
          {weather.auroraForecast.probability}% chance of seeing the Northern Lights
        </Text>
      </View>
    </BlurComponent>
  );
}

function getAuroraColor(intensity: 'low' | 'medium' | 'high'): string {
  switch (intensity) {
    case 'high':
      return '#45B08C';
    case 'medium':
      return '#FFD700';
    case 'low':
      return '#A0AEC0';
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  location: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  condition: {
    fontSize: 16,
    color: '#A0AEC0',
  },
  temperature: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  sunTimes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sunTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sunTimeText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  aurora: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 16,
    borderRadius: 12,
  },
  auroraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  auroraTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  auroraText: {
    fontSize: 14,
  },
  loadingText: {
    color: '#A0AEC0',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center',
  },
  compactContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
  },
  compactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compactTemp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  compactTempText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  compactLocation: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  compactAurora: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  compactAuroraText: {
    fontSize: 14,
  },
});