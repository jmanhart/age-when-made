import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { version } from "./package.json";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    // Only enable Sentry sourcemap uploads when auth token is available (CI/production builds)
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
    },
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
  },
  define: {
    __SENTRY_RELEASE__: JSON.stringify(`movieapp@${version}`),
  },
  optimizeDeps: {
    include: ["@sentry/react"],
  },
});
