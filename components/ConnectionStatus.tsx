import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { supabase } from '@/lib/supabase';

export function ConnectionStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Try to fetch a simple query to verify connection
        const { data, error } = await supabase
          .from('profiles')
          .select('count')
          .limit(1)
          .single();

        if (error) throw error;
        setStatus('connected');
      } catch (e) {
        setStatus('error');
        setError(e instanceof Error ? e.message : 'Failed to connect to Supabase');
      }
    };

    checkConnection();
  }, []);

  return (
    <View style={styles.container}>
      {status === 'checking' && (
        <Text style={styles.checking}>Checking Supabase connection...</Text>
      )}
      {status === 'connected' && (
        <Text style={styles.connected}>✓ Connected to Supabase</Text>
      )}
      {status === 'error' && (
        <Text style={styles.error}>
          ✗ Supabase connection error: {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  checking: {
    color: '#A0AEC0',
  },
  connected: {
    color: '#45B08C',
  },
  error: {
    color: '#EF4444',
  },
});