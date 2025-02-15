import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../../../hooks/useAuth';
import { useBusiness } from '../../../../../hooks/useBusiness';
import { useWebsiteBuilder } from '../../../../../hooks/useWebsiteBuilder';

const SECTION_LAYOUTS = {
  hero: [
    { id: 'centered', name: 'Centered', icon: 'square-outline' },
    { id: 'left-aligned', name: 'Left Aligned', icon: 'arrow-back' },
    { id: 'split', name: 'Split', icon: 'grid-outline' },
  ],
  features: [
    { id: 'grid', name: 'Grid', icon: 'grid-outline' },
    { id: 'list', name: 'List', icon: 'list-outline' },
    { id: 'carousel', name: 'Carousel', icon: 'albums-outline' },
  ],
  gallery: [
    { id: 'masonry', name: 'Masonry', icon: 'apps-outline' },
    { id: 'grid', name: 'Grid', icon: 'grid-outline' },
    { id: 'slider', name: 'Slider', icon: 'images-outline' },
  ],
  testimonials: [
    { id: 'cards', name: 'Cards', icon: 'card-outline' },
    { id: 'carousel', name: 'Carousel', icon: 'albums-outline' },
    { id: 'quotes', name: 'Quotes', icon: 'chatbubbles-outline' },
  ],
  contact: [
    { id: 'split', name: 'Split with Map', icon: 'map-outline' },
    { id: 'centered', name: 'Centered Form', icon: 'mail-outline' },
    { id: 'full-width', name: 'Full Width', icon: 'expand-outline' },
  ],
};

const BACKGROUND_OPTIONS = [
  { id: 'none', name: 'None', icon: 'close-circle-outline' },
  { id: 'color', name: 'Solid Color', icon: 'color-palette-outline' },
  { id: 'gradient', name: 'Gradient', icon: 'brush-outline' },
  { id: 'image', name: 'Image', icon: 'image-outline' },
  { id: 'video', name: 'Video', icon: 'videocam-outline' },
];

const SPACING_OPTIONS = [
  { id: 'compact', name: 'Compact', value: 'py-8' },
  { id: 'normal', name: 'Normal', value: 'py-16' },
  { id: 'relaxed', name: 'Relaxed', value: 'py-24' },
  { id: 'spacious', name: 'Spacious', value: 'py-32' },
];

