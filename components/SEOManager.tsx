import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWebsiteSEO } from '@/hooks/useWebsiteSEO';

interface SEOManagerProps {
  businessId: string;
}

export function SEOManager({ businessId }: SEOManagerProps) {
  const { seoData, loading, error, updateSEO } = useWebsiteSEO(businessId);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: seoData?.title || '',
    description: seoData?.description || '',
    keywords: seoData?.keywords || '',
    ogTitle: seoData?.ogTitle || '',
    ogDescription: seoData?.ogDescription || '',
    ogImage: seoData?.ogImage || '',
    twitterCard: seoData?.twitterCard || 'summary_large_image',
    twitterTitle: seoData?.twitterTitle || '',
    twitterDescription: seoData?.twitterDescription || '',
    twitterImage: seoData?.twitterImage || '',
    structuredData: seoData?.structuredData || '',
  });

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateSEO(formData);
    } catch (error) {
      console.error('Failed to save SEO settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>Loading SEO settings...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.errorText}>Failed to load SEO settings</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SEO Settings</Text>
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}>
          <Text style={styles.saveButtonText}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic SEO</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Page Title</Text>
          <TextInput
            style={styles.input}
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
            placeholder="Enter page title"
            placeholderTextColor="#A0AEC0"
          />
          <Text style={styles.hint}>
            Recommended length: 50-60 characters
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Meta Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            placeholder="Enter meta description"
            placeholderTextColor="#A0AEC0"
            multiline
            numberOfLines={4}
          />
          <Text style={styles.hint}>
            Recommended length: 150-160 characters
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Keywords</Text>
          <TextInput
            style={styles.input}
            value={formData.keywords}
            onChangeText={(text) => setFormData({ ...formData, keywords: text })}
            placeholder="Enter keywords (comma-separated)"
            placeholderTextColor="#A0AEC0"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Open Graph</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>OG Title</Text>
          <TextInput
            style={styles.input}
            value={formData.ogTitle}
            onChangeText={(text) => setFormData({ ...formData, ogTitle: text })}
            placeholder="Enter Open Graph title"
            placeholderTextColor="#A0AEC0"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>OG Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.ogDescription}
            onChangeText={(text) => setFormData({ ...formData, ogDescription: text })}
            placeholder="Enter Open Graph description"
            placeholderTextColor="#A0AEC0"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>OG Image URL</Text>
          <TextInput
            style={styles.input}
            value={formData.ogImage}
            onChangeText={(text) => setFormData({ ...formData, ogImage: text })}
            placeholder="Enter Open Graph image URL"
            placeholderTextColor="#A0AEC0"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Twitter Card</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Card Type</Text>
          <View style={styles.cardTypes}>
            {['summary', 'summary_large_image'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.cardTypeButton,
                  formData.twitterCard === type && styles.cardTypeButtonActive,
                ]}
                onPress={() => setFormData({ ...formData, twitterCard: type })}>
                <Text
                  style={[
                    styles.cardTypeButtonText,
                    formData.twitterCard === type && styles.cardTypeButtonTextActive,
                  ]}>
                  {type === 'summary' ? 'Summary' : 'Large Image'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Twitter Title</Text>
          <TextInput
            style={styles.input}
            value={formData.twitterTitle}
            onChangeText={(text) => setFormData({ ...formData, twitterTitle: text })}
            placeholder="Enter Twitter title"
            placeholderTextColor="#A0AEC0"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Twitter Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.twitterDescription}
            onChangeText={(text) => setFormData({ ...formData, twitterDescription: text })}
            placeholder="Enter Twitter description"
            placeholderTextColor="#A0AEC0"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Twitter Image URL</Text>
          <TextInput
            style={styles.input}
            value={formData.twitterImage}
            onChangeText={(text) => setFormData({ ...formData, twitterImage: text })}
            placeholder="Enter Twitter image URL"
            placeholderTextColor="#A0AEC0"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Structured Data</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>JSON-LD</Text>
          <TextInput
            style={[styles.input, styles.codeArea]}
            value={formData.structuredData}
            onChangeText={(text) => setFormData({ ...formData, structuredData: text })}
            placeholder="Enter JSON-LD structured data"
            placeholderTextColor="#A0AEC0"
            multiline
            numberOfLines={8}
          />
          <Text style={styles.hint}>
            Enter valid JSON-LD data for rich snippets
          </Text>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 8,
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
  codeArea: {
    height: 200,
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  hint: {
    fontSize: 12,
    color: '#A0AEC0',
    marginTop: 4,
  },
  cardTypes: {
    flexDirection: 'row',
    gap: 12,
  },
  cardTypeButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cardTypeButtonActive: {
    backgroundColor: 'rgba(69, 176, 140, 0.2)',
    borderWidth: 1,
    borderColor: '#45B08C',
  },
  cardTypeButtonText: {
    color: '#A0AEC0',
    fontSize: 14,
  },
  cardTypeButtonTextActive: {
    color: '#45B08C',
    fontWeight: '500',
  },
});