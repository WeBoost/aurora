import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { WebsitePreview } from './WebsitePreview';

interface TemplatePreviewProps {
  template: {
    id: string;
    name: string;
    description: string;
    preview: string;
    features: string[];
  };
  onSelect?: () => void;
  selected?: boolean;
}

export function TemplatePreview({ template, onSelect, selected }: TemplatePreviewProps) {
  return (
    <View style={styles.container}>
      <View style={styles.preview}>
        <Image source={{ uri: template.preview }} style={styles.previewImage} />
        <LinearGradient
          colors={['transparent', 'rgba(11, 16, 33, 0.95)']}
          style={styles.gradient}
        />
        {selected && (
          <View style={styles.selectedOverlay}>
            <Ionicons name="checkmark-circle" size={48} color="#45B08C" />
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View>
          <Text style={styles.name}>{template.name}</Text>
          <Text style={styles.description}>{template.description}</Text>
        </View>

        <View style={styles.features}>
          {template.features.map((feature, index) => (
            <View key={index} style={styles.feature}>
              <Ionicons name="checkmark-circle" size={16} color="#45B08C" />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.selectButton, selected && styles.selectedButton]}
          onPress={onSelect}>
          <Text style={[styles.selectButtonText, selected && styles.selectedButtonText]}>
            {selected ? 'Selected' : 'Use Template'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  preview: {
    height: 240,
    position: 'relative',
  },
  previewImage: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(69, 176, 140, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 24,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#A0AEC0',
    marginBottom: 16,
    lineHeight: 24,
  },
  features: {
    gap: 12,
    marginBottom: 24,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  selectButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#45B08C',
  },
  selectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  selectedButtonText: {
    color: '#FFFFFF',
  },
});