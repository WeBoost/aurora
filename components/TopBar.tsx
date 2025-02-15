import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export function TopBar() {
  const [currency, setCurrency] = useState('ISK');
  const [language, setLanguage] = useState('English');

  return (
    <View style={styles.topBar}>
      <View style={styles.topBarLeft}>
        <TouchableOpacity style={styles.topBarButton}>
          <Ionicons name="globe-outline" size={16} color="#A0AEC0" />
          <Text style={styles.topBarText}>{language}</Text>
          <Ionicons name="chevron-down" size={16} color="#A0AEC0" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.topBarButton}>
          <Text style={styles.topBarText}>{currency}</Text>
          <Ionicons name="chevron-down" size={16} color="#A0AEC0" />
        </TouchableOpacity>
      </View>
      <View style={styles.topBarRight}>
        <TouchableOpacity style={styles.topBarLink}>
          <Ionicons name="call-outline" size={16} color="#A0AEC0" />
          <Text style={styles.topBarText}>+354 123 4567</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.topBarLink}>
          <Ionicons name="mail-outline" size={16} color="#A0AEC0" />
          <Text style={styles.topBarText}>support@aurora.is</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(11, 16, 33, 0.98)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    ...(Platform.OS === 'web' ? {
      position: 'sticky',
      top: 0,
      zIndex: 100,
    } : {}),
  },
  topBarLeft: {
    flexDirection: 'row',
    gap: 16,
  },
  topBarRight: {
    flexDirection: 'row',
    gap: 24,
  },
  topBarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  topBarLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  topBarText: {
    color: '#A0AEC0',
    fontSize: 14,
  },
});