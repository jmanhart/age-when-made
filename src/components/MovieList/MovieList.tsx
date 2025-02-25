import React from "react";
import MovieItem from "../MovieItem/MovieItem";
import styles from "./MovieList.module.css";
import { Movie } from "../../types/types";

interface MovieListProps {
  movies: Movie[];
}

const MovieList: React.FC<MovieListProps> = ({ movies }) => {
  return (
    <div className={styles.movieListContainer}>
      {movies.map((movie) => (
        <MovieItem key={movie.id} movie={movie} />
      ))}
    </div>
  );
};

export default MovieList;
