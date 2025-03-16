import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MovieList from "../MovieList/MovieList";
import { fetchMovies, fetchActors } from "../../utils/api";
import styles from "./MovieSearch.module.css";
import { Movie, Actor } from "../../types/types";
import SearchIcon from "../../assets/icons/searchIcon";
import { withErrorBoundary } from "../ErrorBoundary.tsx";
import { addBreadcrumb } from "../../utils/sentry";

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
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [preventReopen, setPreventReopen] = useState<boolean>(false);
  const navigate = useNavigate();

  // Add ref for the suggestions list
  const suggestionsRef = useRef<HTMLUListElement>(null);
  const selectedItemRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const fetchAutocomplete = async () => {
      if (query.trim().length > 1 && !preventReopen) {
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
  }, [query, preventReopen]);

  // Add this useEffect to handle scrolling
  useEffect(() => {
    if (
      selectedIndex >= 0 &&
      suggestionsRef.current &&
      selectedItemRef.current
    ) {
      const container = suggestionsRef.current;
      const selectedItem = selectedItemRef.current;

      const containerHeight = container.clientHeight;
      const itemHeight = selectedItem.clientHeight;
      const itemTop = itemHeight * selectedIndex;
      const scrollTop = container.scrollTop;

      // Scroll down if item is below visible area
      if (itemTop + itemHeight > scrollTop + containerHeight) {
        container.scrollTop = itemTop + itemHeight - containerHeight;
      }
      // Scroll up if item is above visible area
      else if (itemTop < scrollTop) {
        container.scrollTop = itemTop;
      }
    }
  }, [selectedIndex]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    addBreadcrumb("search", "User initiated search", "info", {
      query,
      isHeaderSearch,
    });

    const movieResults = await fetchMovies(query);
    setMovies(movieResults);
    setShowSuggestions(false);
    setPreventReopen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      addBreadcrumb("navigation", "User pressed arrow down", "info", {
        selectedIndex: selectedIndex + 1,
      });
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault(); // Prevent cursor from moving
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      addBreadcrumb("selection", "User pressed enter", "info", {
        selectedIndex,
        hasSelection: selectedIndex >= 0 && !!suggestions[selectedIndex],
      });
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSuggestionClick(suggestions[selectedIndex]);
      } else {
        handleSearch();
      }
      setShowSuggestions(false);
      setSelectedIndex(-1);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedIndex(-1); // Reset selection when input changes
    setPreventReopen(false); // Reset preventReopen only when input changes
  };

  const handleSuggestionClick = (item: Suggestion) => {
    addBreadcrumb("selection", "User clicked suggestion", "info", {
      itemType: item.type,
      itemId: item.id,
      itemTitle: item.type === "movie" ? item.title : item.name,
    });

    setQuery(item.type === "movie" ? item.title : item.name);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    setPreventReopen(true);
    if (item.type === "movie") {
      navigate(`/movie/${item.id}`);
    } else {
      navigate(`/actor/${item.id}`);
    }
  };

  return (
    <div
      className={`${styles.movieSearchContainer} ${
        isHeaderSearch ? styles.headerSearchContainer : ""
      }`}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
          setShowSuggestions(false);
          setSelectedIndex(-1);
          setPreventReopen(true);
        }}
        className={styles.searchForm}
      >
        <div className={styles.inputWrapper}>
          <SearchIcon className={styles.searchIcon} />
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={
              isHeaderSearch
                ? "Search for a movie or actor..."
                : "Search for a movie or actor..."
            }
            className={`${styles.searchInput} ${
              isHeaderSearch ? styles.headerSearchInput : ""
            }`}
            onFocus={() => {
              if (!preventReopen && query.length > 1) {
                setShowSuggestions(true);
              }
            }}
            onBlur={() =>
              setTimeout(() => {
                setShowSuggestions(false);
                setSelectedIndex(-1);
              }, 100)
            }
          />
        </div>
      </form>

      {showSuggestions && (
        <ul ref={suggestionsRef} className={styles.suggestionsList}>
          {suggestions.map((item, index) => (
            <li
              key={`${item.type}-${item.id}`}
              ref={index === selectedIndex ? selectedItemRef : null}
              onClick={() => handleSuggestionClick(item)}
              className={`${styles.suggestionItem} ${
                index === selectedIndex ? styles.activeSuggestion : ""
              }`}
              onMouseEnter={() => setSelectedIndex(index)}
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

export default withErrorBoundary(MovieSearch, "MovieSearch");
