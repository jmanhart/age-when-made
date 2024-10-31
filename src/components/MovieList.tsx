import React from "react";
import MovieItem from "./MovieItem";
import { Movie } from "../types/types";

interface MovieListProps {
  movies: Movie[];
}

const MovieList: React.FC<MovieListProps> = ({ movies }) => (
  <ul>
    {movies.map((movie) => (
      <MovieItem key={movie.id} movie={movie} />
    ))}
  </ul>
);

export default MovieList;
