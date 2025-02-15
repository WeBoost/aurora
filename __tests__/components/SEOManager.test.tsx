import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SEOManager } from '@/components/SEOManager';
import { useWebsiteSEO } from '@/hooks/useWebsiteSEO';

jest.mock('@/hooks/useWebsiteSEO');

describe('SEOManager', () => {
  const mockSEOData = {
    title: 'Test Title',
    description: 'Test Description',
    keywords: 'test, keywords',
    ogTitle: 'OG Title',
    ogDescription: 'OG Description',
    ogImage: 'https://example.com/image.jpg',
    twitterCard: 'summary_large_image' as const,
    twitterTitle: 'Twitter Title',
    twitterDescription: 'Twitter Description',
    twitterImage: 'https://example.com/twitter.jpg',
    structuredData: '{}',
  };

  beforeEach(() => {
    (useWebsiteSEO as jest.Mock).mockReturnValue({
      seoData: mockSEOData,
      loading: false,
      error: null,
      updateSEO: jest.fn(),
    });
  });

  it('renders loading state', () => {
    (useWebsiteSEO as jest.Mock).mockReturnValue({
      seoData: null,
      loading: true,
      error: null,
      updateSEO: jest.fn(),
    });

    const { getByText } = render(<SEOManager businessId="test-id" />);
    expect(getByText('Loading SEO settings...')).toBeTruthy();
  });

  it('renders error state', () => {
    (useWebsiteSEO as jest.Mock).mockReturnValue({
      seoData: null,
      loading: false,
      error: new Error('Test error'),
      updateSEO: jest.fn(),
    });

    const { getByText } = render(<SEOManager businessId="test-id" />);
    expect(getByText('Failed to load SEO settings')).toBeTruthy();
  });

  it('renders form with SEO data', () => {
    const { getByPlaceholderText } = render(<SEOManager businessId="test-id" />);
    
    const titleInput = getByPlaceholderText('Enter page title');
    expect(titleInput.props.value).toBe(mockSEOData.title);
  });

  it('handles form submission', () => {
    const mockUpdateSEO = jest.fn();
    (useWebsiteSEO as jest.Mock).mockReturnValue({
      seoData: mockSEOData,
      loading: false,
      error: null,
      updateSEO: mockUpdateSEO,
    });

    const { getByText } = render(<SEOManager businessId="test-id" />);
    
    fireEvent.press(getByText('Save Changes'));
    expect(mockUpdateSEO).toHaveBeenCalledWith(expect.objectContaining({
      title: mockSEOData.title,
    }));
  });
});