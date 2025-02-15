import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { useAuth } from '../../../../hooks/useAuth';
import { useBusiness } from '../../../../hooks/useBusiness';
import { useWebsite } from '../../../../hooks/useWebsite';

const SCREEN_SIZES = [
  { id: 'desktop', name: 'Desktop', icon: 'desktop-outline', width: 1280 },
  { id: 'tablet', name: 'Tablet', icon: 'tablet-landscape-outline', width: 1024 },
  { id: 'mobile', name: 'Mobile', icon: 'phone-portrait-outline', width: 375 },
];

const PREVIEW_MODES = [
  { id: 'live', name: 'Live Preview' },
  { id: 'draft', name: 'Draft Changes' },
];

export default function PreviewPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ template?: string }>();
  const { session } = useAuth();
  const { business, loading: businessLoading } = useBusiness(session?.user?.id);
  const { website, loading: websiteLoading } = useWebsite(business?.id);
  
  const [selectedSize, setSelectedSize] = useState(SCREEN_SIZES[0]);
  const [previewMode, setPreviewMode] = useState(PREVIEW_MODES[0]);
  const [isCustomizing, setIsCustomizing] = useState(false);

  const windowWidth = Dimensions.get('window').width;
  const previewScale = Math.min(1, (windowWidth - 48) / selectedSize.width);
  const previewUrl = website ? 
    `https://${website.subdomain}.aurora.tech${previewMode.id === 'draft' ? '?preview=true' : ''}` :
    'about:blank';

  if (businessLoading || websiteLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading preview...</Text>
      </View>
    );
  }

  if (!business || !website) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Ionicons name="globe" size={48} color="#45B08C" />
          <Text style={styles.emptyStateTitle}>Website Not Found</Text>
          <Text style={styles.emptyStateDescription}>
            You need to set up your website before previewing it
          </Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => router.push('/business/website')}>
            <Text style={styles.createButtonText}>Set Up Website</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
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

        <View style={styles.controls}>
          <View style={styles.screenSizes}>
            {SCREEN_SIZES.map((size) => (
              <TouchableOpacity
                key={size.id}
                style={[
                  styles.sizeButton,
                  selectedSize.id === size.id && styles.sizeButtonActive,
                ]}
                onPress={() => setSelectedSize(size)}>
                <Ionicons
                  name={size.icon as any}
                  size={20}
                  color={selectedSize.id === size.id ? '#FFFFFF' : '#A0AEC0'}
                />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.previewModes}>
            {PREVIEW_MODES.map((mode) => (
              <TouchableOpacity
                key={mode.id}
                style={[
                  styles.modeButton,
                  previewMode.id === mode.id && styles.modeButtonActive,
                ]}
                onPress={() => setPreviewMode(mode)}>
                <Text
                  style={[
                    styles.modeButtonText,
                    previewMode.id === mode.id && styles.modeButtonTextActive,
                  ]}>
                  {mode.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.customizeButton}
            onPress={() => setIsCustomizing(!isCustomizing)}>
            <Ionicons name="color-palette" size={20} color="#FFFFFF" />
            <Text style={styles.customizeButtonText}>Customize</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.previewContainer}>
          <View
            style={[
              styles.previewFrame,
              {
                width: selectedSize.width,
                transform: [{ scale: previewScale }],
              },
            ]}>
            <WebView
              source={{ uri: previewUrl }}
              style={styles.preview}
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>

        {isCustomizing && (
          <View style={styles.customizePanel}>
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>Customize Template</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsCustomizing(false)}>
                <Ionicons name="close" size={24} color="#A0AEC0" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.panelContent}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Colors</Text>
                <View style={styles.colorPickers}>
                  <TouchableOpacity style={styles.colorPicker}>
                    <View style={[styles.colorPreview, { backgroundColor: '#45B08C' }]} />
                    <View style={styles.colorInfo}>
                      <Text style={styles.colorLabel}>Primary Color</Text>
                      <Text style={styles.colorValue}>#45B08C</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.colorPicker}>
                    <View style={[styles.colorPreview, { backgroundColor: '#9B4F96' }]} />
                    <View style={styles.colorInfo}>
                      <Text style={styles.colorLabel}>Secondary Color</Text>
                      <Text style={styles.colorValue}>#9B4F96</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.colorPicker}>
                    <View style={[styles.colorPreview, { backgroundColor: '#A1D6E2' }]} />
                    <View style={styles.colorInfo}>
                      <Text style={styles.colorLabel}>Accent Color</Text>
                      <Text style={styles.colorValue}>#A1D6E2</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Typography</Text>
                <View style={styles.fontPickers}>
                  <TouchableOpacity style={styles.fontPicker}>
                    <Text style={styles.fontLabel}>Heading Font</Text>
                    <Text style={styles.fontPreview}>Inter</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.fontPicker}>
                    <Text style={styles.fontLabel}>Body Font</Text>
                    <Text style={styles.fontPreview}>Inter</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}
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
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'web' ? 20 : 60,
    backgroundColor: 'rgba(11, 16, 33, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  controls: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  screenSizes: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 4,
  },
  sizeButton: {
    padding: 8,
    borderRadius: 6,
  },
  sizeButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  previewModes: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 4,
  },
  modeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  modeButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  modeButtonText: {
    color: '#A0AEC0',
    fontSize: 14,
  },
  modeButtonTextActive: {
    color: '#FFFFFF',
  },
  customizeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#45B08C',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  customizeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
  },
  previewContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#080B17',
  },
  previewFrame: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    transformOrigin: 'top left',
  },
  preview: {
    flex: 1,
  },
  customizePanel: {
    width: Platform.OS === 'web' ? 320 : '100%',
    height: Platform.OS === 'web' ? '100%' : '50%',
    backgroundColor: '#0B1021',
    borderLeftWidth: Platform.OS === 'web' ? 1 : 0,
    borderTopWidth: Platform.OS === 'web' ? 0 : 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 4,
  },
  panelContent: {
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
  colorPickers: {
    gap: 12,
  },
  colorPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  colorPreview: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  colorInfo: {
    flex: 1,
  },
  colorLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  colorValue: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  fontPickers: {
    gap: 12,
  },
  fontPicker: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 8,
  },
  fontLabel: {
    fontSize: 14,
    color: '#A0AEC0',
    marginBottom: 4,
  },
  fontPreview: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: '#45B08C',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    margin: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});