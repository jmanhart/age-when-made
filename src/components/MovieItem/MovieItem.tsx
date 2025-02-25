import React from "react";
import { useNavigate } from "react-router-dom";
import { Movie } from "../../types/types";

interface MovieItemProps {
  movie: Movie;
}

const MovieItem: React.FC<MovieItemProps> = ({ movie }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className={styles.movieItem} onClick={handleClick}>
      <img
        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
        alt={`${movie.title} poster`}
        className={styles.moviePoster}
      />
      <h3 className={styles.movieTitle}>{movie.title}</h3>
      <p className={styles.movieReleaseDate}>
        Release Date: {movie.release_date || "N/A"}
      </p>
    </div>
  );
};

export default MovieItem;
