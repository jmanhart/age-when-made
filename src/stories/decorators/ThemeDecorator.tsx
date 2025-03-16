import React from "react";
import { useEffect } from "react";

export const ThemeDecorator = (Story: any, context: any) => {
  const theme = context.parameters.theme || "light";

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    return () => {
      document.documentElement.removeAttribute("data-theme");
    };
  }, [theme]);

  return <Story />;
};
