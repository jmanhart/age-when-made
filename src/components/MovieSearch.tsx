import React, { useState } from "react";
import MovieList from "./MovieList";
import { fetchMovies } from "../utils/api";
import "./MovieSearch.module.css";
import { Movie } from "../types/types";

const MovieSearch: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const results = await fetchMovies(query);
    setMovies(results);
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
      <MovieList movies={movies} />
    </div>
  );
};

export default MovieSearch;
