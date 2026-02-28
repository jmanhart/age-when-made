import axios from "axios";
import { Movie, Cast, Actor } from "../types/types";
import fetchActorDetails from "./fetchActorDetails";
import { calculateAgeAtDate } from "./calculateAge";
import * as Sentry from "@sentry/react";
import {
  logApiCall,
  logApiSuccess,
  logApiError,
} from "./sentry";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

/**
 * Fetches a list of movies based on a search query.
 * @param query - The search query
 * @returns A list of movies that match the query
 */
const fetchMovies = async (
  query: string,
  signal?: AbortSignal
): Promise<Movie[]> => {
  const endpoint = `${API_BASE_URL}/search/movie`;

  try {
    logApiCall(endpoint, "GET", { query });
    const response = await axios.get<{ results: Movie[] }>(
      `${endpoint}?api_key=${API_KEY}&query=${encodeURIComponent(query)}`,
      { signal }
    );
    logApiSuccess(endpoint, undefined, {
      query,
      resultCount: response.data.results.length,
    });
    return response.data.results;
  } catch (error) {
    if (axios.isCancel(error)) throw error;
    logApiError(endpoint, error as Error, { query });
    Sentry.captureException(error);
    throw error;
  }
};

/**
 * Fetches a list of actors based on a search query.
 * @param query - The search query
 * @returns A list of actors that match the query
 */
const fetchActors = async (
  query: string,
  signal?: AbortSignal
): Promise<Actor[]> => {
  const endpoint = `${API_BASE_URL}/search/person`;

  try {
    logApiCall(endpoint, "GET", { query });
    const response = await axios.get<{ results: Actor[] }>(
      `${endpoint}?api_key=${API_KEY}&query=${encodeURIComponent(query)}`,
      { signal }
    );
    logApiSuccess(endpoint, undefined, {
      query,
      resultCount: response.data.results.length,
    });
    return response.data.results;
  } catch (error) {
    if (axios.isCancel(error)) throw error;
    logApiError(endpoint, error as Error, { query });
    Sentry.captureException(error);
    throw error;
  }
};

/**
 * Fetches a combined list of movie and actor suggestions for autocomplete.
 * @param query - The partial search query
 * @returns A list of suggested movies and actors that match the query
 */
const fetchSuggestions = async (query: string): Promise<(Movie | Actor)[]> => {
  const movieResults = await fetchMovies(query);
  const actorResults = await fetchActors(query);
  return [...movieResults, ...actorResults];
};

/**
 * Fetches detailed information for a specific movie by ID.
 * @param movieId - The unique ID of the movie
 * @returns The detailed movie information or null if not found
 */
const fetchMovieById = async (
  movieId: number,
  signal?: AbortSignal
): Promise<Movie | null> => {
  const endpoint = `${API_BASE_URL}/movie/${movieId}`;

  try {
    logApiCall(endpoint, "GET", { movieId });
    const response = await axios.get<Movie>(
      `${endpoint}?api_key=${API_KEY}`,
      { signal }
    );
    logApiSuccess(endpoint, undefined, { movieId });
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) throw error;
    logApiError(endpoint, error as Error, { movieId });
    Sentry.captureException(error);
    throw error;
  }
};

/**
 * Fetches the detailed cast list for a specific movie, including each actor's birthday, deathday, and age calculations.
 * @param movieId - The unique ID of the movie
 * @param releaseDate - The release date of the movie in "YYYY-MM-DD" format
 * @returns A list of cast members with detailed information
 */
/**
 * Processes items in batches with a concurrency limit.
 * Instead of firing all requests at once, runs them in chunks.
 */
async function fetchInBatches<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  batchSize: number
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
  }
  return results;
}

// Max actors to enrich with detail calls (rest get basic info only)
const MAX_CAST_TO_ENRICH = 30;
// How many actor-detail requests to run concurrently
const ACTOR_FETCH_BATCH_SIZE = 10;

