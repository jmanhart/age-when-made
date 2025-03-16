import { http, HttpResponse } from "msw";
import { mockMovies, mockActors } from "./movieData";

export const handlers = [
  // Mock the movies search endpoint
  http.get("*/search/movie", () => {
    return HttpResponse.json({
      results: mockMovies,
    });
  }),

  // Mock the actors search endpoint
  http.get("*/search/person", () => {
    return HttpResponse.json({
      results: mockActors,
    });
  }),
];