export default function SectionEditorPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();
  const { business } = useBusiness(session?.user?.id);
  const { content, updateContent } = useWebsiteBuilder(business?.id);

  const [section, setSection] = useState<any>(null);
  const [layout, setLayout] = useState('centered');
  const [background, setBackground] = useState('none');
  const [spacing, setSpacing] = useState('normal');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (content && params.id) {
      const currentSection = content.find((s) => s.id === params.id);
      if (currentSection) {
        setSection(currentSection);
        setLayout(currentSection.content.layout || 'centered');
        setBackground(currentSection.content.background || 'none');
        setSpacing(currentSection.content.spacing || 'normal');
      }
    }
  }, [content, params.id]);

  const handleSave = async () => {
    if (!section) return;

    try {
      setSaving(true);
      await updateContent(section.id, {
        content: {
          ...section.content,
          layout,
          background,
          spacing,
        },
      });
      router.back();
    } catch (error) {
      console.error('Failed to save section:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!section) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading section...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit {section.type} Section</Text>
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}>
          <Text style={styles.saveButtonText}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Layout</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.layoutOptions}>
            {SECTION_LAYOUTS[section.type as keyof typeof SECTION_LAYOUTS]?.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.layoutOption,
                  layout === option.id && styles.layoutOptionActive,
                ]}
                onPress={() => setLayout(option.id)}>
                <Ionicons
                  name={option.icon as any}
                  size={24}
                  color={layout === option.id ? '#45B08C' : '#A0AEC0'}
                />
                <Text
                  style={[
                    styles.layoutOptionText,
                    layout === option.id && styles.layoutOptionTextActive,
                  ]}>
                  {option.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Background</Text>
          <View style={styles.backgroundOptions}>
            {BACKGROUND_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.backgroundOption,
                  background === option.id && styles.backgroundOptionActive,
                ]}
                onPress={() => setBackground(option.id)}>
                <Ionicons
                  name={option.icon as any}
                  size={24}
                  color={background === option.id ? '#45B08C' : '#A0AEC0'}
                />
                <Text
                  style={[
                    styles.backgroundOptionText,
                    background === option.id && styles.backgroundOptionTextActive,
                  ]}>
                  {option.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {background === 'color' && (
            <View style={styles.colorPicker}>
              <Text style={styles.colorPickerLabel}>Background Color</Text>
              <View style={styles.colorOptions}>
                {['#FFFFFF', '#F8FAFC', '#45B08C', '#9B4F96', '#A1D6E2'].map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[styles.colorOption, { backgroundColor: color }]}
                  />
                ))}
              </View>
            </View>
          )}

          {background === 'image' && (
            <View style={styles.imageUpload}>
              <TouchableOpacity style={styles.uploadButton}>
                <Ionicons name="cloud-upload" size={24} color="#45B08C" />
                <Text style={styles.uploadButtonText}>Upload Image</Text>
              </TouchableOpacity>
              <Text style={styles.uploadHint}>
                Recommended size: 1920x1080px, max 2MB
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spacing</Text>
          <View style={styles.spacingOptions}>
            {SPACING_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.spacingOption,
                  spacing === option.id && styles.spacingOptionActive,
                ]}
                onPress={() => setSpacing(option.id)}>
                <View 
                  style={[
                    styles.spacingPreview,
                    { height: option.id === 'compact' ? 24 : 
                            option.id === 'normal' ? 32 :
                            option.id === 'relaxed' ? 40 : 48 }
                  ]}
                />
                <Text
                  style={[
                    styles.spacingOptionText,
                    spacing === option.id && styles.spacingOptionTextActive,
                  ]}>
                  {option.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content</Text>
          {section.type === 'hero' && (
            <View style={styles.heroEditor}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Heading</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter heading text"
                  placeholderTextColor="#A0AEC0"
                  value={section.content.heading}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Subheading</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Enter subheading text"
                  placeholderTextColor="#A0AEC0"
                  value={section.content.subheading}
                  multiline
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Call to Action</Text>
                <View style={styles.ctaInputs}>
                  <TextInput
                    style={[styles.input, styles.ctaInput]}
                    placeholder="Button text"
                    placeholderTextColor="#A0AEC0"
                    value={section.content.cta?.text}
                  />
                  <TextInput
                    style={[styles.input, styles.ctaInput]}
                    placeholder="Button URL"
                    placeholderTextColor="#A0AEC0"
                    value={section.content.cta?.url}
                  />
                </View>
              </View>
            </View>
          )}

          {section.type === 'features' && (
            <View style={styles.featuresEditor}>
              <TouchableOpacity style={styles.addFeatureButton}>
                <Ionicons name="add-circle" size={24} color="#45B08C" />
                <Text style={styles.addFeatureButtonText}>Add Feature</Text>
              </TouchableOpacity>

              {(section.content.features || []).map((feature: any, index: number) => (
                <View key={index} style={styles.featureItem}>
                  <View style={styles.featureHeader}>
                    <Text style={styles.featureNumber}>Feature {index + 1}</Text>
                    <TouchableOpacity style={styles.deleteFeatureButton}>
                      <Ionicons name="trash" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Icon</Text>
                    <TouchableOpacity style={styles.iconPicker}>
                      <Ionicons name={feature.icon || 'help'} size={24} color="#45B08C" />
                      <Text style={styles.iconPickerText}>Choose Icon</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Title</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Feature title"
                      placeholderTextColor="#A0AEC0"
                      value={feature.title}
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder="Feature description"
                      placeholderTextColor="#A0AEC0"
                      value={feature.description}
                      multiline
                    />
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: Platform.OS === 'web' ? 20 : 60,
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
  saveButton: {
    backgroundColor: '#45B08C',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  layoutOptions: {
    marginHorizontal: -20,
  },
  layoutOption: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 8,
    width: 120,
  },
  layoutOptionActive: {
    backgroundColor: 'rgba(69, 176, 140, 0.1)',
    borderWidth: 1,
    borderColor: '#45B08C',
  },
  layoutOptionText: {
    color: '#A0AEC0',
    fontSize: 14,
    marginTop: 8,
  },
  layoutOptionTextActive: {
    color: '#45B08C',
  },
  backgroundOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  backgroundOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  backgroundOptionActive: {
    backgroundColor: 'rgba(69, 176, 140, 0.1)',
    borderWidth: 1,
    borderColor: '#45B08C',
  },
  backgroundOptionText: {
    color: '#A0AEC0',
    fontSize: 14,
  },
  backgroundOptionTextActive: {
    color: '#45B08C',
  },
  colorPicker: {
    marginTop: 16,
  },
  colorPickerLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  colorOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  imageUpload: {
    marginTop: 16,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(69, 176, 140, 0.1)',
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#45B08C',
    gap: 8,
  },
  uploadButtonText: {
    color: '#45B08C',
    fontSize: 14,
    fontWeight: '500',
  },
  uploadHint: {
    color: '#A0AEC0',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
  spacingOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  spacingOption: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 8,
  },
  spacingOptionActive: {
    backgroundColor: 'rgba(69, 176, 140, 0.1)',
    borderWidth: 1,
    borderColor: '#45B08C',
  },
  spacingPreview: {
    width: 4,
    backgroundColor: '#A0AEC0',
    marginBottom: 8,
    borderRadius: 2,
  },
  spacingOptionText: {
    color: '#A0AEC0',
    fontSize: 14,
  },
  spacingOptionTextActive: {
    color: '#45B08C',
  },
  heroEditor: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  ctaInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  ctaInput: {
    flex: 1,
  },
  featuresEditor: {
    gap: 20,
  },
  addFeatureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(69, 176, 140, 0.1)',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  addFeatureButtonText: {
    color: '#45B08C',
    fontSize: 14,
    fontWeight: '500',
  },
  featureItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 8,
    gap: 16,
  },
  featureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featureNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  deleteFeatureButton: {
    padding: 8,
  },
  iconPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  iconPickerText: {
    color: '#A0AEC0',
    fontSize: 14,
  },
});