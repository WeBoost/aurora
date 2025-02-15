import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

interface PriceToggleProps {
  isAnnual: boolean;
  onToggle: (value: boolean) => void;
}

export function PriceToggle({ isAnnual, onToggle }: PriceToggleProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Monthly</Text>
      <TouchableOpacity
        style={[styles.toggle, isAnnual && styles.toggleActive]}
        onPress={() => onToggle(!isAnnual)}
        activeOpacity={0.8}>
        <View style={[styles.handle, isAnnual && styles.handleActive]} />
      </TouchableOpacity>
      <Text style={styles.label}>Annual</Text>
      <View style={styles.savingsBadge}>
        <Text style={styles.savingsText}>Save 20%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 40,
  },
  label: {
    color: '#A0AEC0',
    fontSize: 16,
  },
  toggle: {
    width: 56,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 4,
  },
  toggleActive: {
    backgroundColor: '#45B08C',
  },
  handle: {
    width: 24,
    height: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    transform: [{ translateX: 0 }],
  },
  handleActive: {
    transform: [{ translateX: 24 }],
  },
  savingsBadge: {
    backgroundColor: 'rgba(69, 176, 140, 0.2)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 100,
  },
  savingsText: {
    color: '#45B08C',
    fontSize: 12,
    fontWeight: '500',
  },
});