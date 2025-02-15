import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../../../hooks/useAuth';
import { useBusiness } from '../../../../hooks/useBusiness';
import { useServices } from '../../../../hooks/useServices';

export default function BusinessDetailsPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();
  const { business, loading: businessLoading } = useBusiness(params.id);
  const { services, loading: servicesLoading } = useServices(params.id);
  const [selectedTab, setSelectedTab] = useState('about');

  if (businessLoading || servicesLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!business) {
    return (
      <View style={styles.container}>
        <View style={styles.errorState}>
          <Ionicons name="alert-circle" size={48} color="#EF4444" />
          <Text style={styles.errorTitle}>Business Not Found</Text>
          <Text style={styles.errorDescription}>
            The business you're looking for doesn't exist or has been removed
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Image
            source={
              business.logo_url
                ? { uri: business.logo_url }
                : { uri: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=2850&q=80' }
            }
            style={styles.coverImage}
          />
          <LinearGradient
            colors={['transparent', 'rgba(11, 16, 33, 0.95)']}
            style={styles.gradient}
          />
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.businessInfo}>
            <Text style={styles.businessName}>{business.name}</Text>
            <View style={styles.businessMeta}>
              <View style={styles.businessCategory}>
                <Ionicons name="pricetag" size={16} color="#A0AEC0" />
                <Text style={styles.businessCategoryText}>{business.category}</Text>
              </View>
              <View style={styles.businessLocation}>
                <Ionicons name="location" size={16} color="#A0AEC0" />
                <Text style={styles.businessLocationText}>{business.city}</Text>
              </View>
            </View>
            <View style={styles.businessStats}>
              <View style={styles.statBadge}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.statText}>4.8 (124 reviews)</Text>
              </View>
              <View style={styles.statBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#45B08C" />
                <Text style={styles.statText}>Verified Business</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'about' && styles.tabActive]}
            onPress={() => setSelectedTab('about')}>
            <Text
              style={[
                styles.tabText,
                selectedTab === 'about' && styles.tabTextActive,
              ]}>
              About
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'services' && styles.tabActive]}
            onPress={() => setSelectedTab('services')}>
            <Text
              style={[
                styles.tabText,
                selectedTab === 'services' && styles.tabTextActive,
              ]}>
              Services
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'reviews' && styles.tabActive]}
            onPress={() => setSelectedTab('reviews')}>
            <Text
              style={[
                styles.tabText,
                selectedTab === 'reviews' && styles.tabTextActive,
              ]}>
              Reviews
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {selectedTab === 'about' && (
            <View style={styles.about}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>About Us</Text>
                <Text style={styles.description}>{business.description}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Contact Information</Text>
                <View style={styles.contactList}>
                  {business.email && (
                    <View style={styles.contactItem}>
                      <Ionicons name="mail" size={20} color="#45B08C" />
                      <Text style={styles.contactText}>{business.email}</Text>
                    </View>
                  )}
                  {business.phone && (
                    <View style={styles.contactItem}>
                      <Ionicons name="call" size={20} color="#45B08C" />
                      <Text style={styles.contactText}>{business.phone}</Text>
                    </View>
                  )}
                  {business.website && (
                    <View style={styles.contactItem}>
                      <Ionicons name="globe" size={20} color="#45B08C" />
                      <Text style={styles.contactText}>{business.website}</Text>
                    </View>
                  )}
                  {business.address && (
                    <View style={styles.contactItem}>
                      <Ionicons name="location" size={20} color="#45B08C" />
                      <Text style={styles.contactText}>
                        {business.address}, {business.city}, {business.postal_code}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Business Hours</Text>
                <View style={styles.hoursList}>
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <View key={day} style={styles.hoursItem}>
                      <Text style={styles.dayText}>{day}</Text>
                      <Text style={styles.hoursText}>9:00 AM - 5:00 PM</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          {selectedTab === 'services' && (
            <View style={styles.services}>
              {services.map((service) => (
                <View key={service.id} style={styles.serviceCard}>
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    <Text style={styles.serviceDescription}>
                      {service.description}
                    </Text>
                    <View style={styles.serviceDetails}>
                      <View style={styles.serviceDetail}>
                        <Ionicons name="time" size={16} color="#A0AEC0" />
                        <Text style={styles.serviceDetailText}>
                          {service.duration}
                        </Text>
                      </View>
                      <View style={styles.serviceDetail}>
                        <Ionicons name="people" size={16} color="#A0AEC0" />
                        <Text style={styles.serviceDetailText}>
                          Max {service.max_capacity} people
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.servicePrice}>
                    <Text style={styles.servicePriceAmount}>
                      {service.price.toLocaleString()} ISK
                    </Text>
                    <Text style={styles.servicePriceLabel}>per person</Text>
                    <TouchableOpacity
                      style={styles.bookButton}
                      onPress={() => router.push(`/business/${business.id}/book`)}>
                      <Text style={styles.bookButtonText}>Book Now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {selectedTab === 'reviews' && (
            <View style={styles.reviews}>
              <View style={styles.reviewsSummary}>
                <View style={styles.ratingCard}>
                  <Text style={styles.ratingScore}>4.8</Text>
                  <View style={styles.ratingStars}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Ionicons
                        key={star}
                        name="star"
                        size={20}
                        color="#FFD700"
                      />
                    ))}
                  </View>
                  <Text style={styles.ratingCount}>124 reviews</Text>
                </View>
                <View style={styles.ratingBars}>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <View key={rating} style={styles.ratingBar}>
                      <Text style={styles.ratingNumber}>{rating}</Text>
                      <View style={styles.ratingBarTrack}>
                        <View
                          style={[
                            styles.ratingBarFill,
                            { width: `${rating * 20}%` },
                          ]}
                        />
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.reviewsList}>
                {[1, 2, 3].map((review) => (
                  <View key={review} style={styles.reviewCard}>
                    <View style={styles.reviewHeader}>
                      <View style={styles.reviewAuthor}>
                        <View style={styles.reviewAvatar} />
                        <View>
                          <Text style={styles.reviewName}>John Doe</Text>
                          <Text style={styles.reviewDate}>2 days ago</Text>
                        </View>
                      </View>
                      <View style={styles.reviewRating}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Ionicons
                            key={star}
                            name="star"
                            size={16}
                            color="#FFD700"
                          />
                        ))}
                      </View>
                    </View>
                    <Text style={styles.reviewText}>
                      Amazing experience! The staff was very friendly and professional.
                      Would definitely recommend to anyone visiting Iceland.
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.bookingButton}
          onPress={() => router.push(`/business/${business.id}/book`)}>
          <Text style={styles.bookingButtonText}>Book Now</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
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
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  errorDescription: {
    fontSize: 16,
    color: '#A0AEC0',
    textAlign: 'center',
    marginBottom: 24,
  },
  header: {
    height: 300,
    position: 'relative',
  },
  coverImage: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  businessInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  businessName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  businessMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  businessCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  businessCategoryText: {
    color: '#A0AEC0',
    fontSize: 14,
  },
  businessLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  businessLocationText: {
    color: '#A0AEC0',
    fontSize: 14,
  },
  businessStats: {
    flexDirection: 'row',
    gap: 12,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 100,
    gap: 4,
  },
  statText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  tabs: {
    flexDirection: 'row',
    padding: 20,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
  },
  tabActive: {
    backgroundColor: 'rgba(69, 176, 140, 0.1)',
  },
  tabText: {
    color: '#A0AEC0',
    fontSize: 14,
  },
  tabTextActive: {
    color: '#45B08C',
    fontWeight: '500',
  },
  content: {
    padding: 20,
  },
  about: {
    gap: 32,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  description: {
    fontSize: 16,
    color: '#A0AEC0',
    lineHeight: 24,
  },
  contactList: {
    gap: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  hoursList: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  hoursItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  dayText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  hoursText: {
    fontSize: 16,
    color: '#A0AEC0',
  },
  services: {
    gap: 16,
  },
  serviceCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#A0AEC0',
    marginBottom: 12,
  },
  serviceDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  serviceDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  serviceDetailText: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  servicePrice: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginLeft: 16,
  },
  servicePriceAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#45B08C',
  },
  servicePriceLabel: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  bookButton: {
    backgroundColor: '#45B08C',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  reviews: {
    gap: 32,
  },
  reviewsSummary: {
    flexDirection: 'row',
    gap: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
  },
  ratingCard: {
    alignItems: 'center',
    gap: 8,
  },
  ratingScore: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  ratingStars: {
    flexDirection: 'row',
    gap: 4,
  },
  ratingCount: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  ratingBars: {
    flex: 1,
    gap: 8,
  },
  ratingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingNumber: {
    width: 20,
    fontSize: 14,
    color: '#A0AEC0',
    textAlign: 'center',
  },
  ratingBarTrack: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
  },
  ratingBarFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 2,
  },
  reviewsList: {
    gap: 16,
  },
  reviewCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reviewAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  reviewName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  reviewDate: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  reviewRating: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewText: {
    fontSize: 14,
    color: '#A0AEC0',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    backgroundColor: 'rgba(11, 16, 33, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  bookingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#45B08C',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  bookingButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});