import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { useAnalytics } from '@/hooks/useAnalytics';

// Mock the useAnalytics hook
jest.mock('@/hooks/useAnalytics');

describe('AnalyticsDashboard', () => {
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
    recentActivity: [
      {
        type: 'booking',
        timestamp: '2025-02-15T10:00:00Z',
        details: {
          customer_name: 'John Doe',
        },
      },
    ],
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

    render(<AnalyticsDashboard businessId="test-id" />);
    expect(screen.getByText('Loading analytics...')).toBeTruthy();
  });

  it('renders error state', () => {
    (useAnalytics as jest.Mock).mockReturnValue({
      data: null,
      loading: false,
      error: new Error('Test error'),
    });

    render(<AnalyticsDashboard businessId="test-id" />);
    expect(screen.getByText('Failed to load analytics')).toBeTruthy();
  });

  it('renders analytics data', () => {
    render(<AnalyticsDashboard businessId="test-id" />);
    
    // Check stats are rendered
    expect(screen.getByText('1000')).toBeTruthy(); // Views
    expect(screen.getByText('50')).toBeTruthy(); // Total bookings
    expect(screen.getByText('30')).toBeTruthy(); // Completed bookings
    expect(screen.getByText('ISK 150000')).toBeTruthy(); // Revenue

    // Check top services
    expect(screen.getByText('Test Service')).toBeTruthy();

    // Check recent activity
    expect(screen.getByText('New booking from John Doe')).toBeTruthy();
  });
});