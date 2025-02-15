import { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const placeholders = [
  'Search for tours...',
  'Find restaurants...',
  'Discover activities...',
  'Book hotels...',
];

export function SearchInput() {
  const [placeholder, setPlaceholder] = useState(placeholders[0]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((current) => (current + 1) % placeholders.length);
      setPlaceholder(placeholders[index]);
    }, 3000);

    return () => clearInterval(interval);
  }, [index]);

  return (
    <BlurView intensity={20} style={styles.container}>
      <Ionicons name="search" size={20} color="#A0AEC0" />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#A0AEC0"
        style={styles.input}
      />
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    gap: 10,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
});