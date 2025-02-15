import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAnalytics } from '@/hooks/useAnalytics';
import { LineChart } from './charts/LineChart';
import { BarChart } from './charts/BarChart';

interface ReportsGeneratorProps {
  businessId: string;
  onExport?: (reportData: any) => void;
}

export function ReportsGenerator({ businessId, onExport }: ReportsGeneratorProps) {
  const { data, loading, error } = useAnalytics(businessId);
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('week');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['bookings', 'revenue']);

  const periods = [
    { id: 'day', label: 'Daily' },
    { id: 'week', label: 'Weekly' },
    { id: 'month', label: 'Monthly' },
  ];

  const metrics = [
    { id: 'bookings', label: 'Bookings', icon: 'calendar' },
    { id: 'revenue', label: 'Revenue', icon: 'cash' },
    { id: 'views', label: 'Views', icon: 'eye' },
    { id: 'conversion', label: 'Conversion Rate', icon: 'trending-up' },
  ];

  const toggleMetric = (metricId: string) => {
    setSelectedMetrics(current =>
      current.includes(metricId)
        ? current.filter(id => id !== metricId)
        : [...current, metricId]
    );
  };

  const handleExport = () => {
    if (onExport) {
      onExport({
        period: selectedPeriod,
        metrics: selectedMetrics,
        data: {
          bookings: data.bookings,
          revenue: data.bookings.revenue,
          topServices: data.topServices,
        },
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>Loading reports...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.errorText}>Failed to load reports</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Generate Report</Text>
        <TouchableOpacity
          style={styles.exportButton}
          onPress={handleExport}>
          <Ionicons name="download" size={20} color="#FFFFFF" />
          <Text style={styles.exportButtonText}>Export Report</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filters}>
        <View style={styles.periodSelector}>
          <Text style={styles.filterLabel}>Time Period</Text>
          <View style={styles.periodButtons}>
            {periods.map(period => (
              <TouchableOpacity
                key={period.id}
                style={[
                  styles.periodButton,
                  selectedPeriod === period.id && styles.periodButtonActive,
                ]}
                onPress={() => setSelectedPeriod(period.id as any)}>
                <Text
                  style={[
                    styles.periodButtonText,
                    selectedPeriod === period.id && styles.periodButtonTextActive,
                  ]}>
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.metricSelector}>
          <Text style={styles.filterLabel}>Metrics</Text>
          <View style={styles.metricButtons}>
            {metrics.map(metric => (
              <TouchableOpacity
                key={metric.id}
                style={[
                  styles.metricButton,
                  selectedMetrics.includes(metric.id) && styles.metricButtonActive,
                ]}
                onPress={() => toggleMetric(metric.id)}>
                <Ionicons
                  name={metric.icon as any}
                  size={20}
                  color={selectedMetrics.includes(metric.id) ? '#45B08C' : '#A0AEC0'}
                />
                <Text
                  style={[
                    styles.metricButtonText,
                    selectedMetrics.includes(metric.id) && styles.metricButtonTextActive,
                  ]}>
                  {metric.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.reportPreview}>
        <Text style={styles.sectionTitle}>Report Preview</Text>
        
        {selectedMetrics.includes('bookings') && (
          <View style={styles.chart}>
            <Text style={styles.chartTitle}>Booking Trends</Text>
            <LineChart
              data={{
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                  data: [20, 45, 28, 80, 99, 43, 50],
                }],
              }}
              height={220}
            />
          </View>
        )}

        {selectedMetrics.includes('revenue') && (
          <View style={styles.chart}>
            <Text style={styles.chartTitle}>Revenue by Service</Text>
            <BarChart
              data={{
                labels: data.topServices.map(service => service.name),
                datasets: [{
                  data: data.topServices.map(service => service.revenue),
                }],
              }}
              height={220}
            />
          </View>
        )}

        <View style={styles.summaryStats}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Bookings</Text>
            <Text style={styles.statValue}>{data.bookings.total}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Revenue</Text>
            <Text style={styles.statValue}>
              ISK {data.bookings.revenue.toLocaleString()}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Average Booking Value</Text>
            <Text style={styles.statValue}>
              ISK {data.bookings.averageValue.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageContainer: {
    padding: 20,
    alignItems: 'center',
  },
  messageText: {
    color: '#A0AEC0',
    fontSize: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#45B08C',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  exportButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  filters: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  periodSelector: {
    marginBottom: 16,
  },
  periodButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  periodButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: 'rgba(69, 176, 140, 0.2)',
    borderWidth: 1,
    borderColor: '#45B08C',
  },
  periodButtonText: {
    color: '#A0AEC0',
    fontSize: 14,
  },
  periodButtonTextActive: {
    color: '#45B08C',
    fontWeight: '500',
  },
  metricSelector: {},
  metricButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  metricButtonActive: {
    backgroundColor: 'rgba(69, 176, 140, 0.2)',
    borderWidth: 1,
    borderColor: '#45B08C',
  },
  metricButtonText: {
    color: '#A0AEC0',
    fontSize: 14,
  },
  metricButtonTextActive: {
    color: '#45B08C',
    fontWeight: '500',
  },
  reportPreview: {
    gap: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  chart: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  summaryStats: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
  },
  statLabel: {
    fontSize: 14,
    color: '#A0AEC0',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});