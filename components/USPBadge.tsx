import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface USPBadgeProps {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}

export function USPBadge({ icon, text }: USPBadgeProps) {
  return (
    <View style={styles.badge}>
      <Ionicons name={icon} size={20} color="#45B08C" />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(69, 176, 140, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
    gap: 8,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});