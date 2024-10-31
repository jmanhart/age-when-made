import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
// import { BrowserTracing } from "@sentry/react";

import App from "./App.tsx";
import "./styles/global.css";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN, // Replace with your actual Sentry DSN
  integrations: [
    Sentry.replayIntegration(),
    Sentry.browserTracingIntegration(),
  ],
  tracesSampleRate: 0.5, // Adjust the sampling rate for performance monitoring
  tracePropagationTargets: ["localhost", "localhost:5173/movie/"],
  replaysSessionSampleRate: 0.1,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
