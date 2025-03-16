import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr"; // Import the SVGR plugin
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { version } from "./package.json";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    sentryVitePlugin({
      org: "movieapp",
      project: "javascript-react",
      authToken: process.env.SENTRY_AUTH_TOKEN,
      release: `movieapp@${version}`,
      sourcemaps: {
        include: ["./dist"],
      },
    }),
  ],
  build: {
    sourcemap: true, // Generate source maps for easier debugging
  },
  define: {
    __SENTRY_RELEASE__: JSON.stringify(`movieapp@${version}`),
  },
});
