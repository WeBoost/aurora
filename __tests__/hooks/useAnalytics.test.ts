import { renderHook, act } from '@testing-library/react-native';
import { useAnalytics } from '@/hooks/useAnalytics';
import { supabase } from '@/lib/supabase';

jest.mock('@/lib/supabase');

describe('useAnalytics', () => {
  const mockBookings = [
    {
      id: '1',
      status: 'completed',
      total_amount: 10000,
      service: { name: 'Test Service' },
      customer_name: 'John Doe',
      created_at: '2025-02-15T10:00:00Z',
    },
  ];

  beforeEach(() => {
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({
        data: mockBookings,
        error: null,
      }),
    });
  });

  it('fetches and processes analytics data', async () => {
    const { result } = renderHook(() => useAnalytics('test-id'));

    // Initial state
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);

    // Wait for data to load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Check processed data
    expect(result.current.loading).toBe(false);
    expect(result.current.data.bookings.total).toBe(1);
    expect(result.current.data.bookings.completed).toBe(1);
    expect(result.current.data.bookings.revenue).toBe(10000);
  });

  it('handles errors', async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({
        data: null,
        error: new Error('Test error'),
      }),
    });

    const { result } = renderHook(() => useAnalytics('test-id'));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeTruthy();
  });
});