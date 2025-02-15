import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useBusiness } from '@/hooks/useBusiness';
import { useTemplates } from '@/hooks/useTemplates';
import { TemplatePreview } from '@/components/TemplatePreview';

export default function TemplatesPage() {
  const router = useRouter();
  const { session } = useAuth();
  const { business, loading: businessLoading } = useBusiness(session?.user?.id);
  const { templates, loading: templatesLoading, applyTemplate } = useTemplates(business?.id);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);

  const loading = businessLoading || templatesLoading;

  const handleSelectTemplate = async (templateId: string) => {
    try {
      setApplying(true);
      await applyTemplate(templateId);
      setSelectedTemplate(templateId);
      router.push('/business/website');
    } catch (error) {
      console.error('Failed to apply template:', error);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading templates...</Text>
      </View>
    );
  }

  if (!business) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>Create Your Business First</Text>
          <Text style={styles.emptyStateDescription}>
            You need to create a business profile before choosing a template
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Template</Text>
        <Text style={styles.subtitle}>
          Select a template to get started with your website
        </Text>
      </View>

      <View style={styles.templates}>
        {Object.values(templates).map((template) => (
          <TemplatePreview
            key={template.id}
            template={template}
            selected={selectedTemplate === template.id}
            onSelect={() => handleSelectTemplate(template.id)}
          />
        ))}
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
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 16,
    color: '#A0AEC0',
    textAlign: 'center',
  },
  header: {
    marginBottom: 32,
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
  templates: {
    gap: 24,
  },
});