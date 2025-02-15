import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ErrorMessage } from '@/components/ErrorMessage';
import { AppError, ErrorType, ErrorSeverity } from '@/lib/error';

describe('ErrorMessage', () => {
  it('renders nothing when there is no error', () => {
    const { container } = render(<ErrorMessage error={null} />);
    expect(container.children.length).toBe(0);
  });

  it('renders error message for standard Error', () => {
    const error = new Error('Test error message');
    const { getByText } = render(<ErrorMessage error={error} />);
    expect(getByText('Test error message')).toBeTruthy();
  });

  it('renders error message for AppError with type and severity', () => {
    const error = new AppError(
      'Test app error',
      ErrorType.NETWORK,
      ErrorSeverity.ERROR
    );
    const { getByText } = render(<ErrorMessage error={error} />);
    expect(getByText('Test app error')).toBeTruthy();
  });

  it('renders retry button when onRetry is provided', () => {
    const onRetry = jest.fn();
    const error = new Error('Test error');
    const { getByText } = render(
      <ErrorMessage error={error} onRetry={onRetry} />
    );

    const retryButton = getByText('Try Again');
    expect(retryButton).toBeTruthy();

    fireEvent.press(retryButton);
    expect(onRetry).toHaveBeenCalled();
  });

  it('does not render retry button when onRetry is not provided', () => {
    const error = new Error('Test error');
    const { queryByText } = render(<ErrorMessage error={error} />);
    expect(queryByText('Try Again')).toBeNull();
  });
});