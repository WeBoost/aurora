import { View, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useBusiness } from '@/hooks/useBusiness';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { ReportsGenerator } from '@/components/ReportsGenerator';

export default function AnalyticsPage() {
  const router = useRouter();
  const { session } = useAuth();
  const { business } = useBusiness(session?.user?.id);

  const handleExport = async (reportData: any) => {
    // In a real app, this would generate a PDF or CSV
    console.log('Exporting report:', reportData);
  };

  return (
    <View style={styles.container}>
      {business && (
        <>
          <AnalyticsDashboard businessId={business.id} />
          <ReportsGenerator
            businessId={business.id}
            onExport={handleExport}
          />
        </>
      )}
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