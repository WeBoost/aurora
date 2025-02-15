import { renderHook, act } from '@testing-library/react-native';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { ErrorType, ErrorSeverity } from '@/lib/error';

describe('useErrorHandler', () => {
  it('handles successful async operations', async () => {
    const { result } = renderHook(() => useErrorHandler('test'));
    const successPromise = Promise.resolve('success');

    let response;
    await act(async () => {
      response = await result.current.handleAsync(successPromise);
    });

    expect(response).toBe('success');
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('handles failed async operations', async () => {
    const { result } = renderHook(() => useErrorHandler('test'));
    const failurePromise = Promise.reject(new Error('test error'));

    await act(async () => {
      try {
        await result.current.handleAsync(failurePromise, {
          type: ErrorType.NETWORK,
          severity: ErrorSeverity.ERROR,
          message: 'Custom error message',
        });
      } catch (error: any) {
        expect(error.message).toBe('Custom error message');
        expect(error.type).toBe(ErrorType.NETWORK);
        expect(error.severity).toBe(ErrorSeverity.ERROR);
      }
    });

    expect(result.current.error).not.toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('tracks loading state correctly', async () => {
    const { result } = renderHook(() => useErrorHandler('test'));
    const delayedPromise = new Promise(resolve => setTimeout(resolve, 100));

    act(() => {
      result.current.handleAsync(delayedPromise);
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await delayedPromise;
    });

    expect(result.current.loading).toBe(false);
  });

  it('allows manual error setting', () => {
    const { result } = renderHook(() => useErrorHandler('test'));

    act(() => {
      result.current.setError(new Error('Manual error'));
    });

    expect(result.current.error?.message).toBe('Manual error');
  });
});