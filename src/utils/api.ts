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
    logApiCall(endpoint, "GET", { query });
    addBreadcrumb("api", "Fetching movies", "info", { query });

    const response = await axios.get<{ results: Movie[] }>(
      `${endpoint}?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
    );

    const responseTime = performance.now() - startTime;
    const resultCount = response.data.results.length;

    logApiSuccess(endpoint, responseTime, {
      query,
      resultCount,
      hasResults: resultCount > 0,
    });

    addBreadcrumb("api", "Movies fetched successfully", "info", {
      query,
      resultCount,
    });

    return response.data.results;
  } catch (error) {
    const responseTime = performance.now() - startTime;
    logApiError(endpoint, error as Error, {
      query,
      responseTime,
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
    logApiCall(endpoint, "GET", { query });

    const response = await axios.get<{ results: Actor[] }>(
      `${endpoint}?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
    );

    const responseTime = performance.now() - startTime;
    const resultCount = response.data.results.length;

    logApiSuccess(endpoint, responseTime, {
      query,
      resultCount,
      hasResults: resultCount > 0,
    });

    return response.data.results;
  } catch (error) {
    const responseTime = performance.now() - startTime;
    logApiError(endpoint, error as Error, {
      query,
      responseTime,
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
    logApiCall(endpoint, "GET", { movieId });

    const response = await axios.get<Movie>(`${endpoint}?api_key=${API_KEY}`);

    const responseTime = performance.now() - startTime;

    logApiSuccess(endpoint, responseTime, {
      movieId,
      movieTitle: response.data.title,
      releaseDate: response.data.release_date,
    });

    return response.data;
  } catch (error) {
    const responseTime = performance.now() - startTime;
    logApiError(endpoint, error as Error, {
      movieId,
      responseTime,
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

  logApiCall(endpoint, "GET", { movieId, releaseDate });
  addBreadcrumb("api", "Fetching movie cast", "info", { movieId, releaseDate });

  console.log("fetchMovieCast called with:", { movieId, releaseDate });

  try {
    const response = await axios.get<{ cast: Cast[] }>(
      `${endpoint}?api_key=${API_KEY}`
    );

    const formattedReleaseDate = releaseDate
      ? new Date(releaseDate).toISOString().slice(0, 10)
      : null;

    const castCount = response.data.cast.length;
    Sentry.logger.info(
      Sentry.logger
        .fmt`Processing ${castCount} cast members for movie ${movieId}`,
      {
        movieId,
        castCount,
        releaseDate: formattedReleaseDate,
      }
    );

    // Enrich cast with actor details, including birthday and age calculations
    const castWithDetails = await Promise.all(
      response.data.cast.map(async (actor, index) => {
        const actorStartTime = performance.now();

        try {
          const actorDetails = await fetchActorDetails(actor.id);

          Sentry.logger.debug(
            Sentry.logger.fmt`Processing actor ${index + 1}/${castCount}: ${
              actor.name
            }`,
            {
              actorId: actor.id,
              actorName: actor.name,
              hasBirthday: !!actorDetails.birthday,
              hasDeathday: !!actorDetails.deathday,
            }
          );

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

          const actorProcessingTime = performance.now() - actorStartTime;

          Sentry.logger.trace(
            Sentry.logger
              .fmt`Actor ${actor.name} processed in ${actorProcessingTime}ms`,
            {
              actorId: actor.id,
              actorName: actor.name,
              processingTime: actorProcessingTime,
              ageAtRelease,
              currentAge,
              ageAtDeath,
            }
          );

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
          Sentry.logger.warn(
            Sentry.logger.fmt`Failed to process actor ${actor.name}: ${
              (actorError as Error).message
            }`,
            {
              actorId: actor.id,
              actorName: actor.name,
              error: (actorError as Error).message,
            }
          );

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

    const totalTime = performance.now() - startTime;

    logApiSuccess(endpoint, totalTime, {
      movieId,
      castCount,
      processedCount: castWithDetails.length,
      releaseDate: formattedReleaseDate,
    });

    addBreadcrumb("api", "Cast fetched successfully", "info", {
      movieId,
      castCount: response.data.cast.length,
    });

    return castWithDetails;
  } catch (error) {
    const totalTime = performance.now() - startTime;
    logApiError(endpoint, error as Error, {
      movieId,
      releaseDate,
      responseTime: totalTime,
    });

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
  const startTime = performance.now();
  const endpoint = `${API_BASE_URL}/person/${actorId}/movie_credits`;

  try {
    logApiCall(endpoint, "GET", { actorId });

    const actorDetails = await fetchActorDetails(actorId); // Fetch actor's birth details
    const response = await axios.get<{ cast: Movie[] }>(
      `${endpoint}?api_key=${API_KEY}`
    );

    const filmographyCount = response.data.cast.length;

    Sentry.logger.info(
      Sentry.logger
        .fmt`Processing ${filmographyCount} movies for actor ${actorId}`,
      {
        actorId,
        actorName: actorDetails.name,
        filmographyCount,
        hasBirthday: !!actorDetails.birthday,
      }
    );

    const filmographyWithAges = response.data.cast.map((movie, index) => {
      const formattedReleaseDate = movie.release_date
        ? new Date(movie.release_date).toISOString().slice(0, 10)
        : null;
      const ageAtRelease =
        actorDetails.birthday && formattedReleaseDate
          ? calculateAgeAtDate(actorDetails.birthday, formattedReleaseDate)
          : null;

      // Log every 10th movie to avoid spam but still track progress
      if (index % 10 === 0) {
        Sentry.logger.debug(
          Sentry.logger.fmt`Processing movie ${
            index + 1
          }/${filmographyCount}: ${movie.title}`,
          {
            movieId: movie.id,
            movieTitle: movie.title,
            releaseDate: formattedReleaseDate,
            ageAtRelease,
          }
        );
      }

      return {
        ...movie,
        ageAtRelease, // Actor's age during this movie's release
      };
    });

    const totalTime = performance.now() - startTime;

    logApiSuccess(endpoint, totalTime, {
      actorId,
      actorName: actorDetails.name,
      filmographyCount,
      processedCount: filmographyWithAges.length,
    });

    return filmographyWithAges;
  } catch (error) {
    const totalTime = performance.now() - startTime;
    logApiError(endpoint, error as Error, {
      actorId,
      responseTime: totalTime,
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
