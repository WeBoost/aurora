import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';

export function useWebsiteImages(businessId: string | undefined) {
  const [images, setImages] = useState<Array<{ id: string; url: string }>>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!businessId) {
      setLoading(false);
      return;
    }

    const fetchImages = async () => {
      try {
        const { data, error } = await supabase.storage
          .from('website-images')
          .list(businessId);

        if (error) throw error;

        const imageUrls = data.map(file => ({
          id: file.id,
          url: supabase.storage
            .from('website-images')
            .getPublicUrl(`${businessId}/${file.name}`).data.publicUrl
        }));

        setImages(imageUrls);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [businessId]);

  const pickImage = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          throw new Error('Permission to access media library was denied');
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
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

  const uploadImage = async (uri: string) => {
    if (!businessId) throw new Error('Business ID is required');

    try {
      setUploading(true);
      setError(null);

      let blob;
      if (Platform.OS === 'web') {
        const response = await fetch(uri);
        blob = await response.blob();
      } else {
        const response = await fetch(uri);
        blob = await response.blob();
      }

      const filename = `${Date.now()}.jpg`;
      const path = `${businessId}/${filename}`;

      const { data, error } = await supabase.storage
        .from('website-images')
        .upload(path, blob, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('website-images')
        .getPublicUrl(data.path);

      const newImage = { id: data.id, url: publicUrl };
      setImages(prev => [...prev, newImage]);

      return newImage;
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (imageId: string) => {
    if (!businessId) throw new Error('Business ID is required');

    try {
      const { error } = await supabase.storage
        .from('website-images')
        .remove([`${businessId}/${imageId}`]);

      if (error) throw error;

      setImages(prev => prev.filter(img => img.id !== imageId));
    } catch (e) {
      setError(e as Error);
      throw e;
    }
  };

  return {
    images,
    uploading,
    loading,
    error,
    pickImage,
    uploadImage,
    deleteImage,
  };
}