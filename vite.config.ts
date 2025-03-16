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
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "src") },
      { find: /^~/, replacement: path.resolve(__dirname, "src") },
    ],
    extensions: [".mjs", ".js", ".mts", ".ts", ".jsx", ".tsx", ".json"],
  },
  build: {
    sourcemap: true,
    outDir: "dist",
    assetsDir: "assets",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
      },
    },
    modulePreload: {
      polyfill: true,
    },
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
  },
  define: {
    __SENTRY_RELEASE__: JSON.stringify(`movieapp@${version}`),
  },
  base: "/",
  server: {
    port: 3000,
    strictPort: true,
  },
  preview: {
    port: 3000,
    strictPort: true,
  },
});
