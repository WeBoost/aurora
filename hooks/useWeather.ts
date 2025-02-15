import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { supabase } from '@/lib/supabase';

interface WeatherData {
  temperature: number;
  condition: string;
  windSpeed: number;
  precipitation: number;
  auroraForecast: {
    probability: number;
    intensity: 'low' | 'medium' | 'high';
  };
  sunrise: string;
  sunset: string;
  location: {
    name: string;
    latitude: number;
    longitude: number;
  };
}

interface WeatherOptions {
  locationId?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  useUserLocation?: boolean;
}

export function useWeather(options: WeatherOptions = {}) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        let latitude: number;
        let longitude: number;
        let locationName: string;

        if (options.locationId) {
          // Get location from database
          const { data: location, error: locationError } = await supabase
            .from('locations')
            .select('name, latitude, longitude')
            .eq('id', options.locationId)
            .single();

          if (locationError) throw locationError;
          
          latitude = location.latitude;
          longitude = location.longitude;
          locationName = location.name;
        } else if (options.coordinates) {
          // Use provided coordinates
          latitude = options.coordinates.latitude;
          longitude = options.coordinates.longitude;

          // Reverse geocode to get location name
          const { data: locations, error: searchError } = await supabase
            .from('locations')
            .select('name')
            .order(
              `point(latitude, longitude) <-> point(${latitude}, ${longitude})`,
              { ascending: true }
            )
            .limit(1);

          if (!searchError && locations?.length > 0) {
            locationName = locations[0].name;
          } else {
            locationName = 'Unknown Location';
          }
        } else if (options.useUserLocation) {
          // Try to get user's location
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === 'granted') {
            const location = await Location.getCurrentPositionAsync({});
            latitude = location.coords.latitude;
            longitude = location.coords.longitude;

            // Reverse geocode to get location name
            const { data: locations, error: searchError } = await supabase
              .from('locations')
              .select('name')
              .order(
                `point(latitude, longitude) <-> point(${latitude}, ${longitude})`,
                { ascending: true }
              )
              .limit(1);

            if (!searchError && locations?.length > 0) {
              locationName = locations[0].name;
            } else {
              locationName = 'Your Location';
            }
          } else {
            // Fall back to Reykjavik
            latitude = 64.1466;
            longitude = -21.9426;
            locationName = 'Reykjavík';
          }
        } else {
          // Default to Reykjavik
          latitude = 64.1466;
          longitude = -21.9426;
          locationName = 'Reykjavík';
        }

        // Call weather API via Edge Function
        const { data: weatherData, error: weatherError } = await supabase
          .functions.invoke('get-weather', {
            body: { latitude, longitude },
          });

        if (weatherError) throw weatherError;

        setWeather({
          ...weatherData,
          location: {
            name: locationName,
            latitude,
            longitude,
          },
        });
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();

    // Refresh weather data every 15 minutes
    const interval = setInterval(fetchWeather, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, [options.locationId, options.coordinates, options.useUserLocation]);

  return {
    weather,
    loading,
    error,
  };
}