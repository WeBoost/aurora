import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useBusiness } from '@/hooks/useBusiness';
import { useWebsiteContent } from '@/hooks/useWebsiteContent';

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
    id: 'contact',
    name: 'Contact Form',
    icon: 'mail',
    description: 'Contact form with map',
  },
];

export default function SectionsPage() {
  const router = useRouter();
  const { session } = useAuth();
  const { business } = useBusiness(session?.user?.id);
  const { sections, loading, addSection, deleteSection } = useWebsiteContent(business?.id);
  const [adding, setAdding] = useState(false);

  const handleAddSection = async (type: string) => {
    try {
      const section = await addSection(type);
      router.push(`/business/website/sections/${section.id}`);
    } catch (error) {
      console.error('Failed to add section:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Website Sections</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setAdding(true)}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {adding ? (
        <ScrollView style={styles.sectionTypes}>
          <View style={styles.sectionTypesHeader}>
            <Text style={styles.sectionTypesTitle}>Add New Section</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setAdding(false)}>
              <Ionicons name="close" size={24} color="#A0AEC0" />
            </TouchableOpacity>
          </View>

          <View style={styles.sectionTypesList}>
            {SECTION_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={styles.sectionTypeCard}
                onPress={() => handleAddSection(type.id)}>
                <Ionicons name={type.icon as any} size={32} color="#45B08C" />
                <Text style={styles.sectionTypeName}>{type.name}</Text>
                <Text style={styles.sectionTypeDescription}>
                  {type.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      ) : (
        <ScrollView style={styles.content}>
          {sections.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="layers" size={48} color="#45B08C" />
              <Text style={styles.emptyStateTitle}>No Sections Yet</Text>
              <Text style={styles.emptyStateDescription}>
                Start building your website by adding sections
              </Text>
              <TouchableOpacity
                style={styles.addFirstButton}
                onPress={() => setAdding(true)}>
                <Text style={styles.addFirstButtonText}>Add Your First Section</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.sectionsList}>
              {sections.map((section) => (
                <View key={section.id} style={styles.sectionCard}>
                  <View style={styles.sectionInfo}>
                    <Ionicons 
                      name={
                        section.type === 'hero' ? 'image' :
                        section.type === 'features' ? 'grid' :
                        'mail'
                      } 
                      size={24} 
                      color="#45B08C" 
                    />
                    <View style={styles.sectionDetails}>
                      <Text style={styles.sectionType}>
                        {section.type.charAt(0).toUpperCase() + section.type.slice(1)} Section
                      </Text>
                      <Text style={styles.sectionPreview}>
                        {section.content.heading || section.content.title || 'No title'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.sectionActions}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => router.push(`/business/website/sections/${section.id}`)}>
                      <Ionicons name="create" size={20} color="#45B08C" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => deleteSection(section.id)}>
                      <Ionicons name="trash" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1021',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'rgba(11, 16, 33, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  addButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
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
    padding: 20,
    gap: 12,
  },
  sectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 12,
  },
  sectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  sectionDetails: {
    flex: 1,
  },
  sectionType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  sectionPreview: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  sectionActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 8,
    backgroundColor: 'rgba(69, 176, 140, 0.1)',
    borderRadius: 8,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
  },
  sectionTypes: {
    flex: 1,
  },
  sectionTypesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionTypesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 4,
  },
  sectionTypesList: {
    padding: 20,
    gap: 16,
  },
  sectionTypeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 20,
    borderRadius: 12,
    gap: 12,
  },
  sectionTypeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sectionTypeDescription: {
    fontSize: 14,
    color: '#A0AEC0',
  },
});