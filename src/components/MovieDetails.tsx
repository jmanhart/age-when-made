import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchMovieById, fetchMovieCast } from "../utils/api";
import { Movie, Actor } from "../types/types";
import styles from "./MovieDetails.module.css";

const MovieDetails: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [cast, setCast] = useState<Actor[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("none");
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

  if (!movie) return <p>Loading movie details...</p>;

  // Filter and sort the cast list
  const filteredCast = cast
    .filter((actor) => {
      return (
        statusFilter === "All" ||
        (statusFilter === "Deceased" && actor.deathday) ||
        (statusFilter === "Alive" && !actor.deathday)
      );
    })
    .sort((a, b) => {
      if (sortOrder === "oldest")
        return (b.currentAge || 0) - (a.currentAge || 0);
      if (sortOrder === "youngest")
        return (a.currentAge || 0) - (b.currentAge || 0);
      return 0;
    });

  return (
    <div className={styles.movieDetailsContainer}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        Back
      </button>

      {/* Movie Header */}
      <div className={styles.movieHeader}>
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={`${movie.title} poster`}
          className={styles.moviePoster}
        />
        <div className={styles.movieInfo}>
          <h1 className={styles.movieTitle}>{movie.title}</h1>
          <p className={styles.movieReleaseDate}>
            Release Date: {movie.release_date}
          </p>
          <p className={styles.movieOverview}>{movie.overview}</p>
        </div>
      </div>

      {/* Filter and Sort Controls */}
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

      {/* Cast List Grid */}
      <div className={styles.castGrid}>
        {filteredCast.map((actor) => (
          <Link
            to={`/actor/${actor.id}`}
            key={actor.id}
            className={styles.castItem}
          >
            <img
              src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
              alt={`${actor.name}'s profile`}
              className={styles.actorImage}
            />
            <div className={styles.actorDetails}>
              <h2 className={styles.actorName}>{actor.name}</h2>
              <h3 className={styles.characterName}>{actor.character}</h3>
              <div className={styles.metrics}>
                <div className={styles.metricRow}>
                  <span className={styles.metricLabel}>Birthday:</span>
                  <span className={styles.metricValue}>
                    {actor.birthday || "N/A"}
                  </span>
                </div>
                {actor.deathday ? (
                  <div className={styles.metricRow}>
                    <span className={styles.metricLabel}>Age at Death:</span>
                    <span className={styles.metricValue}>
                      {actor.ageAtDeath ?? "N/A"}
                    </span>
                  </div>
                ) : (
                  <div className={styles.metricRow}>
                    <span className={styles.metricLabel}>Current Age:</span>
                    <span className={styles.metricValue}>
                      {actor.currentAge ?? "N/A"}
                    </span>
                  </div>
                )}
                <div className={styles.metricRow}>
                  <span className={styles.metricLabel}>Age at Release:</span>
                  <span className={styles.metricValue}>
                    {actor.ageAtRelease ?? "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MovieDetails;
