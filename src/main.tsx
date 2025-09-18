import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { initSentry, logPerformance } from "./utils/sentry";
import { PostHogProvider } from "posthog-js/react";
import "./styles/global.css";

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

// Log app startup performance after render
const appRenderTime = performance.now() - appStartTime;
logPerformance("app_startup", appRenderTime, {
  environment: import.meta.env.MODE,
  userAgent: navigator.userAgent,
  viewport: `${window.innerWidth}x${window.innerHeight}`,
});
