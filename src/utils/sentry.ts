declare const __SENTRY_RELEASE__: string;

import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/react";

export const initSentry = () => {
  Sentry.init({
    dsn:
      import.meta.env.VITE_SENTRY_DSN ||
      "https://cda3683d91776dea04de4020bf07a802@o4508215900766208.ingest.us.sentry.io/4508215907713024",
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
    environment: import.meta.env.MODE,
    enabled: import.meta.env.PROD,
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
