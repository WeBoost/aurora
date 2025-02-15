import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../hooks/useAuth';
import { useBusiness } from '../../../hooks/useBusiness';
import { useWebsite } from '../../../hooks/useWebsite';

const TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and minimalist design perfect for any business',
    preview: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
  },
  {
    id: 'adventure',
    name: 'Adventure',
    description: 'Dynamic layout ideal for tour operators and activities',
    preview: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714',
  },
  {
    id: 'hospitality',
    name: 'Hospitality',
    description: 'Elegant design for hotels and restaurants',
    preview: 'https://images.unsplash.com/photo-1682687218147-9806132dc697',
  },
];

export default function WebsitePage() {
  const router = useRouter();
  const { session } = useAuth();
  const { business, loading: businessLoading } = useBusiness(session?.user?.id);
  const { website, loading: websiteLoading, updateWebsite } = useWebsite(business?.id);
  
  const [useCustomDomain, setUseCustomDomain] = useState(!!website?.custom_domain);
  const [customDomain, setCustomDomain] = useState(website?.custom_domain || '');
  const [selectedTemplate, setSelectedTemplate] = useState(website?.template_id || 'modern');
  const [saving, setSaving] = useState(false);

  const subdomain = business?.slug || '';
  const defaultDomain = `${subdomain}.aurora.tech`;

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateWebsite({
        template_id: selectedTemplate,
        custom_domain: useCustomDomain ? customDomain : null,
        subdomain: subdomain,
      });
      router.back();
    } catch (error) {
      console.error('Failed to save website settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (businessLoading || websiteLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
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
            You need to create a business profile before setting up your website
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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Website Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Domain Settings</Text>
        <View style={styles.card}>
          <View style={styles.domainOption}>
            <View style={styles.domainInfo}>
              <Text style={styles.domainLabel}>Free Subdomain</Text>
              <Text style={styles.domainValue}>{defaultDomain}</Text>
            </View>
            <View style={styles.domainStatus}>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Active</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.customDomainSection}>
            <View style={styles.customDomainHeader}>
              <View>
                <Text style={styles.customDomainLabel}>Custom Domain</Text>
                <Text style={styles.customDomainDescription}>
                  Use your own domain name for your website
                </Text>
              </View>
              <Switch
                value={useCustomDomain}
                onValueChange={setUseCustomDomain}
                trackColor={{ false: '#4A5568', true: '#45B08C' }}
                thumbColor="#FFFFFF"
              />
            </View>

            {useCustomDomain && (
              <View style={styles.customDomainInput}>
                <TextInput
                  style={styles.input}
                  value={customDomain}
                  onChangeText={setCustomDomain}
                  placeholder="Enter your domain (e.g., www.example.com)"
                  placeholderTextColor="#A0AEC0"
                />
                <Text style={styles.helperText}>
                  After saving, you'll need to update your DNS records
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Website Template</Text>
        <View style={styles.templates}>
          {TEMPLATES.map((template) => (
            <TouchableOpacity
              key={template.id}
              style={[
                styles.templateCard,
                selectedTemplate === template.id && styles.templateCardSelected,
              ]}
              onPress={() => setSelectedTemplate(template.id)}>
              <View style={styles.templatePreview}>
                <Ionicons
                  name={
                    selectedTemplate === template.id
                      ? 'checkmark-circle'
                      : 'radio-button-off'
                  }
                  size={24}
                  color={
                    selectedTemplate === template.id ? '#45B08C' : '#A0AEC0'
                  }
                  style={styles.templateCheck}
                />
              </View>
              <View style={styles.templateInfo}>
                <Text style={styles.templateName}>{template.name}</Text>
                <Text style={styles.templateDescription}>
                  {template.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}>
          <Text style={styles.saveButtonText}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 20,
  },
  domainOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  domainInfo: {
    flex: 1,
  },
  domainLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  domainValue: {
    fontSize: 14,
    color: '#45B08C',
  },
  domainStatus: {
    marginLeft: 16,
  },
  statusBadge: {
    backgroundColor: 'rgba(69, 176, 140, 0.2)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 100,
  },
  statusText: {
    color: '#45B08C',
    fontSize: 12,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 20,
  },
  customDomainSection: {
    gap: 16,
  },
  customDomainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  customDomainLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  customDomainDescription: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  customDomainInput: {
    gap: 8,
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
  helperText: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  templates: {
    gap: 16,
  },
  templateCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  templateCardSelected: {
    backgroundColor: 'rgba(69, 176, 140, 0.1)',
    borderWidth: 1,
    borderColor: '#45B08C',
  },
  templatePreview: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  templateCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  templateInfo: {
    flex: 1,
  },
  templateName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  templateDescription: {
    fontSize: 14,
    color: '#A0AEC0',
    lineHeight: 20,
  },
  actions: {
    marginTop: 32,
  },
  saveButton: {
    backgroundColor: '#45B08C',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});