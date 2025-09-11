import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { initSentry } from "./utils/sentry";
import { PostHogProvider } from "posthog-js/react";
import "./styles/global.css";

// Initialize Sentry
initSentry();

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
