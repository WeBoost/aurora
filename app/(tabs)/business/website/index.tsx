import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/hooks/useAuth';
import { useBusiness } from '@/hooks/useBusiness';
import { useWebsiteBuilder } from '@/hooks/useWebsiteBuilder';

const SECTION_TYPES = [
  {
    id: 'hero',
    name: 'Hero Section',
    icon: 'image',
    description: 'Large header section with image background',
  },
  {
    id: 'features',
    name: 'Features',
    icon: 'grid',
    description: 'Showcase your key features or services',
  },
  {
    id: 'gallery',
    name: 'Gallery',
    icon: 'images',
    description: 'Display photos in a grid layout',
  },
  {
    id: 'testimonials',
    name: 'Testimonials',
    icon: 'chatbubbles',
    description: 'Customer reviews and feedback',
  },
  {
    id: 'contact',
    name: 'Contact Form',
    icon: 'mail',
    description: 'Contact form with map',
  },
  {
    id: 'cta',
    name: 'Call to Action',
    icon: 'megaphone',
    description: 'Prompt visitors to take action',
  },
];

export default function WebsiteBuilderPage() {
  const router = useRouter();
  const { session } = useAuth();
  const { business, loading: businessLoading } = useBusiness(session?.user?.id);
  const {
    website,
    content,
    loading: websiteLoading,
    error,
    addSection,
    removeSection,
    updateWebsite,
    publishWebsite,
  } = useWebsiteBuilder(business?.id);

  const [showAddSection, setShowAddSection] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const loading = businessLoading || websiteLoading;

  const handlePublish = async () => {
    try {
      setPublishing(true);
      await publishWebsite();
      router.push('/business/website/deploy');
    } catch (e) {
      console.error('Failed to publish website:', e);
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load website data</Text>
      </View>
    );
  }

  if (!business) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Ionicons name="business" size={48} color="#45B08C" />
          <Text style={styles.emptyStateTitle}>Create Your Business First</Text>
          <Text style={styles.emptyStateDescription}>
            You need to create a business profile before building your website
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

  if (!website) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Ionicons name="globe" size={48} color="#45B08C" />
          <Text style={styles.emptyStateTitle}>Create Your Website</Text>
          <Text style={styles.emptyStateDescription}>
            Get started by choosing a template for your website
          </Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => router.push('/business/website/templates')}>
            <Text style={styles.createButtonText}>Choose Template</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Website Builder</Text>
          <Text style={styles.subtitle}>
            Build and customize your business website
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.previewButton}
            onPress={() => router.push('/business/website/preview')}>
            <Ionicons name="eye" size={20} color="#FFFFFF" />
            <Text style={styles.previewButtonText}>Preview</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.publishButton, publishing && styles.publishButtonDisabled]}
            onPress={handlePublish}
            disabled={publishing}>
            <Ionicons name="globe" size={20} color="#FFFFFF" />
            <Text style={styles.publishButtonText}>
              {publishing ? 'Publishing...' : 'Publish'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.websiteInfo}>
        <View style={styles.domainInfo}>
          <Text style={styles.domainLabel}>Your Website URL</Text>
          <View style={styles.domainValue}>
            <Text style={styles.url}>
              https://{website.subdomain}.aurora.tech
            </Text>
            <TouchableOpacity style={styles.copyButton}>
              <Ionicons name="copy" size={20} color="#45B08C" />
            </TouchableOpacity>
          </View>
          {website.custom_domain && (
            <View style={styles.domainValue}>
              <Text style={styles.url}>https://{website.custom_domain}</Text>
              <TouchableOpacity style={styles.copyButton}>
                <Ionicons name="copy" size={20} color="#45B08C" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.statusInfo}>
          <View style={styles.statusBadge}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor:
                    website.status === 'published' ? '#45B08C' : '#F59E0B',
                },
              ]}
            />
            <Text style={styles.statusText}>
              {website.status === 'published' ? 'Published' : 'Draft'}
            </Text>
          </View>
          {website.published_at && (
            <Text style={styles.publishedAt}>
              Last published{' '}
              {new Date(website.published_at).toLocaleDateString()}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.sections}>
        <View style={styles.sectionsHeader}>
          <Text style={styles.sectionsTitle}>Page Sections</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddSection(true)}>
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add Section</Text>
          </TouchableOpacity>
        </View>

        {content.length === 0 ? (
          <View style={styles.emptySections}>
            <Ionicons name="layers" size={48} color="#45B08C" />
            <Text style={styles.emptySectionsTitle}>No Sections Yet</Text>
            <Text style={styles.emptySectionsDescription}>
              Start building your website by adding sections
            </Text>
            <TouchableOpacity
              style={styles.addFirstButton}
              onPress={() => setShowAddSection(true)}>
              <Text style={styles.addFirstButtonText}>Add Your First Section</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.sectionsList}>
            {content.map((section, index) => (
              <View key={section.id} style={styles.sectionCard}>
                <View style={styles.sectionDragHandle}>
                  <Ionicons name="menu" size={24} color="#A0AEC0" />
                </View>
                <View style={styles.sectionInfo}>
                  <Text style={styles.sectionType}>
                    {section.type.charAt(0).toUpperCase() + section.type.slice(1)} Section
                  </Text>
                  <View style={styles.sectionActions}>
                    <TouchableOpacity
                      style={styles.sectionAction}
                      onPress={() =>
                        router.push(`/business/website/sections/${section.id}`)
                      }>
                      <Ionicons name="create" size={20} color="#45B08C" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.sectionAction}
                      onPress={() => removeSection(section.id)}>
                      <Ionicons name="trash" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {showAddSection && (
        <View style={styles.addSectionModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Section</Text>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setShowAddSection(false)}>
              <Ionicons name="close" size={24} color="#A0AEC0" />
            </TouchableOpacity>
          </View>

          <View style={styles.sectionTypes}>
            {SECTION_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={styles.sectionTypeCard}
                onPress={() => {
                  addSection(type.id);
                  setShowAddSection(false);
                }}>
                <View style={styles.sectionTypeIcon}>
                  <Ionicons name={type.icon as any} size={24} color="#45B08C" />
                </View>
                <Text style={styles.sectionTypeName}>{type.name}</Text>
                <Text style={styles.sectionTypeDescription}>
                  {type.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1021',
  },
  content: {
    padding: 20,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
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
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  previewButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  publishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#45B08C',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  publishButtonDisabled: {
    opacity: 0.7,
  },
  publishButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  websiteInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  domainInfo: {
    marginBottom: 16,
  },
  domainLabel: {
    fontSize: 14,
    color: '#A0AEC0',
    marginBottom: 8,
  },
  domainValue: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  url: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
  },
  copyButton: {
    padding: 4,
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 100,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  publishedAt: {
    color: '#A0AEC0',
    fontSize: 12,
  },
  sections: {
    flex: 1,
  },
  sectionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#45B08C',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  emptySections: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 32,
  },
  emptySectionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySectionsDescription: {
    fontSize: 14,
    color: '#A0AEC0',
    textAlign: 'center',
    marginBottom: 24,
  },
  addFirstButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#45B08C',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  addFirstButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionsList: {
    gap: 12,
  },
  sectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionDragHandle: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  sectionInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  sectionType: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  sectionActions: {
    flexDirection: 'row',
    gap: 8,
  },
  sectionAction: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  addSectionModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0B1021',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalClose: {
    padding: 8,
  },
  sectionTypes: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    flexWrap: 'wrap',
    gap: 16,
  },
  sectionTypeCard: {
    ...(Platform.OS === 'web' ? {
      width: 'calc(33.33% - 11px)',
    } : {
      width: '100%',
    }),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
  },
  sectionTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(69, 176, 140, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  sectionTypeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  sectionTypeDescription: {
    fontSize: 14,
    color: '#A0AEC0',
    lineHeight: 20,
  },
});