import axios from "axios";
import { Movie, Cast, Actor } from "../types/types";
import fetchActorDetails from "./fetchActorDetails";
import { calculateAgeAtDate } from "./calculateAge";

const apiKey = import.meta.env.VITE_TMDB_API_KEY;

/**
 * Fetches a list of movies based on a search query.
 * @param query - The search query
 * @returns A list of movies that match the query
 */
export const fetchMovies = async (query: string): Promise<Movie[]> => {
  const response = await axios.get(
    `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`
  );
  return response.data.results;
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
  console.log("fetchMovieCast called with:", { movieId, releaseDate }); // Log to check releaseDate

  const response = await axios.get<{ cast: Cast[] }>(
    `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`
  );

  // Fallback if releaseDate is empty or invalid
  const formattedReleaseDate = releaseDate
    ? new Date(releaseDate).toISOString().slice(0, 10)
    : "1970-01-01";

  // Enrich cast with actor details, including birthday and age calculations
  const castWithDetails = await Promise.all(
    response.data.cast.map(async (actor) => {
      const actorDetails = await fetchActorDetails(actor.id); // Fetch individual details like birthday and deathday

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

      // Calculate ages based on birthday and movie release date with fallback release date
      const ageAtRelease = calculateAgeAtDate(
        formattedBirthday,
        formattedReleaseDate
      );
      const currentAge = formattedDeathday
        ? null
        : calculateAgeAtDate(
            formattedBirthday,
            new Date().toISOString().slice(0, 10)
          );
      const ageAtDeath = formattedDeathday
        ? calculateAgeAtDate(formattedBirthday, formattedDeathday)
        : null;

      return {
        ...actor,
        birthday: formattedBirthday,
        deathday: formattedDeathday,
        ageAtRelease: ageAtRelease !== null ? ageAtRelease : "N/A",
        currentAge: currentAge !== null ? currentAge : "N/A",
        ageAtDeath: ageAtDeath !== null ? ageAtDeath : "N/A",
      };
    })
  );

  return castWithDetails;
};
