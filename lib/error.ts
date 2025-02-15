import { Platform } from 'react-native';

// For web, import from @sentry/browser instead
let Sentry: any;

if (Platform.OS === 'web') {
  import('@sentry/browser').then((module) => {
    Sentry = module;
  });
} else {
  import('@sentry/react-native').then((module) => {
    Sentry = module;
  });
}

// Error types
export enum ErrorType {
  AUTH = 'auth',
  NETWORK = 'network',
  DATABASE = 'database',
  VALIDATION = 'validation',
  UNKNOWN = 'unknown',
}

// Error severity levels
export enum ErrorSeverity {
  FATAL = 'fatal',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

// Custom error class
export class AppError extends Error {
  type: ErrorType;
  severity: ErrorSeverity;
  metadata?: Record<string, any>;

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    severity: ErrorSeverity = ErrorSeverity.ERROR,
    metadata?: Record<string, any>
  ) {
    super(message);
    this.type = type;
    this.severity = severity;
    this.metadata = metadata;
    this.name = 'AppError';
  }
}

// Error handler
export function handleError(error: Error | AppError, context?: string) {
  const appError = error instanceof AppError ? error : new AppError(error.message);

  // Log error
  console.error(`[${context || 'App'}] ${appError.message}`, {
    type: appError.type,
    severity: appError.severity,
    metadata: appError.metadata,
    stack: appError.stack,
  });

  // Send to monitoring service if Sentry is initialized
  if (Sentry) {
    Sentry.captureException(appError, {
      tags: {
        type: appError.type,
        severity: appError.severity,
        context,
        platform: Platform.OS,
      },
      extra: appError.metadata,
    });
  }

  return appError;
}

// Initialize error monitoring
export async function initializeErrorMonitoring() {
  try {
    if (!Sentry) {
      if (Platform.OS === 'web') {
        Sentry = (await import('@sentry/browser')).default;
      } else {
        Sentry = (await import('@sentry/react-native')).default;
      }
    }

    Sentry.init({
      dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
      enableInExpoDevelopment: true,
      debug: __DEV__,
      environment: process.env.NODE_ENV,
      integrations: [
        new Sentry.BrowserTracing(),
        new Sentry.Replay(),
      ],
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    });
  } catch (error) {
    console.warn('Failed to initialize Sentry:', error);
  }
}