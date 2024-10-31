import axios from "axios";
import { Movie, Cast, Actor } from "../types/types";
import fetchActorDetails from "./fetchActorDetails";
import { calculateAgeAtDate } from "./calculateAge";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

/**
 * Fetches a list of movies based on a search query.
 * @param query - The search query
 * @returns A list of movies that match the query
 */
export const fetchMovies = async (query: string): Promise<Movie[]> => {
  try {
    const response = await axios.get<{ results: Movie[] }>(
      `${API_BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}`
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
};

/**
 * Fetches detailed information for a specific movie by ID.
 * @param movieId - The unique ID of the movie
 * @returns The detailed movie information or null if not found
 */
export const fetchMovieById = async (
  movieId: number
): Promise<Movie | null> => {
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
export const fetchMovieCast = async (
  movieId: number,
  releaseDate: string
): Promise<Actor[]> => {
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
            ? calculateAgeAtDate(formattedBirthday, formattedDeathday)
            : null;

        return {
          ...actor,
          birthday: formattedBirthday,
          deathday: formattedDeathday,
          profile_path: actor.profile_path,
          ageAtRelease: ageAtRelease !== null ? ageAtRelease : "N/A",
          currentAge: currentAge !== null ? currentAge : "N/A",
          ageAtDeath: ageAtDeath !== null ? ageAtDeath : "N/A",
        };
      })
    );

    return castWithDetails;
  } catch (error) {
    console.error("Error fetching cast details:", error);
    return [];
  }
};
