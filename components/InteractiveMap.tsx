import { useState, useRef, useCallback } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import Map, { Marker as WebMarker, Popup } from 'react-map-gl';
import { useBusinessSearch } from '@/hooks/useBusinessSearch';
import { BusinessCard } from './BusinessCard';

interface InteractiveMapProps {
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  onRegionChange?: (region: any) => void;
  onMarkerPress?: (business: any) => void;
}

export function InteractiveMap({ 
  initialRegion = {
    latitude: 64.9631,
    longitude: -19.0208,
    latitudeDelta: 8,
    longitudeDelta: 8,
  },
  onRegionChange,
  onMarkerPress,
}: InteractiveMapProps) {
  const mapRef = useRef(null);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const { businesses, loading } = useBusinessSearch({
    bounds: initialRegion,
  });

  const handleMarkerPress = useCallback((business: any) => {
    setSelectedBusiness(business);
    if (onMarkerPress) {
      onMarkerPress(business);
    }
  }, [onMarkerPress]);

  if (Platform.OS === 'web') {
    return (
      <Map
        ref={mapRef}
        initialViewState={{
          latitude: initialRegion.latitude,
          longitude: initialRegion.longitude,
          zoom: 6,
        }}
        style={styles.map}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={process.env.EXPO_PUBLIC_MAPBOX_TOKEN}>
        {businesses.map((business) => (
          <WebMarker
            key={business.id}
            latitude={business.latitude}
            longitude={business.longitude}
            onClick={() => handleMarkerPress(business)}>
            {selectedBusiness?.id === business.id && (
              <Popup
                latitude={business.latitude}
                longitude={business.longitude}
                closeButton={false}
                closeOnClick={false}>
                <BusinessCard business={business} compact />
              </Popup>
            )}
          </WebMarker>
        ))}
      </Map>
    );
  }

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      initialRegion={initialRegion}
      onRegionChange={onRegionChange}>
      {businesses.map((business) => (
        <Marker
          key={business.id}
          coordinate={{
            latitude: business.latitude,
            longitude: business.longitude,
          }}
          onPress={() => handleMarkerPress(business)}>
          <Callout>
            <BusinessCard business={business} compact />
          </Callout>
        </Marker>
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
});