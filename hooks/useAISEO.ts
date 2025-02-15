import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface AIGenerationOptions {
  type: 'seo' | 'content' | 'template';
  context: {
    businessType?: string;
    location?: string;
    service?: string;
    keywords?: string[];
    tone?: 'professional' | 'casual' | 'luxury';
  };
}

interface AIGenerationResult {
  title?: string;
  description?: string;
  keywords?: string[];
  content?: {
    sections: Array<{
      type: string;
      content: any;
    }>;
  };
  structuredData?: any;
}

export function useAISEO() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generateContent = async (options: AIGenerationOptions): Promise<AIGenerationResult> => {
    try {
      setLoading(true);
      setError(null);

      // Call OpenAI via Edge Function
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: options,
      });

      if (error) throw error;
      return data;
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const optimizeSEO = async (content: string, options: AIGenerationOptions): Promise<AIGenerationResult> => {
    try {
      setLoading(true);
      setError(null);

      // Call OpenAI via Edge Function
      const { data, error } = await supabase.functions.invoke('optimize-seo', {
        body: {
          content,
          ...options,
        },
      });

      if (error) throw error;
      return data;
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const generateTemplate = async (options: AIGenerationOptions): Promise<AIGenerationResult> => {
    try {
      setLoading(true);
      setError(null);

      // Call OpenAI via Edge Function
      const { data, error } = await supabase.functions.invoke('generate-template', {
        body: options,
      });

      if (error) throw error;
      return data;
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    generateContent,
    optimizeSEO,
    generateTemplate,
  };
}