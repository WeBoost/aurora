import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { USPBadge } from '../../components/USPBadge';
import { Footer } from '../../components/Footer';
import { WeatherWidget } from '@/components/WeatherWidget';
import { useWeather } from '@/hooks/useWeather';

const { width } = Dimensions.get('window');

const StatisticItem = ({ number, label, color = '#45B08C' }: { number: string; label: string; color?: string }) => (
  <View style={styles.statItem}>
    <Text style={[styles.statNumber, { color }]}>{number}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const FeatureCard = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
  <View style={styles.featureCard}>
    <Ionicons name={icon as any} size={48} color="#45B08C" />
    <Text style={styles.featureTitle}>{title}</Text>
    <Text style={styles.featureDescription}>{description}</Text>
    <TouchableOpacity style={styles.learnMoreButton}>
      <Text style={styles.learnMoreText}>Learn More</Text>
      <Ionicons name="arrow-forward" size={16} color="#45B08C" />
    </TouchableOpacity>
  </View>
);

const TestimonialCard = ({ text, author, location }: { text: string; author: string; location: string }) => (
  <View style={styles.testimonialCard}>
    <View style={styles.stars}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Ionicons key={star} name="star" size={20} color="#FFD700" />
      ))}
    </View>
    <Text style={styles.testimonialText}>{text}</Text>
    <View style={styles.testimonialAuthor}>
      <View style={styles.authorAvatar} />
      <View>
        <Text style={styles.authorName}>{author}</Text>
        <Text style={styles.authorLocation}>{location}</Text>
      </View>
    </View>
  </View>
);

