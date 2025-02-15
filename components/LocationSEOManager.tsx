import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocationSEO } from '@/hooks/useLocationSEO';
import { useServices } from '@/hooks/useServices';
import { ErrorMessage } from './ErrorMessage';

interface LocationSEOManagerProps {
  locationId: string;
  businessId: string;
}

export function LocationSEOManager({ locationId, businessId }: LocationSEOManagerProps) {
  const { pages, loading, error, generateSEOPage, updatePage, deletePage } = useLocationSEO(locationId);
  const { services } = useServices(businessId);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [customTitle, setCustomTitle] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!selectedService) return;

    try {
      setGenerating(true);
      await generateSEOPage(selectedService, {
        title: customTitle || undefined,
        description: customDescription || undefined,
      });
      setSelectedService(null);
      setCustomTitle('');
      setCustomDescription('');
    } catch (error) {
      console.error('Failed to generate SEO page:', error);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>Loading SEO pages...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.messageContainer}>
        <ErrorMessage error={error} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Location SEO Pages</Text>
        <TouchableOpacity
          style={styles.generateButton}
          onPress={() => setSelectedService(null)}>
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.generateButtonText}>Generate Page</Text>
        </TouchableOpacity>
      </View>

      {selectedService && (
        <View style={styles.generateForm}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Custom Title (Optional)</Text>
            <TextInput
              style={styles.input}
              value={customTitle}
              onChangeText={setCustomTitle}
              placeholder="Enter custom title"
              placeholderTextColor="#A0AEC0"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Custom Description (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={customDescription}
              onChangeText={setCustomDescription}
              placeholder="Enter custom description"
              placeholderTextColor="#A0AEC0"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.formActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setSelectedService(null)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitButton, generating && styles.submitButtonDisabled]}
              onPress={handleGenerate}
              disabled={generating}>
              <Text style={styles.submitButtonText}>
                {generating ? 'Generating...' : 'Generate Page'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.services}>
        <Text style={styles.sectionTitle}>Available Services</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.servicesList}>
          {services.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={[
                styles.serviceCard,
                selectedService === service.id && styles.serviceCardSelected,
              ]}
              onPress={() => setSelectedService(service.id)}>
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.serviceDescription}>
                {service.description || 'No description'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.pages}>
        <Text style={styles.sectionTitle}>Generated Pages</Text>
        {pages.map((page) => (
          <View key={page.id} style={styles.pageCard}>
            <View style={styles.pageInfo}>
              <Text style={styles.pageTitle}>{page.title}</Text>
              <Text style={styles.pageSlug}>/{page.slug}</Text>
              <Text style={styles.pageDescription}>{page.description}</Text>
            </View>

            <View style={styles.pageActions}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => updatePage(page.id, {
                  published: !page.published,
                })}>
                <Ionicons
                  name={page.published ? 'eye' : 'eye-off'}
                  size={20}
                  color={page.published ? '#45B08C' : '#A0AEC0'}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deletePage(page.id)}>
                <Ionicons name="trash" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  generateForm: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
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
  formActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#45B08C',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  services: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  servicesList: {
    marginHorizontal: -20,
  },
  serviceCard: {
    width: 280,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 8,
  },
  serviceCardSelected: {
    backgroundColor: 'rgba(69, 176, 140, 0.1)',
    borderWidth: 1,
    borderColor: '#45B08C',
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  pages: {
    gap: 12,
  },
  pageCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
  },
  pageInfo: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  pageSlug: {
    fontSize: 14,
    color: '#45B08C',
    marginBottom: 8,
  },
  pageDescription: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  pageActions: {
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
});