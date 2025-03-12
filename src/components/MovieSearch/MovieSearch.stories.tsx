import React, { useState } from "react";
import { MemoryRouter } from "react-router-dom";
import MovieSearch from "./MovieSearch";

export default {
  title: "Components/MovieSearch",
  component: MovieSearch,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  argTypes: {
    isHeaderSearch: { control: "boolean" },
  },
};

export const Default = (args) => <MovieSearch {...args} />;
Default.args = {
  isHeaderSearch: false,
};

export const InHeader = (args) => <MovieSearch {...args} />;
InHeader.args = {
  isHeaderSearch: true,
};

export const WithUserInput = (args) => {
  const [query, setQuery] = useState("");

  return (
    <MemoryRouter>
      <MovieSearch {...args} searchQuery={query} onSearch={setQuery} />
    </MemoryRouter>
  );
};
WithUserInput.args = {
  isHeaderSearch: true,
};