const WeatherSection = () => {
  const { weather, loading, error } = useWeather();
  const router = useRouter();

  if (loading) {
    return (
      <View style={styles.weatherSection}>
        <Text style={[styles.sectionHeading, styles.darkText]}>Current Conditions</Text>
        <View style={styles.weatherGrid}>
          <Text style={styles.loadingText}>Loading weather data...</Text>
        </View>
      </View>
    );
  }

  if (error || !weather) {
    return (
      <View style={styles.weatherSection}>
        <Text style={[styles.sectionHeading, styles.darkText]}>Current Conditions</Text>
        <View style={styles.weatherGrid}>
          <Text style={styles.errorText}>Failed to load weather data</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.weatherSection}>
      <Text style={[styles.sectionHeading, styles.darkText]}>
        Current Conditions in {weather.location.name}
      </Text>
      <View style={styles.weatherGrid}>
        <View style={styles.weatherItem}>
          <Text style={styles.weatherLabel}>Temperature</Text>
          <Text style={styles.weatherValue}>
            {Math.round(weather.temperature)}°C
          </Text>
          <Text style={styles.weatherCondition}>{weather.condition}</Text>
        </View>
        <View style={styles.weatherItem}>
          <Text style={styles.weatherLabel}>Aurora Forecast</Text>
          <View style={styles.auroraIndicator}>
            <Ionicons 
              name="flash" 
              size={24} 
              color={
                weather.auroraForecast.intensity === 'high' ? '#45B08C' :
                weather.auroraForecast.intensity === 'medium' ? '#FFD700' :
                '#A0AEC0'
              } 
            />
            <Text style={[
              styles.auroraText,
              { 
                color: weather.auroraForecast.intensity === 'high' ? '#45B08C' :
                      weather.auroraForecast.intensity === 'medium' ? '#FFD700' :
                      '#A0AEC0'
              }
            ]}>
              {weather.auroraForecast.probability}% chance
            </Text>
          </View>
        </View>
        <View style={styles.weatherItem}>
          <Text style={styles.weatherLabel}>Sunrise</Text>
          <Text style={styles.weatherValue}>{weather.sunrise}</Text>
          <View style={styles.sunIndicator}>
            <Ionicons name="sunny" size={20} color="#FFD700" />
          </View>
        </View>
        <View style={styles.weatherItem}>
          <Text style={styles.weatherLabel}>Sunset</Text>
          <Text style={styles.weatherValue}>{weather.sunset}</Text>
          <View style={styles.sunIndicator}>
            <Ionicons name="moon" size={20} color="#A0AEC0" />
          </View>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.weatherButton}
        onPress={() => router.push('/map')}>
        <Text style={styles.weatherButtonText}>View Weather Map</Text>
        <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

export default function HomePage() {
  const BlurComponent = Platform.OS === 'web' ? View : BlurView;
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.mainContent}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=2850&q=80' }}
          style={StyleSheet.absoluteFillObject}
        />
        <LinearGradient
          colors={['rgba(11, 16, 33, 0.8)', 'rgba(11, 16, 33, 0.95)']}
          style={StyleSheet.absoluteFillObject}
        />

        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Helping You Find Iceland</Text>
          <Text style={styles.heroSubtitle}>
            Aurora are Iceland's first dedicated provider of digital tools and websites, helping businesses be found and visitors find what they want.
          </Text>
          <View style={styles.uspContainer}>
            <USPBadge icon="shield-checkmark" text="Trusted by 500+ Businesses" />
            <USPBadge icon="time" text="24/7 Support" />
            <USPBadge icon="globe" text="Multi-language" />
          </View>
        </View>

        <View style={styles.mainSections}>
          <View style={styles.businessSection}>
            <View style={styles.sectionContent}>
              <Ionicons name="business" size={32} color="#45B08C" />
              <Text style={styles.sectionTitle}>For Businesses</Text>
              <Text style={styles.sectionDescription}>
                Create your professional website with AI-powered tools and grow your business online.
              </Text>
              <TouchableOpacity 
                style={styles.getStartedButton}
                onPress={() => router.push('/sign-up?type=business')}>
                <Text style={styles.getStartedButtonText}>Get Started</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.uspList}>
                <View style={styles.uspItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#45B08C" />
                  <Text style={styles.uspItemText}>AI-powered website builder</Text>
                </View>
                <View style={styles.uspItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#45B08C" />
                  <Text style={styles.uspItemText}>Multi-language support</Text>
                </View>
                <View style={styles.uspItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#45B08C" />
                  <Text style={styles.uspItemText}>Booking management</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.visitorSection}>
            <View style={styles.sectionContent}>
              <Ionicons name="people" size={32} color="#45B08C" />
              <Text style={styles.sectionTitle}>For Visitors</Text>
              <BlurComponent intensity={20} style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#A0AEC0" />
                <TextInput
                  placeholder="Search businesses..."
                  placeholderTextColor="#A0AEC0"
                  style={styles.searchInput}
                />
              </BlurComponent>
              <View style={styles.categoryButtons}>
                <TouchableOpacity style={styles.categoryButton}>
                  <Ionicons name="airplane" size={20} color="#45B08C" />
                  <Text style={styles.categoryButtonText}>Tours</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryButton}>
                  <Ionicons name="bed" size={20} color="#45B08C" />
                  <Text style={styles.categoryButtonText}>Hotels</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryButton}>
                  <Ionicons name="restaurant" size={20} color="#45B08C" />
                  <Text style={styles.categoryButtonText}>Restaurants</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryButton}>
                  <Ionicons name="bicycle" size={20} color="#45B08C" />
                  <Text style={styles.categoryButtonText}>Activities</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity 
                style={styles.signUpButton}
                onPress={() => router.push('/sign-up?type=visitor')}>
                <Text style={styles.signUpButtonText}>Sign up for free</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.statsSection}>
          <StatisticItem number="500+" label="Businesses" color="#45B08C" />
          <StatisticItem number="50K+" label="Monthly Visitors" color="#9B4F96" />
          <StatisticItem number="100%" label="Iceland Coverage" color="#A1D6E2" />
          <StatisticItem number="24/7" label="Support" color="#45B08C" />
        </View>

        <View style={styles.featuresSection}>
          <Text style={[styles.sectionHeading, styles.darkText]}>Why Choose Aurora</Text>
          <View style={styles.featuresGrid}>
            <FeatureCard
              icon="globe"
              title="Custom Domains"
              description="Choose between a subdomain or your own custom domain based on your package."
            />
            <FeatureCard
              icon="flash"
              title="AI-Powered"
              description="Leverage artificial intelligence to create and optimize your website content."
            />
            <FeatureCard
              icon="shield-checkmark"
              title="Secure & Fast"
              description="Built with security and performance in mind for the best user experience."
            />
          </View>
          <TouchableOpacity 
            style={styles.viewAllFeaturesButton}
            onPress={() => router.push('/pricing')}>
            <Text style={styles.viewAllFeaturesText}>View All Features</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.testimonialsSection}>
          <Text style={[styles.sectionHeading, styles.darkText]}>Trusted by Icelandic Businesses</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.testimonialsList}>
            <TestimonialCard
              text="Aurora Digital has transformed our online presence. Our website now attracts more tourists than ever before."
              author="Jón Jónsson"
              location="Reykjavík"
            />
            <TestimonialCard
              text="The AI-powered tools have made it so easy to maintain our website and keep our content fresh and engaging."
              author="Anna Sigurðardóttir"
              location="Akureyri"
            />
            <TestimonialCard
              text="Exceptional support team and powerful features. Highly recommend for any Icelandic business."
              author="Guðmundur Guðmundsson"
              location="Höfn"
            />
          </ScrollView>
        </View>

        <WeatherSection />
      </View>
      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1021',
  },
  content: {
    flexGrow: 1,
    ...(Platform.OS === 'web' ? {
      paddingBottom: 60,
    } : {}),
  },
  mainContent: {
    flex: 1,
    position: 'relative',
  },
  heroSection: {
    padding: 40,
    alignItems: 'center',
    marginTop: 40,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#A0AEC0',
    textAlign: 'center',
    maxWidth: 600,
    lineHeight: 28,
    marginBottom: 32,
  },
  uspContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    marginTop: 24,
  },
  mainSections: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    padding: 20,
    gap: 20,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  businessSection: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  visitorSection: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  sectionContent: {
    padding: 30,
    gap: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sectionDescription: {
    fontSize: 16,
    color: '#A0AEC0',
    lineHeight: 24,
  },
  uspList: {
    marginTop: 20,
    gap: 12,
  },
  uspItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  uspItemText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#45B08C',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
    alignSelf: 'flex-start',
  },
  getStartedButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  categoryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  signUpButton: {
    backgroundColor: '#45B08C',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 40,
    gap: 20,
    backgroundColor: '#0F172A',
    marginTop: 60,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 16,
    color: '#A0AEC0',
    marginTop: 4,
  },
  featuresSection: {
    padding: 40,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40,
  },
  darkText: {
    color: '#0F172A',
  },
  featuresGrid: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    gap: 20,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    marginBottom: 40,
  },
  featureCard: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: 16,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  learnMoreText: {
    color: '#45B08C',
    fontSize: 14,
    fontWeight: '500',
  },
  viewAllFeaturesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#45B08C',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
    alignSelf: 'center',
  },
  viewAllFeaturesText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  testimonialsSection: {
    padding: 40,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  testimonialsList: {
    marginHorizontal: -20,
  },
  testimonialCard: {
    width: Math.min(width - 40, 400),
    marginHorizontal: 10,
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  stars: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  testimonialText: {
    fontSize: 16,
    color: '#0F172A',
    lineHeight: 24,
    marginBottom: 16,
  },
  testimonialAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 12,
  },
  authorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  authorLocation: {
    fontSize: 14,
    color: '#64748B',
  },
  weatherSection: {
    padding: 40,
    backgroundColor: '#FFFFFF',
  },
  weatherGrid: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 20,
    padding: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  weatherItem: {
    flex: 1,
    minWidth: Platform.OS === 'web' ? 200 : '100%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  weatherLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  weatherValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  weatherCondition: {
    fontSize: 14,
    color: '#64748B',
  },
  auroraIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  auroraText: {
    fontSize: 16,
    fontWeight: '500',
  },
  sunIndicator: {
    marginTop: 8,
  },
  weatherButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#45B08C',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
    marginTop: 24,
    alignSelf: 'center',
  },
  weatherButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  loadingText: {
    color: '#64748B',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
});