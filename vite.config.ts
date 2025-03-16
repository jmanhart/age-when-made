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
    // Only include Sentry plugin if auth token is available
    process.env.SENTRY_AUTH_TOKEN &&
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
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      util: "rollup-plugin-node-polyfills/polyfills/util",
      stream: "rollup-plugin-node-polyfills/polyfills/stream",
      events: "rollup-plugin-node-polyfills/polyfills/events",
    },
    extensions: [".mjs", ".js", ".mts", ".ts", ".jsx", ".tsx", ".json"],
    mainFields: ["module", "jsnext:main", "jsnext", "main"],
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
      external: [
        "http",
        "https",
        "url",
        "assert",
        "stream",
        "tty",
        "util",
        "os",
        "zlib",
        "path",
        "fs",
        "events",
      ],
    },
    modulePreload: {
      polyfill: true,
    },
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
  },
  define: {
    __SENTRY_RELEASE__: JSON.stringify(`movieapp@${version}`),
    global: "globalThis",
    "process.env": {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    },
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
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
    include: ["@sentry/react"],
  },
});
