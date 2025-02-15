import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAnalytics } from '@/hooks/useAnalytics';
import { AnimatedCounter } from './AnimatedCounter';
import { LineChart } from './charts/LineChart';
import { BarChart } from './charts/BarChart';

interface AnalyticsDashboardProps {
  businessId: string;
}

export function AnalyticsDashboard({ businessId }: AnalyticsDashboardProps) {
  const { data, loading, error } = useAnalytics(businessId);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading analytics...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#EF4444" />
        <Text style={styles.errorText}>Failed to load analytics</Text>
      </View>
    );
  }

  // Sample data for charts - replace with real data from your analytics
  const bookingTrends = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(69, 176, 140, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const revenueByService = {
    labels: data.topServices.map(service => service.name),
    datasets: [{
      data: data.topServices.map(service => service.revenue),
    }],
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics Dashboard</Text>
        <Text style={styles.subtitle}>Track your business performance</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Ionicons name="eye" size={24} color="#45B08C" />
          </View>
          <AnimatedCounter
            end={data.views}
            style={styles.statValue}
          />
          <Text style={styles.statLabel}>Profile Views</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Ionicons name="calendar" size={24} color="#9B4F96" />
          </View>
          <AnimatedCounter
            end={data.bookings.total}
            style={styles.statValue}
          />
          <Text style={styles.statLabel}>Total Bookings</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Ionicons name="checkmark-circle" size={24} color="#45B08C" />
          </View>
          <AnimatedCounter
            end={data.bookings.completed}
            style={styles.statValue}
          />
          <Text style={styles.statLabel}>Completed</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Ionicons name="cash" size={24} color="#A1D6E2" />
          </View>
          <AnimatedCounter
            end={data.bookings.revenue}
            prefix="ISK "
            style={styles.statValue}
          />
          <Text style={styles.statLabel}>Revenue</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Booking Trends</Text>
        <LineChart
          data={bookingTrends}
          height={220}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Revenue by Service</Text>
        <BarChart
          data={revenueByService}
          height={220}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Services</Text>
        <View style={styles.servicesGrid}>
          {data.topServices.map((service) => (
            <View key={service.name} style={styles.serviceCard}>
              <Text style={styles.serviceName}>{service.name}</Text>
              <View style={styles.serviceStats}>
                <View style={styles.serviceStat}>
                  <Text style={styles.serviceStatValue}>
                    {service.bookings}
                  </Text>
                  <Text style={styles.serviceStatLabel}>Bookings</Text>
                </View>
                <View style={styles.serviceStat}>
                  <Text style={styles.serviceStatValue}>
                    ISK {service.revenue.toLocaleString()}
                  </Text>
                  <Text style={styles.serviceStatLabel}>Revenue</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityList}>
          {data.recentActivity.map((activity, index) => (
            <View key={index} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons
                  name={
                    activity.type === 'booking'
                      ? 'calendar'
                      : activity.type === 'view'
                      ? 'eye'
                      : 'star'
                  }
                  size={20}
                  color="#45B08C"
                />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>
                  {activity.type === 'booking'
                    ? `New booking from ${activity.details.customer_name}`
                    : activity.type === 'view'
                    ? 'Profile viewed'
                    : 'New review'}
                </Text>
                <Text style={styles.activityTime}>
                  {new Date(activity.timestamp).toLocaleString()}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#A0AEC0',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    flexWrap: 'wrap',
    gap: 16,
    padding: 20,
  },
  statCard: {
    flex: 1,
    minWidth: Platform.OS === 'web' ? 200 : '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(69, 176, 140, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  servicesGrid: {
    gap: 16,
  },
  serviceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  serviceStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  serviceStat: {
    alignItems: 'center',
  },
  serviceStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#45B08C',
    marginBottom: 4,
  },
  serviceStatLabel: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(69, 176, 140, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#A0AEC0',
  },
});