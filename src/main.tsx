import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { initSentry, logPerformance } from "./utils/sentry";
import { PostHogProvider } from "posthog-js/react";
import "./styles/global.css";

// Initialize MSW for development (only if VITE_USE_MOCK is true)
const useMock = import.meta.env.VITE_USE_MOCK === "true";
if (import.meta.env.DEV && useMock) {
  console.log("🎭 Mock Service Worker enabled - using mock data");
  const { worker } = await import("./__mocks__/browser");
  await worker.start({
    onUnhandledRequest: "bypass",
  });
} else if (import.meta.env.DEV) {
  console.log("🌐 Mock Service Worker disabled - using real API");
}

// Initialize Sentry
initSentry();

// Log app startup performance
const appStartTime = performance.now();

const options = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  defaults: "2025-05-24",
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PostHogProvider
      apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
      options={options}
    >
      <App />
    </PostHogProvider>
  </React.StrictMode>
);
