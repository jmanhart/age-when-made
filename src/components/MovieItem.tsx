import React, { useState } from "react";
import CastList from "./CastList";
import { Movie, Cast } from "../types/types";
import { fetchMovieCast } from "../utils/api";

interface MovieItemProps {
  movie: Movie;
}

const MovieItem: React.FC<MovieItemProps> = ({ movie }) => {
  const [cast, setCast] = useState<Cast[]>([]);

  const handleViewCast = async () => {
    const castData = await fetchMovieCast(movie.id);
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
