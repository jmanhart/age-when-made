import React, { useState } from "react";
import axios from "axios";
import { Movie, MovieResponse, Actor } from "./types/types";

const MovieSearch: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [cast, setCast] = useState<Actor[]>([]);

  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  // Function to search movies by title
  const searchMovies = async () => {
    try {
      const response = await axios.get<MovieResponse>(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`
      );
      setMovies(response.data.results);
      setSelectedMovieId(null); // Reset selected movie and cast when a new search is made
      setCast([]);
    } catch (error) {
      console.error("Error fetching movie data:", error);
    }
  };

  // Function to fetch cast of a specific movie
  const fetchCast = async (movieId: number, releaseDate: string) => {
    try {
      const response = await axios.get<{ cast: Cast[] }>(
        `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`
      );

      // Fetch birthdate and death details for each cast member and calculate ages
      const castWithDetails = await Promise.all(
        response.data.cast.map(async (actor) => {
          const actorDetails = await fetchActorDetails(actor.id);
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
            ageAtRelease,
            currentAge,
            ageAtDeath,
          };
        })
      );

      setCast(castWithDetails);
      setSelectedMovieId(movieId);
    } catch (error) {
      console.error("Error fetching cast data:", error);
    }
  };

  // Function to fetch individual actor details, including birthday and deathday
  const fetchActorDetails = async (
    actorId: number
  ): Promise<{ birthday: string | null; deathday: string | null }> => {
    try {
      const response = await axios.get<{
        birthday: string | null;
        deathday: string | null;
      }>(`https://api.themoviedb.org/3/person/${actorId}?api_key=${apiKey}`);
      return {
        birthday: response.data.birthday,
        deathday: response.data.deathday,
      };
    } catch (error) {
      console.error("Error fetching actor details:", error);
      return { birthday: null, deathday: null };
    }
  };

  // Helper function to calculate age at a given date
  const calculateAgeAtDate = (
    birthDate: string | null,
    targetDate: string
  ): number | null => {
    if (!birthDate) return null;

    const birth = new Date(birthDate);
    const target = new Date(targetDate);

    let age = target.getFullYear() - birth.getFullYear();
    if (
      target.getMonth() < birth.getMonth() ||
      (target.getMonth() === birth.getMonth() &&
        target.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchMovies();
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a movie..."
        />
        <button type="submit">Search</button>
      </form>

      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>
            <h2>{movie.title}</h2>
            <p>Release Date: {movie.release_date}</p>
            <button onClick={() => fetchCast(movie.id, movie.release_date)}>
              View Cast
            </button>

            {/* Show cast if this movie is selected */}
            {selectedMovieId === movie.id && (
              <ul>
                {cast.map((actor) => (
                  <li key={actor.id}>
                    <strong>{actor.name}</strong> as {actor.character}
                    <p>Birthday: {actor.birthday || "N/A"}</p>
                    {actor.deathday ? (
                      <p>
                        Deceased: {actor.deathday} (Age at Death:{" "}
                        {actor.ageAtDeath})
                      </p>
                    ) : (
                      <>
                        <p>
                          Current Age:{" "}
                          {actor.currentAge !== null ? actor.currentAge : "N/A"}
                        </p>
                        <p>
                          Age at Release:{" "}
                          {actor.ageAtRelease !== null
                            ? actor.ageAtRelease
                            : "N/A"}
                        </p>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div
  );
};

export default MovieSearch2;
