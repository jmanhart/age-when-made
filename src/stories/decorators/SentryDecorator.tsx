import React from "react";
import type { Decorator } from "@storybook/react";

// Mock Sentry functions
const mockTransaction = {
  setStatus: () => {},
  finish: () => {},
};

export const startTransaction = () => mockTransaction;
export const captureComponentError = () => {};
export const addBreadcrumb = () => {};
export const withSentryTracking = async <T,>(
  _operation: string,
  fn: () => Promise<T>
): Promise<T> => {
  return fn();
};

// Create a context to provide mock Sentry functions
export const SentryContext = React.createContext({
  startTransaction,
  captureComponentError,
  addBreadcrumb,
  withSentryTracking,
});

export const SentryDecorator: Decorator = (Story) => {
  return (
    <SentryContext.Provider
      value={{
        startTransaction,
        captureComponentError,
        addBreadcrumb,
        withSentryTracking,
      }}
    >
      <Story />
    </SentryContext.Provider>
  );
};
