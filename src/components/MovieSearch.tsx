import React, { useState } from "react";
import MovieList from "./MovieList";
import { fetchMovies } from "../utils/api";
import styles from "./MovieSearch.module.css"; // Ensure this imports as a module
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
      <form onSubmit={handleSearch} className={styles.searchContainer}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a movie..."
          className={styles.searchInput} // Apply searchInput style
        />
        <button type="submit" className={styles.searchButton}>
          Search
        </button>
      </form>
      <MovieList movies={movies} />
    </div>
  );
};

export default MovieSearch;
