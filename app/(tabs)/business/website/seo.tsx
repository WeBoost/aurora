import { View, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useBusiness } from '@/hooks/useBusiness';
import { SEOManager } from '@/components/SEOManager';

export default function SEOPage() {
  const router = useRouter();
  const { session } = useAuth();
  const { business } = useBusiness(session?.user?.id);

  return (
    <View style={styles.container}>
      {business && <SEOManager businessId={business.id} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1021',
    padding: 20,
    paddingTop: Platform.OS === 'web' ? 20 : 60,
  },
});