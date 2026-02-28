import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { initSentry } from "./utils/sentry";
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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
