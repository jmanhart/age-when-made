import React from "react";
import * as Sentry from "@sentry/react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export const SentryErrorBoundary: React.FC<ErrorBoundaryProps> = ({
  children,
}) => (
  <Sentry.ErrorBoundary
    fallback={({ error, resetError }) => (
      <div>
        <h2>Something went wrong!</h2>
        <pre>{error.message}</pre>
        <button onClick={resetError}>Try again</button>
      </div>
    )}
  >
    {children}
  </Sentry.ErrorBoundary>
);

export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) => {
  return Sentry.withErrorBoundary(Component, {
    fallback: ({ error, resetError }) => (
      <div>
        <h2>Something went wrong in {componentName}!</h2>
        <pre>{error.message}</pre>
        <button onClick={resetError}>Try again</button>
      </div>
    ),
  });
};
