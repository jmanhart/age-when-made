import React from "react";
import { Link } from "react-router-dom";
import { Movie } from "../types/types";
import "./MovieItem.module.css";

interface MovieItemProps {
  movie: Movie;
}

const MovieItem: React.FC<MovieItemProps> = ({ movie }) => {
  return (
    <li className="movie-item">
      <Link to={`/movie/${movie.id}`} className="movie-link">
        <h2>{movie.title}</h2>
        <p>Release Date: {movie.release_date}</p>
      </Link>
    </li>
  );
};

export default MovieItem;
