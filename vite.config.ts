import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr"; // Import the SVGR plugin
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { version } from "./package.json";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    sentryVitePlugin({
      org: "movieapp",
      project: "javascript-react",
      authToken: process.env.SENTRY_AUTH_TOKEN,
      release: {
        name: `movieapp@${version}`,
      },
      sourcemaps: {
        assets: ["./dist/**"],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: [".mjs", ".js", ".mts", ".ts", ".jsx", ".tsx", ".json"],
  },
  build: {
    sourcemap: true, // Generate source maps for easier debugging
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
      },
      output: {
        manualChunks: undefined,
      },
    },
  },
  define: {
    __SENTRY_RELEASE__: JSON.stringify(`movieapp@${version}`),
  },
});
