import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { initSentry } from "./utils/sentry";
import "./styles/global.css";

// Initialize Sentry
initSentry();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
