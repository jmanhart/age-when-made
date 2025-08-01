import axios from "axios";
import { Movie, Cast, Actor } from "../types/types";
import fetchActorDetails from "./fetchActorDetails";
import { calculateAgeAtDate } from "./calculateAge";
import * as Sentry from "@sentry/react";
import { addBreadcrumb, withSentryTracking } from "./sentry";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

/**
 * Fetches a list of movies based on a search query.
 * @param query - The search query
 * @returns A list of movies that match the query
 */
const fetchMovies = async (query: string): Promise<Movie[]> => {
  return withSentryTracking("fetchMovies", async () => {
    addBreadcrumb("api", "Fetching movies", "info", { query });

    const response = await axios.get<{ results: Movie[] }>(
      `${API_BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}`
    );

    addBreadcrumb("api", "Movies fetched successfully", "info", {
      query,
      resultCount: response.data.results.length,
    });

    return response.data.results;
  });
};

/**
 * Fetches a list of actors based on a search query.
 * @param query - The search query
 * @returns A list of actors that match the query
 */
const fetchActors = async (query: string): Promise<Actor[]> => {
  return withSentryTracking("fetchActors", async () => {
    try {
      const response = await axios.get<{ results: Actor[] }>(
        `${API_BASE_URL}/search/person?api_key=${API_KEY}&query=${encodeURIComponent(
          query
        )}`
      );
      return response.data.results;
    } catch (error) {
      console.error("Error fetching actors:", error);
      return [];
    }
  });
};

/**
 * Fetches a combined list of movie and actor suggestions for autocomplete.
 * @param query - The partial search query
 * @returns A list of suggested movies and actors that match the query
 */
const fetchSuggestions = async (query: string): Promise<(Movie | Actor)[]> => {
  try {
    const movieResults = await fetchMovies(query);
    const actorResults = await fetchActors(query);
    return [...movieResults, ...actorResults];
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return [];
  }
};

/**
 * Fetches detailed information for a specific movie by ID.
 * @param movieId - The unique ID of the movie
 * @returns The detailed movie information or null if not found
 */
const fetchMovieById = async (movieId: number): Promise<Movie | null> => {
  try {
    const response = await axios.get<Movie>(
      `${API_BASE_URL}/movie/${movieId}?api_key=${API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
};

/**
 * Fetches the detailed cast list for a specific movie, including each actor's birthday, deathday, and age calculations.
 * @param movieId - The unique ID of the movie
 * @param releaseDate - The release date of the movie in "YYYY-MM-DD" format
 * @returns A list of cast members with detailed information
 */
const fetchMovieCast = async (
  movieId: number,
  releaseDate: string
): Promise<Actor[]> => {
  addBreadcrumb("api", "Fetching movie cast", "info", { movieId, releaseDate });

  console.log("fetchMovieCast called with:", { movieId, releaseDate });

  try {
    const response = await axios.get<{ cast: Cast[] }>(
      `${API_BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`
    );

    const formattedReleaseDate = releaseDate
      ? new Date(releaseDate).toISOString().slice(0, 10)
      : null;

    // Enrich cast with actor details, including birthday and age calculations
    const castWithDetails = await Promise.all(
      response.data.cast.map(async (actor) => {
        const actorDetails = await fetchActorDetails(actor.id);

        console.log("Actor Details:", {
          name: actor.name,
          birthday: actorDetails.birthday,
          deathday: actorDetails.deathday,
        });

        const formattedBirthday = actorDetails.birthday
          ? new Date(actorDetails.birthday).toISOString().slice(0, 10)
          : null;
        const formattedDeathday = actorDetails.deathday
          ? new Date(actorDetails.deathday).toISOString().slice(0, 10)
          : null;

        // Calculate ages based on birthday and movie release date
        const ageAtRelease =
          formattedBirthday && formattedReleaseDate
            ? calculateAgeAtDate(formattedBirthday, formattedReleaseDate)
            : null;
        const currentAge =
          formattedBirthday && !formattedDeathday
            ? calculateAgeAtDate(
                formattedBirthday,
                new Date().toISOString().slice(0, 10)
              )
            : null;
        const ageAtDeath =
          formattedBirthday && formattedDeathday
            ? calculateAgeAtDate(actorDetails.birthday, actorDetails.deathday)
            : null;

        return {
          ...actor,
          birthday: formattedBirthday,
          deathday: formattedDeathday,
          profile_path: actor.profile_path,
          ageAtRelease,
          currentAge,
          ageAtDeath,
        };
      })
    );

    addBreadcrumb("api", "Cast fetched successfully", "info", {
      movieId,
      castCount: response.data.cast.length,
    });

    return castWithDetails;
  } catch (error) {
    addBreadcrumb("api", "Error fetching cast", "error", {
      movieId,
      error: error instanceof Error ? error.message : String(error),
    });
    console.error("Error fetching cast details:", error);
    return [];
  }
};

/**
 * Fetches an actor's filmography, calculating the actor's age at each movie release.
 * @param actorId - The unique ID of the actor
 * @returns A list of movies with age calculations for the actor at the time of each movie's release
 */
const fetchActorFilmography = async (actorId: number): Promise<Movie[]> => {
  try {
    const actorDetails = await fetchActorDetails(actorId); // Fetch actor's birth details
    const response = await axios.get<{ cast: Movie[] }>(
      `${API_BASE_URL}/person/${actorId}/movie_credits?api_key=${API_KEY}`
    );

    const filmographyWithAges = response.data.cast.map((movie) => {
      const formattedReleaseDate = movie.release_date
        ? new Date(movie.release_date).toISOString().slice(0, 10)
        : null;
      const ageAtRelease =
        actorDetails.birthday && formattedReleaseDate
          ? calculateAgeAtDate(actorDetails.birthday, formattedReleaseDate)
          : null;

      return {
        ...movie,
        ageAtRelease, // Actor's age during this movie's release
      };
    });

    return filmographyWithAges;
  } catch (error) {
    console.error("Error fetching actor filmography:", error);
    return [];
  }
};

export {
  fetchActorDetails,
  fetchActorFilmography,
  fetchMovieById,
  fetchSuggestions,
  fetchMovieCast,
  fetchMovies,
  fetchActors,
};
