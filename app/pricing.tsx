import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PriceToggle } from '../components/PriceToggle';
import { LinearGradient } from 'expo-linear-gradient';

const SECTORS = {
  restaurants: {
    name: 'Restaurants',
    icon: 'restaurant',
    features: [
      'Menu management system',
      'Table reservation system',
      'Kitchen display integration',
      'Online ordering platform'
    ]
  },
  bars: {
    name: 'Bars',
    icon: 'beer',
    features: [
      'Event management',
      'Happy hour scheduling',
      'Inventory tracking',
      'Age verification system'
    ]
  },
  cafes: {
    name: 'Cafes',
    icon: 'cafe',
    features: [
      'Order management system',
      'Loyalty program',
      'Digital menu boards',
      'Queue management'
    ]
  },
  takeaways: {
    name: 'Takeaways/Fast Food',
    icon: 'fast-food',
    features: [
      'Delivery integration',
      'Order tracking system',
      'Kitchen management',
      'Mobile ordering app'
    ]
  },
  spas: {
    name: 'Spas & Wellness',
    icon: 'water',
    features: [
      'Appointment scheduling',
      'Treatment room management',
      'Staff allocation',
      'Package deals system'
    ]
  },
  hotels: {
    name: 'Hotels & Accommodation',
    icon: 'bed',
    features: [
      'Room booking system',
      'Housekeeping management',
      'Guest services portal',
      'Facility scheduling'
    ]
  },
  tours: {
    name: 'Tours & Guides',
    icon: 'compass',
    features: [
      'Tour booking system',
      'Guide assignment',
      'Route planning',
      'Weather integration'
    ]
  },
  activities: {
    name: 'Things To Do',
    icon: 'bicycle',
    features: [
      'Activity scheduling',
      'Equipment rental',
      'Capacity management',
      'Safety waivers'
    ]
  }
};

