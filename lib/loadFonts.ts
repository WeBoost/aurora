import { Platform } from 'react-native';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

export async function loadFonts() {
  if (Platform.OS === 'web') {
    // For web, inject a link to the CDN-hosted Ionicons
    const link = document.createElement('link');
    link.href = 'https://unpkg.com/ionicons@5.5.2/dist/css/ionicons.min.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  } else {
    // For native, load fonts normally
    try {
      await Font.loadAsync(Ionicons.font);
    } catch (e) {
      console.warn('Failed to load native fonts:', e);
    }
  }
}