import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MovieList from "./MovieList";
import { fetchMovies, fetchActors } from "../utils/api";
import styles from "./MovieSearch.module.css";
import { Movie, Actor } from "../types/types";
import SearchIcon from "../assets/icons/searchIcon";

// Define a combined type for suggestions that includes both Movie and Actor properties
interface MovieSuggestion extends Movie {
  type: "movie";
}

interface ActorSuggestion extends Actor {
  type: "actor";
}

type Suggestion = MovieSuggestion | ActorSuggestion;

interface MovieSearchProps {
  isHeaderSearch?: boolean; // Optional prop to distinguish header usage
}

const MovieSearch: React.FC<MovieSearchProps> = ({
  isHeaderSearch = false,
}) => {
  const [query, setQuery] = useState<string>("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [activeSuggestionIndex] = useState<number>(-1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAutocomplete = async () => {
      if (query.trim().length > 1) {
        const movieResults: Movie[] = await fetchMovies(query);
        const actorResults: Actor[] = await fetchActors(query);

        // Add a type field to distinguish between movies and actors
        const movieSuggestions: MovieSuggestion[] = movieResults.map(
          (item) => ({
            ...item,
            type: "movie",
          })
        );

        const actorSuggestions: ActorSuggestion[] = actorResults.map(
          (item) => ({
            ...item,
            type: "actor",
          })
        );

        const combinedSuggestions: Suggestion[] = [
          ...movieSuggestions,
          ...actorSuggestions,
        ];

        // Remove duplicates based on `id` and `type`
        const uniqueSuggestions = combinedSuggestions.filter(
          (item, index, self) =>
            index ===
            self.findIndex((t) => t.id === item.id && t.type === item.type)
        );

        setSuggestions(uniqueSuggestions);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    };
    fetchAutocomplete();
  }, [query]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const movieResults = await fetchMovies(query);
    setMovies(movieResults);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (item: Suggestion) => {
    setQuery(item.type === "movie" ? item.title : item.name);
    setShowSuggestions(false);
    if (item.type === "movie") {
      navigate(`/movie/${item.id}`); // Navigate to the movie details
    } else {
      navigate(`/actor/${item.id}`); // Navigate to the actor's filmography
    }
  };

  return (
    <div
      className={`${styles.movieSearchContainer} ${
        isHeaderSearch ? styles.headerSearchContainer : ""
      }`}
    >
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <div className={styles.inputWrapper}>
          <SearchIcon className={styles.searchIcon} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isHeaderSearch
                ? "Search movies or actors..."
                : "Search for a movie or actor..."
            }
            className={`${styles.searchInput} ${
              isHeaderSearch ? styles.headerSearchInput : ""
            }`}
            onKeyDown={(e) => {
              if (e.key === "Enter" && activeSuggestionIndex >= 0) {
                e.preventDefault();
                handleSuggestionClick(suggestions[activeSuggestionIndex]);
              }
            }}
            onFocus={() => query.length > 1 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
          />
        </div>
      </form>

      {showSuggestions && (
        <ul className={styles.suggestionsList}>
          {suggestions.map((item, index) => (
            <li
              key={`${item.type}-${item.id}`} // Use a unique key with type prefix
              onClick={() => handleSuggestionClick(item)}
              className={`${styles.suggestionItem} ${
                index === activeSuggestionIndex ? styles.activeSuggestion : ""
              }`}
            >
              {item.type === "movie" ? (
                <>
                  <img
                    src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                    alt={item.title}
                    className={styles.posterImage}
                  />
                  <div className={styles.movieInfo}>
                    <h4 className={styles.movieTitle}>{item.title}</h4>
                    <p className={styles.movieReleaseYear}>
                      {item.release_date
                        ? new Date(item.release_date).getFullYear()
                        : "N/A"}
                    </p>
                  </div>
                </>
              ) : (
                <div className={styles.actorInfo}>
                  <img
                    src={`https://image.tmdb.org/t/p/w92${item.profile_path}`}
                    alt={item.name}
                    className={styles.posterImage}
                  />
                  <h4 className={styles.actorName}>{item.name}</h4>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {!isHeaderSearch && <MovieList movies={movies} />}
    </div>
  );
};

export default MovieSearch;
