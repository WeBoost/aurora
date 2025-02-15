import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../../hooks/useAuth';
import { useBusiness } from '../../../../hooks/useBusiness';
import { useWebsite } from '../../../../hooks/useWebsite';
import { useDeployment } from '../../../../hooks/useDeployment';

const CHECKLIST_ITEMS = [
  {
    id: 'content',
    name: 'Website Content',
    description: 'Add sections and content to your website',
  },
  {
    id: 'design',
    name: 'Design & Branding',
    description: 'Customize colors, fonts, and layout',
  },
  {
    id: 'seo',
    name: 'SEO Settings',
    description: 'Configure meta tags and descriptions',
  },
  {
    id: 'domain',
    name: 'Domain Setup',
    description: 'Configure your domain settings',
  },
];

export default function DeployPage() {
  const router = useRouter();
  const { session } = useAuth();
  const { business } = useBusiness(session?.user?.id);
  const { website } = useWebsite(business?.id);
  const { status, deploy } = useDeployment(business?.id);
  const [deploying, setDeploying] = useState(false);

  const handleDeploy = async () => {
    try {
      setDeploying(true);
      await deploy();
      // Router will handle showing the success state
    } catch (error) {
      console.error('Failed to deploy:', error);
    } finally {
      setDeploying(false);
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
        <Text style={styles.title}>Deploy Website</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pre-deployment Checklist</Text>
          <View style={styles.checklist}>
            {CHECKLIST_ITEMS.map((item) => (
              <View key={item.id} style={styles.checklistItem}>
                <View style={styles.checklistIcon}>
                  <Ionicons 
                    name="checkmark-circle" 
                    size={24} 
                    color="#45B08C" 
                  />
                </View>
                <View style={styles.checklistInfo}>
                  <Text style={styles.checklistName}>{item.name}</Text>
                  <Text style={styles.checklistDescription}>
                    {item.description}
                  </Text>
                </View>
                <TouchableOpacity style={styles.reviewButton}>
                  <Text style={styles.reviewButtonText}>Review</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Domain Settings</Text>
          <View style={styles.domainCard}>
            <View style={styles.domainInfo}>
              <Text style={styles.domainLabel}>Your Website URL</Text>
              <Text style={styles.domainValue}>
                https://{website?.subdomain || business?.slug}.aurora.tech
              </Text>
            </View>
            {website?.custom_domain && (
              <View style={styles.domainInfo}>
                <Text style={styles.domainLabel}>Custom Domain</Text>
                <Text style={styles.domainValue}>
                  https://{website.custom_domain}
                </Text>
              </View>
            )}
            <TouchableOpacity 
              style={styles.manageDomainButton}
              onPress={() => router.push('/business/website/settings')}>
              <Text style={styles.manageDomainButtonText}>
                Manage Domain Settings
              </Text>
              <Ionicons name="arrow-forward" size={20} color="#45B08C" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.deploySection}>
          {status.status === 'failed' ? (
            <View style={styles.errorState}>
              <Ionicons name="alert-circle" size={48} color="#EF4444" />
              <Text style={styles.errorTitle}>Deployment Failed</Text>
              <Text style={styles.errorDescription}>
                {status.error || 'An error occurred during deployment'}
              </Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={handleDeploy}>
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : status.status === 'deployed' ? (
            <View style={styles.successState}>
              <Ionicons name="checkmark-circle" size={48} color="#45B08C" />
              <Text style={styles.successTitle}>Website Deployed!</Text>
              <Text style={styles.successDescription}>
                Your website is now live and accessible to visitors
              </Text>
              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => router.push('/business/website/preview')}>
                <Text style={styles.viewButtonText}>View Website</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.deployButton, deploying && styles.deployButtonDisabled]}
              onPress={handleDeploy}
              disabled={deploying}>
              <Ionicons name="rocket" size={24} color="#FFFFFF" />
              <Text style={styles.deployButtonText}>
                {deploying ? 'Deploying...' : 'Deploy Website'}
              </Text>
            </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  checklist: {
    gap: 12,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 12,
  },
  checklistIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(69, 176, 140, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checklistInfo: {
    flex: 1,
  },
  checklistName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  checklistDescription: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  reviewButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  reviewButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  domainCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 20,
    borderRadius: 12,
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
    fontSize: 16,
    color: '#FFFFFF',
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  manageDomainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  manageDomainButtonText: {
    color: '#45B08C',
    fontSize: 14,
    fontWeight: '500',
  },
  deploySection: {
    padding: 20,
  },
  deployButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#45B08C',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  deployButtonDisabled: {
    opacity: 0.7,
  },
  deployButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorState: {
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 32,
    borderRadius: 12,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EF4444',
    marginTop: 16,
    marginBottom: 8,
  },
  errorDescription: {
    fontSize: 16,
    color: '#A0AEC0',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  successState: {
    alignItems: 'center',
    backgroundColor: 'rgba(69, 176, 140, 0.1)',
    padding: 32,
    borderRadius: 12,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#45B08C',
    marginTop: 16,
    marginBottom: 8,
  },
  successDescription: {
    fontSize: 16,
    color: '#A0AEC0',
    textAlign: 'center',
    marginBottom: 24,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#45B08C',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  viewButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});