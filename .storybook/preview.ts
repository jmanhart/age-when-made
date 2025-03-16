import type { Preview } from "@storybook/react";
import "../src/styles/global.css"; // ✅ Adjust path if necessary
import { initialize, mswLoader } from "msw-storybook-addon";
import { handlers } from "../src/__mocks__/handlers";

// Initialize MSW
initialize({
  serviceWorker: {
    url: "/mockServiceWorker.js",
  },
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    msw: {
      handlers: handlers,
    },
  },
  loaders: [mswLoader],
};

export default preview;
