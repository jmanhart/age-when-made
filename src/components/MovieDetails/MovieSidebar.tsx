import React from "react";
import { Movie } from "../../types/types";
import StatusTag from "../StatusTag/StatusTag";
import { DateWithTooltip } from "../DateWithTooltip";
import styles from "./MovieDetails.module.css";

interface MovieSidebarProps {
  movie: Movie;
  actorsAlive: number;
  actorsDeceased: number;
}

const MovieSidebar: React.FC<MovieSidebarProps> = ({
  movie,
  actorsAlive,
  actorsDeceased,
}) => {
  // Calculate the movie's age
  const calculateMovieAge = (releaseDate: string) => {
    const releaseYear = new Date(releaseDate).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - releaseYear;
  };

  return (
    <aside className={styles.movieSidebar}>
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={`${movie.title} poster`}
        className={styles.moviePoster}
      />

      <div className={styles.movieInfo}>
        <h1 className={styles.movieTitle}>{movie.title}</h1>

        <p className={styles.movieReleaseDate}>
          <DateWithTooltip
            date={movie.release_date}
            displayFormat="year"
            tooltipPrefix="Released on"
          />
          {calculateMovieAge(movie.release_date) > 0 && (
            <span className={styles.movieAge}>
              {" • "}
              {calculateMovieAge(movie.release_date)} years old
            </span>
          )}
        </p>

        <div className={styles.mortalityTags}>
          {actorsAlive > 0 && (
            <StatusTag
              deceasedCount={0}
              totalCount={actorsAlive}
              variant="living"
            />
          )}
          {actorsDeceased > 0 && (
            <StatusTag
              deceasedCount={actorsDeceased}
              totalCount={actorsDeceased}
              variant="deceased"
            />
          )}
        </div>
      </div>
    </aside>
  );
};

export default MovieSidebar;

