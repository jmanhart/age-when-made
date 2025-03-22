import type { Preview } from "@storybook/react";
import { ThemeDecorator } from "../src/stories/decorators/ThemeDecorator";
import "../src/styles/theme.css";
import "../src/styles/global.css";
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
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      disable: true,
    },
    themes: {
      default: "light",
      list: [
        { name: "light", class: "", color: "#F8F9FA" },
        { name: "dark", class: "dark", color: "#121212" },
      ],
    },
    msw: {
      handlers: handlers,
    },
  },
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Global theme for components",
      defaultValue: "light",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: [
          { value: "light", right: "🌞", title: "Light" },
          { value: "dark", right: "🌙", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [ThemeDecorator],
  loaders: [mswLoader],
};

export default preview;
