// Mock implementation of Sentry functions for Storybook
export const startTransaction = (name: string, op: string) => ({
  setStatus: (status: string) => {},
  finish: () => {},
});

export const captureComponentError = (
  error: Error,
  componentName: string
) => {};

export const addBreadcrumb = (
  category: string,
  message: string,
  level: string = "info",
  data?: Record<string, unknown>
) => {};

export const withSentryTracking = async <T>(
  operation: string,
  fn: () => Promise<T>
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    console.error(`Error in ${operation}:`, error);
    throw error;
  }
};
