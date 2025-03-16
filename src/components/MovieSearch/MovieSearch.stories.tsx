import React from "react";
import { MemoryRouter } from "react-router-dom";
import type { Meta, StoryObj } from "@storybook/react";
import MovieSearch from "./MovieSearch";
import { within, userEvent, expect } from "@storybook/test";
import { getMockSuggestions } from "../../__mocks__/movieData";

/**
 * The MovieSearch component provides a search interface for movies and actors.
 * It supports both header and standalone modes, with autocomplete suggestions.
 */

interface MovieSearchProps {
  isHeaderSearch?: boolean;
  searchQuery?: string;
  onSearch?: (query: string) => void;
}

const meta = {
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
  parameters: {
    viewport: {
      defaultViewport: "responsive",
      viewports: {
        mobile: {
          name: "Mobile",
          styles: {
            width: "320px",
            height: "568px",
          },
        },
        tablet: {
          name: "Tablet",
          styles: {
            width: "768px",
            height: "1024px",
          },
        },
        desktop: {
          name: "Desktop",
          styles: {
            width: "1024px",
            height: "768px",
          },
        },
      },
    },
  },
} satisfies Meta<typeof MovieSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = (args: MovieSearchProps) => <MovieSearch {...args} />;
Default.args = {
  isHeaderSearch: false,
};

export const InHeader = (args: MovieSearchProps) => <MovieSearch {...args} />;
InHeader.args = {
  isHeaderSearch: true,
};

export const Empty: Story = {
  args: {
    isHeaderSearch: false,
  },
};

export const WithSuggestions: Story = {
  args: {
    isHeaderSearch: false,
  },
  parameters: {
    mockData: {
      suggestions: getMockSuggestions(),
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText(/search for a movie or actor/i);
    await userEvent.type(input, "inception");
  },
};

export const Loading: Story = {
  args: {
    isHeaderSearch: false,
  },
  parameters: {
    mockData: {
      loading: true,
    },
  },
};

export const Error: Story = {
  args: {
    isHeaderSearch: false,
  },
  parameters: {
    mockData: {
      error: { message: "Failed to fetch results" },
    },
  },
};

export const SearchInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText(/search for a movie or actor/i);

    // Test input interaction
    await userEvent.type(input, "inception");
    await expect(canvas.getByText("Inception")).toBeInTheDocument();

    // Test suggestion click
    await userEvent.click(canvas.getByText("Inception"));
    // Add assertions for navigation
  },
};
