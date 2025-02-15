import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useBusiness } from '@/hooks/useBusiness';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';

export default function BusinessPage() {
  const router = useRouter();
  const { session } = useAuth();
  const { business, loading } = useBusiness(session?.user?.id);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!business) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Ionicons name="business" size={48} color="#45B08C" />
          <Text style={styles.emptyStateTitle}>Create Your Business</Text>
          <Text style={styles.emptyStateDescription}>
            Get started by creating your business profile
          </Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => router.push('/business/edit')}>
            <Text style={styles.createButtonText}>Create Business Profile</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Business Dashboard</Text>
        <Text style={styles.subtitle}>
          Manage your business profile and bookings
        </Text>
      </View>

      <AnalyticsDashboard businessId={business.id} />

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/business/bookings')}>
          <Ionicons name="calendar" size={24} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Manage Bookings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/business/services')}>
          <Ionicons name="list" size={24} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Manage Services</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/business/website')}>
          <Ionicons name="globe" size={24} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Website Builder</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1021',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 40,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 16,
    color: '#A0AEC0',
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#45B08C',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'web' ? 20 : 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#A0AEC0',
  },
  quickActions: {
    padding: 20,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});