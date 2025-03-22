import React from "react";
import { useGlobals } from "@storybook/preview-api";

type StoryComponent = React.ComponentType<Record<string, unknown>>;

export const ThemeDecorator = (Story: StoryComponent) => {
  const [{ theme = "light" }] = useGlobals();

  React.useEffect(() => {
    // Set the theme on both document element and body
    document.documentElement.setAttribute("data-theme", theme);
    document.body.setAttribute("data-theme", theme);

    // Also add/remove the dark class for compatibility
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }

    // Update background color based on theme
    document.body.style.backgroundColor =
      theme === "dark" ? "var(--color-bg)" : "var(--color-bg)";
  }, [theme]);

  return (
    <div
      style={{
        padding: "2rem",
        minHeight: "100vh",
        backgroundColor: "var(--color-bg)",
        color: "var(--color-text)",
      }}
    >
      <Story />
    </div>
  );
};
