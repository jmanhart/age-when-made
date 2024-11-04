import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MovieSearch from "./MovieSearch";
import { MemoryRouter } from "react-router-dom";

test("renders MovieSearch component and allows typing in search input", () => {
  render(
    <MemoryRouter>
      <MovieSearch />
    </MemoryRouter>
  );

  const inputElement = screen.getByPlaceholderText(/search for a movie.../i);
  expect(inputElement).toBeInTheDocument();

  fireEvent.change(inputElement, { target: { value: "Inception" } });
  expect(inputElement).toHaveValue("Inception");
});

test("displays suggestions when typing", async () => {
  render(
    <MemoryRouter>
      <MovieSearch />
    </MemoryRouter>
  );

  const inputElement = screen.getByPlaceholderText(/search for a movie.../i);
  fireEvent.change(inputElement, { target: { value: "Inception" } });

  const suggestion = await screen.findByText(/Inception/i);
  expect(suggestion).toBeInTheDocument();
});
