import { MemoryRouter, useLocation } from "react-router-dom";
import Header from "./Header";

export default {
  title: "Components/Header",
  component: Header,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/movie/123"]}>
        <Story />
      </MemoryRouter>
    ),
  ],
};

// Default story with a non-root route
export const Default = () => <Header />;
