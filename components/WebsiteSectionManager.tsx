import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { WebsitePreview } from './WebsitePreview';
import { useWebsiteContent } from '@/hooks/useWebsiteContent';

interface WebsiteSectionManagerProps {
  businessId: string;
}

export function WebsiteSectionManager({ businessId }: WebsiteSectionManagerProps) {
  const router = useRouter();
  const { sections, reorderSections, removeSection } = useWebsiteContent(businessId);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggingIndex(index);
  };

  const handleDragEnd = () => {
    setDraggingIndex(null);
  };

  const handleDrop = (targetIndex: number) => {
    if (draggingIndex === null) return;
    
    const newSections = [...sections];
    const [movedSection] = newSections.splice(draggingIndex, 1);
    newSections.splice(targetIndex, 0, movedSection);
    
    reorderSections(newSections.map((section, index) => ({
      ...section,
      order: index,
    })));
    
    setDraggingIndex(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Website Sections</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/business/website/sections/new')}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Section</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.preview}>
        <WebsitePreview businessId={businessId} scale={0.5} />
      </View>

      <View style={styles.sections}>
        {sections.map((section, index) => (
          <View
            key={section.id}
            style={[
              styles.sectionCard,
              draggingIndex === index && styles.sectionCardDragging,
            ]}
            onTouchStart={() => handleDragStart(index)}
            onTouchEnd={handleDragEnd}
            onMouseDown={() => handleDragStart(index)}
            onMouseUp={handleDragEnd}
            onDragOver={(e) => {
              e.preventDefault();
              handleDrop(index);
            }}>
            <View style={styles.sectionDragHandle}>
              <Ionicons name="menu" size={24} color="#A0AEC0" />
            </View>
            
            <View style={styles.sectionInfo}>
              <Text style={styles.sectionType}>
                {section.type.charAt(0).toUpperCase() + section.type.slice(1)} Section
              </Text>
              <Text style={styles.sectionPreview}>
                {section.content.heading || section.content.title || 'No title'}
              </Text>
            </View>

            <View style={styles.sectionActions}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => router.push(`/business/website/sections/${section.id}`)}>
                <Ionicons name="create" size={20} color="#45B08C" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => removeSection(section.id)}>
                <Ionicons name="trash" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 16,
    fontWeight: '500',
  },
  preview: {
    height: 300,
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  sections: {
    gap: 12,
  },
  sectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    overflow: 'hidden',
    ...(Platform.OS === 'web' ? {
      cursor: 'move',
      userSelect: 'none',
    } : {}),
  },
  sectionCardDragging: {
    opacity: 0.5,
    transform: [{ scale: 1.02 }],
  },
  sectionDragHandle: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  sectionInfo: {
    flex: 1,
    padding: 16,
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
    padding: 16,
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
});