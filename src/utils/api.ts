import axios from "axios";
import { Movie, Cast, Actor } from "../types/types";
import fetchActorDetails from "./fetchActorDetails";
import { calculateAgeAtDate } from "./calculateAge";
import * as Sentry from "@sentry/react";
import {
  addBreadcrumb,
  logApiCall,
  logApiSuccess,
  logApiError,
  logPerformance,
} from "./sentry";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

/**
 * Fetches a list of movies based on a search query.
 * @param query - The search query
 * @returns A list of movies that match the query
 */
const fetchMovies = async (query: string): Promise<Movie[]> => {
  const startTime = performance.now();
  const endpoint = `${API_BASE_URL}/search/movie`;

  try {
    const response = await axios.get<{ results: Movie[] }>(
      `${endpoint}?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
    );

    return response.data.results;
  } catch (error) {
    // Only log errors, not successful calls
    logApiError(endpoint, error as Error, {
      query,
    });
    Sentry.captureException(error);
    throw error;
  }
};

/**
 * Fetches a list of actors based on a search query.
 * @param query - The search query
 * @returns A list of actors that match the query
 */
const fetchActors = async (query: string): Promise<Actor[]> => {
  const startTime = performance.now();
  const endpoint = `${API_BASE_URL}/search/person`;

  try {
    const response = await axios.get<{ results: Actor[] }>(
      `${endpoint}?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
    );

    return response.data.results;
  } catch (error) {
    // Only log errors, not successful calls
    logApiError(endpoint, error as Error, {
      query,
    });
    console.error("Error fetching actors:", error);
    Sentry.captureException(error);
    return [];
  }
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
  const startTime = performance.now();
  const endpoint = `${API_BASE_URL}/movie/${movieId}`;

  try {
    const response = await axios.get<Movie>(`${endpoint}?api_key=${API_KEY}`);
    return response.data;
  } catch (error) {
    logApiError(endpoint, error as Error, {
      movieId,
    });
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
  const startTime = performance.now();
  const endpoint = `${API_BASE_URL}/movie/${movieId}/credits`;

  try {
    const response = await axios.get<{ cast: Cast[] }>(
      `${endpoint}?api_key=${API_KEY}`
    );

    const formattedReleaseDate = releaseDate
      ? new Date(releaseDate).toISOString().slice(0, 10)
      : null;

    const castCount = response.data.cast.length;

    // Enrich cast with actor details, including birthday and age calculations
    const castWithDetails = await Promise.all(
      response.data.cast.map(async (actor, index) => {
        const actorStartTime = performance.now();

        try {
          const actorDetails = await fetchActorDetails(actor.id);

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
        } catch (actorError) {
          // Return basic actor info without enriched details
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
      })
    );

    return castWithDetails;
  } catch (error) {
    logApiError(endpoint, error as Error, {
      movieId,
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
  const startTime = performance.now();
  const endpoint = `${API_BASE_URL}/person/${actorId}/movie_credits`;

  try {
    const actorDetails = await fetchActorDetails(actorId); // Fetch actor's birth details
    const response = await axios.get<{ cast: Movie[] }>(
      `${endpoint}?api_key=${API_KEY}`
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

    return filmographyWithAges;
  } catch (error) {
    logApiError(endpoint, error as Error, {
      actorId,
    });
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
