import React, { useState } from "react";
import CastList from "./CastList";
import { Movie, Cast } from "../types/types";
import { fetchMovieCast } from "../utils/api";
import "./MovieItem.module.css";

interface MovieItemProps {
  movie: Movie;
}

const MovieItem: React.FC<MovieItemProps> = ({ movie }) => {
  const [cast, setCast] = useState<Cast[]>([]);

  const handleViewCast = async () => {
    const releaseDate = movie.release_date; // Pull release date directly from movie data
    console.log("Calling fetchMovieCast with:", {
      movieId: movie.id,
      releaseDate,
    }); // Log to verify

    const castData = await fetchMovieCast(movie.id, releaseDate); // Pass releaseDate to fetchMovieCast
    setCast(castData);
  };

  return (
    <li>
      <h2>{movie.title}</h2>
      <p>Release Date: {movie.release_date}</p>
      <button onClick={handleViewCast}>View Cast</button>
      {cast.length > 0 && (
        <CastList cast={cast} releaseDate={movie.release_date} />
      )}
    </li>
  );
};

export default MovieItem;
