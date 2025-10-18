import { http, HttpResponse } from "msw";
import { mockMovies, mockActors } from "./movieData";

export const handlers = [
  // Mock the movies search endpoint
  http.get("https://api.themoviedb.org/3/search/movie", () => {
    return HttpResponse.json({
      results: mockMovies,
    });
  }),

  // Mock the actors search endpoint
  http.get("https://api.themoviedb.org/3/search/person", () => {
    return HttpResponse.json({
      results: mockActors,
    });
  }),

  // Mock movie details endpoint
  http.get("https://api.themoviedb.org/3/movie/:movieId", ({ params }) => {
    const movie = mockMovies.find(m => m.id === Number(params.movieId));
    return HttpResponse.json(movie || null);
  }),

  // Mock movie credits endpoint
  http.get("https://api.themoviedb.org/3/movie/:movieId/credits", ({ params }) => {
    return HttpResponse.json({
      cast: mockActors.map(actor => ({
        ...actor,
        character: "Character Name", // Add character field for cast
      })),
    });
  }),

  // Mock person details endpoint
  http.get("https://api.themoviedb.org/3/person/:personId", ({ params }) => {
    const actor = mockActors.find(a => a.id === Number(params.personId));
    return HttpResponse.json(actor || null);
  }),

  // Mock person movie credits endpoint
  http.get("https://api.themoviedb.org/3/person/:personId/movie_credits", ({ params }) => {
    return HttpResponse.json({
      cast: mockMovies.map(movie => ({
        ...movie,
        ageAtRelease: 30, // Mock age calculation
      })),
    });
  }),
];
