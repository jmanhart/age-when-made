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
  const response = await axios.get<{ cast: Cast[] }>(
    `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`
  );

  // Enrich cast with actor details, including birthday and age calculations
  const castWithDetails = await Promise.all(
    response.data.cast.map(async (actor) => {
      const actorDetails = await fetchActorDetails(actor.id); // Fetch individual details like birthday and deathday

      // Debugging log to verify actor details fetched correctly
      console.log("Actor Details:", {
        name: actor.name,
        birthday: actorDetails.birthday,
        deathday: actorDetails.deathday,
      });

      // Calculate ages based on birthday and movie release date
      const ageAtRelease = calculateAgeAtDate(
        actorDetails.birthday,
        releaseDate
      );
      const currentAge = actorDetails.deathday
        ? null
        : calculateAgeAtDate(
            actorDetails.birthday,
            new Date().toISOString().slice(0, 10)
          );
      const ageAtDeath = actorDetails.deathday
        ? calculateAgeAtDate(actorDetails.birthday, actorDetails.deathday)
        : null;

      return {
        ...actor,
        birthday: actorDetails.birthday,
        deathday: actorDetails.deathday,
        ageAtRelease: ageAtRelease !== null ? ageAtRelease : "POOP",
        currentAge: currentAge !== null ? currentAge : "N/A",
        ageAtDeath: ageAtDeath !== null ? ageAtDeath : "N/A",
      };
    })
  );

  return castWithDetails;
};
