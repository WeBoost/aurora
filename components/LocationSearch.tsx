import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useLocationSearch } from '@/hooks/useLocationSearch';

interface LocationSearchProps {
  onSelect?: (location: any) => void;
}

export function LocationSearch({ onSelect }: LocationSearchProps) {
  const [query, setQuery] = useState('');
  const { locations, loading, error, search } = useLocationSearch();

  useEffect(() => {
    if (query.length >= 2) {
      search(query);
    }
  }, [query]);

  return (
    <View style={styles.container}>
      <BlurView intensity={20} style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#A0AEC0" />
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder="Search locations in Iceland..."
          placeholderTextColor="#A0AEC0"
        />
        {query ? (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={20} color="#A0AEC0" />
          </TouchableOpacity>
        ) : null}
      </BlurView>

      {query.length >= 2 && (
        <View style={styles.results}>
          {loading ? (
            <Text style={styles.message}>Searching...</Text>
          ) : error ? (
            <Text style={styles.error}>Failed to search locations</Text>
          ) : locations.length === 0 ? (
            <Text style={styles.message}>No locations found</Text>
          ) : (
            locations.map((location) => (
              <TouchableOpacity
                key={location.id}
                style={styles.resultItem}
                onPress={() => onSelect?.(location)}>
                <Ionicons name="location" size={20} color="#45B08C" />
                <View style={styles.resultInfo}>
                  <Text style={styles.resultName}>{location.name}</Text>
                  <Text style={styles.resultType}>{location.type}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 20,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  results: {
    marginTop: 8,
    backgroundColor: 'rgba(11, 16, 33, 0.95)',
    borderRadius: 12,
    padding: 8,
    maxHeight: 300,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  resultType: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  message: {
    color: '#A0AEC0',
    fontSize: 14,
    textAlign: 'center',
    padding: 12,
  },
  error: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
    padding: 12,
  },
});