const fetchMovieCast = async (
  movieId: number,
  releaseDate: string,
  signal?: AbortSignal
): Promise<Actor[]> => {
  const endpoint = `${API_BASE_URL}/movie/${movieId}/credits`;

  try {
    logApiCall(endpoint, "GET", { movieId });
    const response = await axios.get<{ cast: Cast[] }>(
      `${endpoint}?api_key=${API_KEY}`,
      { signal }
    );

    const formattedReleaseDate = releaseDate
      ? new Date(releaseDate).toISOString().slice(0, 10)
      : null;

    const todayStr = new Date().toISOString().slice(0, 10);
    const allCast = response.data.cast;
    const castCount = allCast.length;

    // Split cast: enrich top-billed actors, pass through the rest with basic info
    const toEnrich = allCast.slice(0, MAX_CAST_TO_ENRICH);
    const remaining = allCast.slice(MAX_CAST_TO_ENRICH);

    const enrichActor = async (actor: Cast) => {
      try {
        const actorDetails = await fetchActorDetails(actor.id);

        const formattedBirthday = actorDetails.birthday
          ? new Date(actorDetails.birthday).toISOString().slice(0, 10)
          : null;
        const formattedDeathday = actorDetails.deathday
          ? new Date(actorDetails.deathday).toISOString().slice(0, 10)
          : null;

        const ageAtRelease =
          formattedBirthday && formattedReleaseDate
            ? calculateAgeAtDate(formattedBirthday, formattedReleaseDate)
            : null;
        const currentAge =
          formattedBirthday && !formattedDeathday
            ? calculateAgeAtDate(formattedBirthday, todayStr)
            : null;
        const ageAtDeath =
          formattedBirthday && formattedDeathday
            ? calculateAgeAtDate(formattedBirthday, formattedDeathday)
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
      } catch {
        return {
          ...actor,
          birthday: null,
          deathday: null,
          profile_path: actor.profile_path,
          ageAtRelease: null,
          currentAge: null,
          ageAtDeath: null,
        };
      }
    };

    // Fetch actor details in controlled batches instead of all at once
    const enrichedCast = await fetchInBatches(
      toEnrich,
      enrichActor,
      ACTOR_FETCH_BATCH_SIZE
    );

    // Remaining cast gets basic info without extra API calls
    const basicCast = remaining.map((actor) => ({
      ...actor,
      birthday: null,
      deathday: null,
      profile_path: actor.profile_path,
      ageAtRelease: null,
      currentAge: null,
      ageAtDeath: null,
    }));

    logApiSuccess(endpoint, undefined, { movieId, castCount });
    return [...enrichedCast, ...basicCast];
  } catch (error) {
    if (axios.isCancel(error)) throw error;
    logApiError(endpoint, error as Error, { movieId });
    Sentry.captureException(error);
    throw error;
  }
};

/**
 * Fetches an actor's filmography, calculating the actor's age at each movie release.
 * @param actorId - The unique ID of the actor
 * @returns A list of movies with age calculations for the actor at the time of each movie's release
 */
const fetchActorFilmography = async (
  actorId: number,
  signal?: AbortSignal
): Promise<Movie[]> => {
  const endpoint = `${API_BASE_URL}/person/${actorId}/movie_credits`;

  try {
    logApiCall(endpoint, "GET", { actorId });
    const actorDetails = await fetchActorDetails(actorId);
    const response = await axios.get<{ cast: Movie[] }>(
      `${endpoint}?api_key=${API_KEY}`,
      { signal }
    );

    const filmographyCount = response.data.cast.length;

    const filmographyWithAges = response.data.cast.map((movie, index) => {
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

    logApiSuccess(endpoint, undefined, { actorId, filmographyCount });
    return filmographyWithAges;
  } catch (error) {
    if (axios.isCancel(error)) throw error;
    logApiError(endpoint, error as Error, { actorId });
    Sentry.captureException(error);
    throw error;
  }
};

/**
 * Fetches a movie by its title and optionally year (for slug-based URLs)
 * @param title - The movie title
 * @param year - Optional release year for disambiguation
 * @returns The movie information or null if not found
 */
const fetchMovieByTitle = async (
  title: string,
  year?: number,
  signal?: AbortSignal
): Promise<Movie | null> => {
  try {
    const movies = await fetchMovies(title, signal);

    let exactMatch: Movie | undefined;

    if (year) {
      // If year is provided, find exact match by title and year
      exactMatch = movies.find(
        (movie) =>
          movie.title.toLowerCase() === title.toLowerCase() &&
          new Date(movie.release_date).getFullYear() === year
      );
    } else {
      // If no year, find exact match by title only
      exactMatch = movies.find(
        (movie) => movie.title.toLowerCase() === title.toLowerCase()
      );
    }

    if (exactMatch) {
      return exactMatch;
    }

    // If no exact match, return the first result
    return movies.length > 0 ? movies[0] : null;
  } catch (error) {
    if (axios.isCancel(error)) throw error;
    Sentry.captureException(error);
    throw error;
  }
};

/**
 * Fetches an actor by their name (for slug-based URLs)
 * @param name - The actor name
 * @returns The actor information or null if not found
 */
const fetchActorByName = async (
  name: string,
  signal?: AbortSignal
): Promise<Actor | null> => {
  try {
    const actors = await fetchActors(name, signal);

    // Find exact match (case-insensitive)
    const exactMatch = actors.find(
      (actor) => actor.name.toLowerCase() === name.toLowerCase()
    );

    if (exactMatch) {
      return exactMatch;
    }

    // If no exact match, return the first result
    return actors.length > 0 ? actors[0] : null;
  } catch (error) {
    if (axios.isCancel(error)) throw error;
    Sentry.captureException(error);
    throw error;
  }
};

export {
  fetchActorDetails,
  fetchActorFilmography,
  fetchMovieById,
  fetchMovieByTitle,
  fetchActorByName,
  fetchSuggestions,
  fetchMovieCast,
  fetchMovies,
  fetchActors,
};