const PACKAGES = [
  {
    name: 'Starter',
    price: 9900,
    commission: 5,
    description: 'Perfect for small businesses just getting started',
    features: [
      'Free .aurora.tech subdomain',
      'Basic website template',
      'Mobile-responsive design',
      'Basic booking system',
      'Email support',
      'SSL certificate',
      '5% commission rate',
    ],
  },
  {
    name: 'Professional',
    price: 19900,
    commission: 3,
    description: 'Ideal for growing businesses with specific needs',
    features: [
      'Everything in Starter, plus:',
      'Custom domain support',
      'Advanced sector features',
      'Multi-language support',
      'Priority support',
      'Analytics dashboard',
      'Payment processing',
      'Customer reviews',
      '3% commission rate',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 49900,
    commission: 1,
    description: 'For established businesses needing full capabilities',
    features: [
      'Everything in Professional, plus:',
      'Multiple locations',
      'API access',
      'Custom integrations',
      'Dedicated support',
      'Advanced analytics',
      'White-label options',
      'Staff training',
      '1% commission rate',
    ],
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  const calculatePrice = (monthlyPrice: number) => {
    if (isAnnual) {
      const annualPrice = monthlyPrice * 12;
      const discountedPrice = annualPrice * 0.8; // 20% discount
      return Math.round(discountedPrice / 12);
    }
    return monthlyPrice;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Sector</Text>
        <Text style={styles.subtitle}>
          Select your business type to see specialized features
        </Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.sectorScroll}
        contentContainerStyle={styles.sectorContainer}>
        {Object.entries(SECTORS).map(([key, sector]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.sectorCard,
              selectedSector === key && styles.sectorCardSelected,
            ]}
            onPress={() => setSelectedSector(key)}>
            <Ionicons 
              name={sector.icon as any} 
              size={24} 
              color={selectedSector === key ? '#45B08C' : '#A0AEC0'} 
            />
            <Text 
              style={[
                styles.sectorName,
                selectedSector === key && styles.sectorNameSelected,
              ]}>
              {sector.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedSector && (
        <View style={styles.sectorFeatures}>
          <Text style={styles.sectorFeaturesTitle}>
            Specialized Features for {SECTORS[selectedSector as keyof typeof SECTORS].name}
          </Text>
          <View style={styles.featuresList}>
            {SECTORS[selectedSector as keyof typeof SECTORS].features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color="#45B08C" />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.pricingTitle}>Pricing Plans</Text>
        <Text style={styles.pricingSubtitle}>
          Choose the perfect plan for your business
        </Text>

        <PriceToggle isAnnual={isAnnual} onToggle={setIsAnnual} />

        <View style={styles.packages}>
          {PACKAGES.map((pkg) => (
            <View
              key={pkg.name}
              style={[
                styles.packageCard,
                pkg.popular && styles.popularPackage,
              ]}>
              {pkg.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>Most Popular</Text>
                </View>
              )}
              <Text style={styles.packageName}>{pkg.name}</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.currency}>ISK</Text>
                <Text style={styles.price}>
                  {calculatePrice(pkg.price).toLocaleString()}
                </Text>
                <Text style={styles.period}>/{isAnnual ? 'mo (billed annually)' : 'month'}</Text>
              </View>
              <Text style={styles.packageDescription}>{pkg.description}</Text>
              <View style={styles.features}>
                {pkg.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="#45B08C"
                    />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
                {selectedSector && pkg.name !== 'Starter' && (
                  <>
                    <View style={styles.sectorFeatureDivider} />
                    {SECTORS[selectedSector as keyof typeof SECTORS].features.map((feature, index) => (
                      <View key={`sector-${index}`} style={styles.featureItem}>
                        <Ionicons name="checkmark-circle" size={20} color="#45B08C" />
                        <Text style={styles.featureText}>{feature}</Text>
                      </View>
                    ))}
                  </>
                )}
              </View>
              <TouchableOpacity
                style={[
                  styles.selectButton,
                  pkg.popular && styles.selectButtonPopular,
                ]}
                onPress={() => router.push('/sign-up?type=business')}>
                <Text
                  style={[
                    styles.selectButtonText,
                    pkg.popular && styles.selectButtonTextPopular,
                  ]}>
                  Get Started
                </Text>
              </TouchableOpacity>
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
    backgroundColor: '#0B1021',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#A0AEC0',
    textAlign: 'center',
    marginBottom: 24,
  },
  sectorScroll: {
    marginBottom: 24,
  },
  sectorContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  sectorCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: 120,
    gap: 8,
  },
  sectorCardSelected: {
    backgroundColor: 'rgba(69, 176, 140, 0.1)',
    borderWidth: 1,
    borderColor: '#45B08C',
  },
  sectorName: {
    fontSize: 14,
    color: '#A0AEC0',
    textAlign: 'center',
  },
  sectorNameSelected: {
    color: '#45B08C',
  },
  sectorFeatures: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    marginBottom: 24,
  },
  sectorFeaturesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  featuresList: {
    gap: 12,
  },
  content: {
    padding: 20,
  },
  pricingTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  pricingSubtitle: {
    fontSize: 18,
    color: '#A0AEC0',
    textAlign: 'center',
    marginBottom: 40,
  },
  packages: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    gap: 20,
  },
  packageCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 16,
    padding: 24,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  popularPackage: {
    backgroundColor: 'rgba(69, 176, 140, 0.1)',
    borderWidth: 2,
    borderColor: '#45B08C',
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    right: 24,
    backgroundColor: '#45B08C',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 100,
  },
  popularBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  packageName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  currency: {
    fontSize: 20,
    color: '#FFFFFF',
    marginRight: 4,
  },
  price: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  period: {
    fontSize: 16,
    color: '#A0AEC0',
    marginLeft: 4,
  },
  packageDescription: {
    fontSize: 16,
    color: '#A0AEC0',
    marginBottom: 24,
  },
  features: {
    gap: 12,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  sectorFeatureDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 12,
  },
  selectButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectButtonPopular: {
    backgroundColor: '#45B08C',
    borderColor: '#45B08C',
  },
  selectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  selectButtonTextPopular: {
    color: '#FFFFFF',
  },
});