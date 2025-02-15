import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export const TEMPLATES = {
  restaurant: {
    id: 'restaurant',
    name: 'Restaurant',
    description: 'Modern design perfect for restaurants and dining establishments',
    preview: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
    features: [
      'Menu showcase',
      'Table reservations',
      'Food gallery',
      'Online ordering',
    ],
    colors: {
      primary: '#45B08C',
      secondary: '#9B4F96',
      accent: '#A1D6E2',
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Inter',
    },
  },
  hospitality: {
    id: 'hospitality',
    name: 'Hotels & Accommodation',
    description: 'Elegant design for hotels and accommodation providers',
    preview: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
    features: [
      'Room booking system',
      'Virtual tours',
      'Amenities showcase',
      'Reviews integration',
    ],
    colors: {
      primary: '#9B4F96',
      secondary: '#45B08C',
      accent: '#FFD700',
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Lato',
    },
  },
  tours: {
    id: 'tours',
    name: 'Tours & Activities',
    description: 'Dynamic layout for tour operators and activity providers',
    preview: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7',
    features: [
      'Tour booking system',
      'Photo galleries',
      'Interactive maps',
      'Weather integration',
    ],
    colors: {
      primary: '#FF6B6B',
      secondary: '#4ECDC4',
      accent: '#45B7D1',
    },
    fonts: {
      heading: 'Montserrat',
      body: 'Open Sans',
    },
  },
  wellness: {
    id: 'wellness',
    name: 'Spas & Wellness',
    description: 'Serene design for spas and wellness centers',
    preview: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef',
    features: [
      'Appointment booking',
      'Service catalog',
      'Gift cards',
      'Member portal',
    ],
    colors: {
      primary: '#A1D6E2',
      secondary: '#9B4F96',
      accent: '#45B08C',
    },
    fonts: {
      heading: 'Cormorant Garamond',
      body: 'Nunito',
    },
  },
  cafe: {
    id: 'cafe',
    name: 'Cafes & Bars',
    description: 'Cozy design for cafes, bars and social establishments',
    preview: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb',
    features: [
      'Menu display',
      'Table bookings',
      'Events calendar',
      'Social integration',
    ],
    colors: {
      primary: '#D4A373',
      secondary: '#457B9D',
      accent: '#E9C46A',
    },
    fonts: {
      heading: 'Josefin Sans',
      body: 'Poppins',
    },
  },
};

export function useTemplates(businessId: string | undefined) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const applyTemplate = async (templateId: string) => {
    if (!businessId) throw new Error('Business ID is required');

    try {
      setLoading(true);
      setError(null);

      const template = TEMPLATES[templateId as keyof typeof TEMPLATES];
      if (!template) throw new Error('Invalid template');

      // Update website settings with new template
      const { error: updateError } = await supabase
        .from('websites')
        .upsert({
          business_id: businessId,
          template_id: templateId,
          theme: {
            colors: template.colors,
            fonts: template.fonts,
          },
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'business_id',
        });

      if (updateError) throw updateError;
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return {
    templates: TEMPLATES,
    loading,
    error,
    applyTemplate,
  };
}