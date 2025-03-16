import type { Preview } from "@storybook/react";
import { ThemeDecorator } from "../src/stories/decorators/ThemeDecorator";
import "../src/styles/theme.css";
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
  decorators: [ThemeDecorator],
};

export default preview;
