import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MovieList from "./MovieList";
import { fetchMovies, fetchSuggestions } from "../utils/api";
import styles from "./MovieSearch.module.css";
import { Movie } from "../types/types";

const MovieSearch: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] =
    useState<number>(-1);
  const navigate = useNavigate();

  // Fetch autocomplete suggestions as user types
  useEffect(() => {
    const fetchAutocomplete = async () => {
      if (query.trim().length > 1) {
        const results = await fetchSuggestions(query);
        setSuggestions(results);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    };
    fetchAutocomplete();
  }, [query]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const results = await fetchMovies(query);
    setMovies(results);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (movie: Movie) => {
    setQuery(movie.title);
    setShowSuggestions(false);
    navigate(`/movie/${movie.id}`); // Navigate to the movie page directly
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      setActiveSuggestionIndex((prevIndex) =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      setActiveSuggestionIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter" && activeSuggestionIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[activeSuggestionIndex]);
    }
  };

  return (
    <div className={styles.movieSearchContainer}>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a movie..."
          className={styles.searchInput}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length > 1 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
        />
        <button type="submit" className={styles.searchButton}>
          Search
        </button>
      </form>

      {showSuggestions && (
        <ul className={styles.suggestionsList}>
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`${styles.suggestionItem} ${
                index === activeSuggestionIndex ? styles.activeSuggestion : ""
              }`}
            >
              <img
                src={`https://image.tmdb.org/t/p/w92${suggestion.poster_path}`}
                alt={suggestion.title}
                className={styles.posterImage}
              />
              <div className={styles.movieInfo}>
                <h4 className={styles.movieTitle}>{suggestion.title}</h4>
                <p className={styles.movieReleaseYear}>
                  {suggestion.release_date
                    ? new Date(suggestion.release_date).getFullYear()
                    : "N/A"}
                </p>
                <p className={styles.movieOverview}>
                  {suggestion.overview
                    ? `${suggestion.overview.substring(0, 60)}...`
                    : "No description available"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <MovieList movies={movies} />
    </div>
  );
};

export default MovieSearch;
