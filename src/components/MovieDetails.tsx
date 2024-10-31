import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchMovieById, fetchMovieCast } from "../utils/api";
import calculateMovieAge from "../utils/calculateMovieAge";
import { Movie, Actor } from "../types/types";
import styles from "./MovieDetails.module.css";

const MovieDetails: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [cast, setCast] = useState<Actor[]>([]);
  const [statusFilter, setStatusFilter] = useState("All"); // Filter for Alive/Deceased
  const [sortOrder, setSortOrder] = useState("none"); // State for sort order
  const navigate = useNavigate();

  useEffect(() => {
    const getMovieDetails = async () => {
      if (movieId) {
        const movieData = await fetchMovieById(Number(movieId));
        setMovie(movieData);

        if (movieData?.release_date) {
          const castData = await fetchMovieCast(
            Number(movieId),
            movieData.release_date
          );
          setCast(castData);
        }
      }
    };
    getMovieDetails();
  }, [movieId]);

  if (!movie) return <p>Loading...</p>;

  // Filter and sort the cast list based on the selected filters and sort order
  const filteredCast = cast
    .filter((actor) => {
      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Deceased" && actor.deathday) ||
        (statusFilter === "Alive" && !actor.deathday);

      return matchesStatus;
    })
    .sort((a, b) => {
      if (sortOrder === "oldest") {
        return (b.currentAge || 0) - (a.currentAge || 0); // Sort by oldest
      } else if (sortOrder === "youngest") {
        return (a.currentAge || 0) - (b.currentAge || 0); // Sort by youngest
      }
      return 0; // No sorting
    });

  return (
    <div className={styles.detailsWrapper}>
      <button onClick={() => navigate(-1)}>Back</button>
      <h1>{movie.title}</h1>
      <p>Release Date: {movie.release_date}</p>
      <p>Movie Age: {calculateMovieAge(movie.release_date)} years</p>
      <p>{movie.overview}</p>

      <h2>Cast</h2>

      {/* Filter and Sort Container */}
      <div className={styles.filterSortContainer}>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={styles.statusFilter}
        >
          <option value="All">All</option>
          <option value="Alive">Alive</option>
          <option value="Deceased">Deceased</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className={styles.sortOrder}
        >
          <option value="none">No Sort</option>
          <option value="oldest">Oldest</option>
          <option value="youngest">Youngest</option>
        </select>
      </div>

      <ul className={styles.castList}>
        {filteredCast.map((actor) => (
          <li key={actor.id} className={styles.castItem}>
            <img
              src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
              alt={`${actor.name}'s profile`}
              className={`${styles.actorImage} ${
                actor.deathday ? styles.Deceased : ""
              }`}
            />
            <strong>{actor.name}</strong> as {actor.character}
            <p>Birthday: {actor.birthday || "No Data Available"}</p>
            {/* Conditionally render age details */}
            {actor.deathday ? (
              <>
                <p>
                  Deceased: {actor.deathday} (Age at Death: {actor.ageAtDeath})
                </p>
                <p>
                  Age at Release: {actor.ageAtRelease ?? "No Data Available"}
                </p>
              </>
            ) : (
              <>
                <p>Current Age: {actor.currentAge ?? "No Data Available"}</p>
                <p>
                  Age at Release: {actor.ageAtRelease ?? "No Data Available"}
                </p>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MovieDetails;
