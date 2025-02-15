import { useState } from 'react';
import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const pickImage = async () => {
    try {
      // Request permissions first
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          throw new Error('Permission to access media library was denied');
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        return result.assets[0];
      }
    } catch (e) {
      setError(e as Error);
      throw e;
    }
  };

  const uploadImage = async (uri: string, path: string) => {
    try {
      setUploading(true);
      setError(null);

      let blob;
      if (Platform.OS === 'web') {
        // For web, fetch the image and convert to blob
        const response = await fetch(uri);
        blob = await response.blob();
      } else {
        // For native platforms, convert URI to blob
        const response = await fetch(uri);
        blob = await response.blob();
      }

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('logos')
        .upload(path, blob, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setUploading(false);
    }
  };

  return {
    pickImage,
    uploadImage,
    uploading,
    error,
  };
}