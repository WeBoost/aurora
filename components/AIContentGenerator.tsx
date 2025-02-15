import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAISEO } from '@/hooks/useAISEO';
import { ErrorMessage } from './ErrorMessage';

interface AIContentGeneratorProps {
  businessType: string;
  location?: string;
  service?: string;
  onGenerate?: (content: any) => void;
}

export function AIContentGenerator({
  businessType,
  location,
  service,
  onGenerate,
}: AIContentGeneratorProps) {
  const { generateContent, loading, error } = useAISEO();
  const [keywords, setKeywords] = useState<string>('');
  const [tone, setTone] = useState<'professional' | 'casual' | 'luxury'>('professional');

  const handleGenerate = async () => {
    try {
      const result = await generateContent({
        type: 'content',
        context: {
          businessType,
          location,
          service,
          keywords: keywords.split(',').map(k => k.trim()),
          tone,
        },
      });

      if (onGenerate) {
        onGenerate(result);
      }
    } catch (error) {
      console.error('Failed to generate content:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Content Generator</Text>
        <TouchableOpacity
          style={[styles.generateButton, loading && styles.generateButtonDisabled]}
          onPress={handleGenerate}
          disabled={loading}>
          <Ionicons name="flash" size={20} color="#FFFFFF" />
          <Text style={styles.generateButtonText}>
            {loading ? 'Generating...' : 'Generate Content'}
          </Text>
        </TouchableOpacity>
      </View>

      {error && <ErrorMessage error={error} />}

      <ScrollView style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Target Keywords</Text>
          <TextInput
            style={styles.input}
            value={keywords}
            onChangeText={setKeywords}
            placeholder="Enter keywords (comma-separated)"
            placeholderTextColor="#A0AEC0"
          />
          <Text style={styles.hint}>
            Add keywords to target in the generated content
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Content Tone</Text>
          <View style={styles.toneButtons}>
            {(['professional', 'casual', 'luxury'] as const).map((t) => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.toneButton,
                  tone === t && styles.toneButtonActive,
                ]}
                onPress={() => setTone(t)}>
                <Text
                  style={[
                    styles.toneButtonText,
                    tone === t && styles.toneButtonTextActive,
                  ]}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.preview}>
          <Text style={styles.previewTitle}>Content Will Include:</Text>
          <View style={styles.previewList}>
            <View style={styles.previewItem}>
              <Ionicons name="checkmark-circle" size={20} color="#45B08C" />
              <Text style={styles.previewText}>SEO-optimized title & meta description</Text>
            </View>
            <View style={styles.previewItem}>
              <Ionicons name="checkmark-circle" size={20} color="#45B08C" />
              <Text style={styles.previewText}>Engaging section headings</Text>
            </View>
            <View style={styles.previewItem}>
              <Ionicons name="checkmark-circle" size={20} color="#45B08C" />
              <Text style={styles.previewText}>Keyword-rich content</Text>
            </View>
            <View style={styles.previewItem}>
              <Ionicons name="checkmark-circle" size={20} color="#45B08C" />
              <Text style={styles.previewText}>Structured data for rich snippets</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#45B08C',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  generateButtonDisabled: {
    opacity: 0.7,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 24,
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
  hint: {
    fontSize: 12,
    color: '#A0AEC0',
    marginTop: 4,
  },
  toneButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  toneButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  toneButtonActive: {
    backgroundColor: 'rgba(69, 176, 140, 0.2)',
    borderWidth: 1,
    borderColor: '#45B08C',
  },
  toneButtonText: {
    color: '#A0AEC0',
    fontSize: 14,
  },
  toneButtonTextActive: {
    color: '#45B08C',
    fontWeight: '500',
  },
  preview: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  previewList: {
    gap: 12,
  },
  previewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  previewText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
});