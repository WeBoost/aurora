import { useState, useCallback } from 'react';
import { AppError, ErrorType, ErrorSeverity, handleError } from '@/lib/error';

export function useErrorHandler(context?: string) {
  const [error, setError] = useState<AppError | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsync = useCallback(async <T>(
    promise: Promise<T>,
    errorConfig?: {
      type?: ErrorType;
      severity?: ErrorSeverity;
      message?: string;
      metadata?: Record<string, any>;
    }
  ): Promise<T> => {
    try {
      setLoading(true);
      setError(null);
      return await promise;
    } catch (e) {
      const appError = handleError(
        new AppError(
          errorConfig?.message || (e as Error).message,
          errorConfig?.type,
          errorConfig?.severity,
          errorConfig?.metadata
        ),
        context
      );
      setError(appError);
      throw appError;
    } finally {
      setLoading(false);
    }
  }, [context]);

  return {
    error,
    loading,
    handleAsync,
    setError,
  };
}