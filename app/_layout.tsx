import { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { TopBar } from '../components/TopBar';
import { MainNav } from '../components/MainNav';
import { supabase } from '../lib/supabase';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { initializeErrorMonitoring } from '../lib/error';
import { loadFonts } from '../lib/loadFonts';

export default function RootLayout() {
  const { initialized, session } = useAuth();

  useEffect(() => {
    const init = async () => {
      try {
        // Load fonts
        await loadFonts();

        // Initialize error monitoring
        await initializeErrorMonitoring();

        // Initialize Supabase connection
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        console.log('Supabase connection initialized', session ? 'with session' : 'without session');
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };

    init();
  }, []);

  if (!initialized) {
    return null;
  }

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        {!session && <TopBar />}
        {!session && <MainNav />}
        <View style={styles.content}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="pricing" />
          </Stack>
        </View>
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1021',
  },
  content: {
    flex: 1,
  },
});