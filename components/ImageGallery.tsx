import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWebsiteImages } from '@/hooks/useWebsiteImages';

interface ImageGalleryProps {
  businessId: string;
  onSelect?: (image: { id: string; url: string }) => void;
}

export function ImageGallery({ businessId, onSelect }: ImageGalleryProps) {
  const {
    images,
    uploading,
    loading,
    error,
    pickImage,
    uploadImage,
  } = useWebsiteImages(businessId);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleUpload = async () => {
    try {
      const image = await pickImage();
      if (!image) return;

      const uploaded = await uploadImage(image.uri);
      if (onSelect) {
        onSelect(uploaded);
      }
    } catch (e) {
      console.error('Failed to upload image:', e);
    }
  };

  if (loading) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>Loading images...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.errorText}>Failed to load images</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={handleUpload}
        disabled={uploading}>
        <Ionicons name="cloud-upload" size={24} color="#45B08C" />
        <Text style={styles.uploadButtonText}>
          {uploading ? 'Uploading...' : 'Upload Image'}
        </Text>
      </TouchableOpacity>

      <ScrollView 
        horizontal={Platform.OS === 'web'}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.imageGrid}>
        {images.map((image) => (
          <TouchableOpacity
            key={image.id}
            style={[
              styles.imageCard,
              selectedImage === image.id && styles.imageCardSelected,
            ]}
            onPress={() => {
              setSelectedImage(image.id);
              if (onSelect) onSelect(image);
            }}>
            <Image source={{ uri: image.url }} style={styles.image} />
            {selectedImage === image.id && (
              <View style={styles.selectedOverlay}>
                <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
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
    marginBottom: 20,
  },
  uploadButtonText: {
    color: '#45B08C',
    fontSize: 16,
    fontWeight: '500',
  },
  imageGrid: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    gap: 16,
    flexWrap: Platform.OS === 'web' ? 'wrap' : 'nowrap',
  },
  imageCard: {
    width: Platform.OS === 'web' ? 200 : '100%',
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  imageCardSelected: {
    borderWidth: 2,
    borderColor: '#45B08C',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(69, 176, 140, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});