import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr"; // Import the SVGR plugin
import { sentryVitePlugin } from "@sentry/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      // Options to ensure SVGs can be imported as React components
      svgrOptions: {
        exportType: "named", // Ensure ReactComponent export is named
      },
    }),
    sentryVitePlugin({
      org: "movieapp",
      project: "javascript-react",
    }),
  ],
  build: {
    sourcemap: true, // Generate source maps for easier debugging
  },
});
