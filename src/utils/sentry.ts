declare const __SENTRY_RELEASE__: string;

import * as Sentry from "@sentry/react";

export const initSentry = () => {
  Sentry.init({
    dsn:
      import.meta.env.VITE_SENTRY_DSN ||
      "https://cda3683d91776dea04de4020bf07a802@o4508215900766208.ingest.us.sentry.io/4508215907713024",
    integrations: [
      Sentry.browserTracingIntegration({
        // Enable automatic network request tracing for external APIs
        tracePropagationTargets: [
          "localhost",
          /^\//, // Same-origin requests
          /^https:\/\/api\.themoviedb\.org/, // TMDB API
        ],
        // Enable Web Vitals and interaction tracking
        enableLongTask: true, // Long task detection
        // Improve transaction naming for better grouping
        beforeStartSpan: (context) => {
          // Parameterize movie and actor IDs for better transaction grouping
          let name = context.name || window.location.pathname;
          name = name
            .replace(/\/movie\/\d+/, '/movie/:id')
            .replace(/\/actor\/\d+/, '/actor/:id')
            .replace(/\/\d+$/, '/:id');
          return {
            ...context,
            name,
          };
        },
        // Filter out noise from performance monitoring
        shouldCreateSpanForRequest: (url) => {
          // Don't create spans for static assets or favicon
          return !url.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2)(\?.*)?$/);
        },
      }),
    ],
    tracesSampleRate: 1.0,
    environment: import.meta.env.MODE,
    debug: import.meta.env.DEV,
    release: __SENTRY_RELEASE__,
  });
};

export const startTransaction = (name: string, op: string) => {
  const transaction = Sentry.startTransaction({ name, op });
  Sentry.configureScope((scope) => {
    scope.setSpan(transaction);
  });
  return transaction;
};

export const captureComponentError = (error: Error, componentName: string) => {
  Sentry.withScope((scope) => {
    scope.setTag("component", componentName);
    scope.setLevel("error");
    Sentry.captureException(error);
  });
};

export const addBreadcrumb = (
  category: string,
  message: string,
  level: Sentry.SeverityLevel = "info",
  data?: Record<string, unknown>
) => {
  Sentry.addBreadcrumb({
    category,
    message,
    level,
    data,
  });
};

export const withSentryTracking = async <T>(
  operation: string,
  fn: () => Promise<T>
): Promise<T> => {
  const transaction = startTransaction(operation, "http.client");
  try {
    const result = await fn();
    transaction.setStatus("ok");
    return result;
  } catch (error) {
    transaction.setStatus("error");
    Sentry.captureException(error);
    throw error;
  } finally {
    transaction.finish();
  }
};
