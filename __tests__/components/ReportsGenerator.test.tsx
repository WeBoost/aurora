import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ReportsGenerator } from '@/components/ReportsGenerator';
import { useAnalytics } from '@/hooks/useAnalytics';

jest.mock('@/hooks/useAnalytics');

describe('ReportsGenerator', () => {
  const mockAnalyticsData = {
    views: 1000,
    bookings: {
      total: 50,
      completed: 30,
      revenue: 150000,
      averageValue: 5000,
    },
    topServices: [
      {
        name: 'Test Service',
        bookings: 20,
        revenue: 100000,
      },
    ],
    recentActivity: [],
  };

  beforeEach(() => {
    (useAnalytics as jest.Mock).mockReturnValue({
      data: mockAnalyticsData,
      loading: false,
      error: null,
    });
  });

  it('renders loading state', () => {
    (useAnalytics as jest.Mock).mockReturnValue({
      data: null,
      loading: true,
      error: null,
    });

    const { getByText } = render(
      <ReportsGenerator businessId="test-id" />
    );

    expect(getByText('Loading reports...')).toBeTruthy();
  });

  it('renders error state', () => {
    (useAnalytics as jest.Mock).mockReturnValue({
      data: null,
      loading: false,
      error: new Error('Test error'),
    });

    const { getByText } = render(
      <ReportsGenerator businessId="test-id" />
    );

    expect(getByText('Failed to load reports')).toBeTruthy();
  });

  it('allows period selection', () => {
    const { getByText } = render(
      <ReportsGenerator businessId="test-id" />
    );

    fireEvent.press(getByText('Daily'));
    expect(getByText('Daily')).toBeTruthy();
  });

  it('allows metric selection', () => {
    const { getByText } = render(
      <ReportsGenerator businessId="test-id" />
    );

    fireEvent.press(getByText('Revenue'));
    expect(getByText('Revenue')).toBeTruthy();
  });

  it('calls onExport with correct data', () => {
    const mockExport = jest.fn();
    const { getByText } = render(
      <ReportsGenerator businessId="test-id" onExport={mockExport} />
    );

    fireEvent.press(getByText('Export Report'));

    expect(mockExport).toHaveBeenCalledWith(expect.objectContaining({
      period: 'week',
      metrics: ['bookings', 'revenue'],
      data: expect.any(Object),
    }));
  });
});