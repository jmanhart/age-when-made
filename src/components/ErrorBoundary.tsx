import React from "react";
import * as Sentry from "@sentry/react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export const SentryErrorBoundary: React.FC<ErrorBoundaryProps> = ({
  children,
}) => (
  <Sentry.ErrorBoundary
    fallback={({ error, resetError, eventId }) => {
      // Log the error boundary fallback
      Sentry.logger.error(
        Sentry.logger.fmt`Error boundary triggered: ${error.message}`,
        {
          error: error.message,
          stack: error.stack,
          eventId,
          component: "SentryErrorBoundary",
        }
      );

      return (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h2>Something went wrong!</h2>
          <p>We've been notified about this error and are working to fix it.</p>
          <pre
            style={{
              textAlign: "left",
              background: "#f5f5f5",
              padding: "10px",
            }}
          >
            {error.message}
          </pre>
          <button
            onClick={resetError}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      );
    }}
    beforeCapture={(scope, error, errorInfo) => {
      // Add additional context before capturing the error
      scope.setTag("errorBoundary", "SentryErrorBoundary");
      scope.setContext("errorInfo", errorInfo);

      // Log the error before capture
      Sentry.logger.error(
        Sentry.logger.fmt`Error boundary captured error: ${error.message}`,
        {
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          errorBoundary: "SentryErrorBoundary",
        }
      );
    }}
  >
    {children}
  </Sentry.ErrorBoundary>
);

export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) => {
  return Sentry.withErrorBoundary(Component, {
    fallback: ({ error, resetError, eventId }) => {
      // Log the component-specific error boundary fallback
      Sentry.logger.error(
        Sentry.logger
          .fmt`Component error boundary triggered in ${componentName}: ${error.message}`,
        {
          error: error.message,
          stack: error.stack,
          eventId,
          component: componentName,
        }
      );

      return (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h2>Something went wrong in {componentName}!</h2>
          <p>We've been notified about this error and are working to fix it.</p>
          <pre
            style={{
              textAlign: "left",
              background: "#f5f5f5",
              padding: "10px",
            }}
          >
            {error.message}
          </pre>
          <button
            onClick={resetError}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      );
    },
    beforeCapture: (scope, error, errorInfo) => {
      // Add component-specific context
      scope.setTag("errorBoundary", "withErrorBoundary");
      scope.setTag("component", componentName);
      scope.setContext("errorInfo", errorInfo);

      // Log the component-specific error
      Sentry.logger.error(
        Sentry.logger
          .fmt`Component error boundary captured error in ${componentName}: ${error.message}`,
        {
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          component: componentName,
          errorBoundary: "withErrorBoundary",
        }
      );
    },
  });
};
