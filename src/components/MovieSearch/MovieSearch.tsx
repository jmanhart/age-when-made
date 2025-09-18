import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MovieList from "../MovieList/MovieList";
import { fetchMovies, fetchActors } from "../../utils/api";
import styles from "./MovieSearch.module.css";
import { Movie, Actor } from "../../types/types";
import SearchIcon from "../../assets/icons/searchIcon";
import { withErrorBoundary } from "../ErrorBoundary.tsx";
import {
  addBreadcrumb,
  logUserAction,
  logSearchQuery,
  logNavigation,
  logComponentRender,
} from "../../utils/sentry";
import { trackSearchEvent, trackNavigationEvent } from "../../utils/posthog";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

// Extend Movie type to include a type discriminator for suggestions
interface MovieSuggestion extends Movie {
  type: "movie";
}

// Extend Actor type to include a type discriminator for suggestions
interface ActorSuggestion extends Actor {
  type: "actor";
}

// Union type that can represent either a movie or actor suggestion
type Suggestion = MovieSuggestion | ActorSuggestion;

// Props interface - allows the component to be used in different contexts
interface MovieSearchProps {
  isHeaderSearch?: boolean; // When true, renders as a compact header search
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const MovieSearch: React.FC<MovieSearchProps> = ({
  isHeaderSearch = false,
}) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [query, setQuery] = useState<string>(""); // Current search input value
  const [movies, setMovies] = useState<Movie[]>([]); // Search results for movies
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]); // Autocomplete suggestions
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false); // Controls suggestion visibility
  const [selectedIndex, setSelectedIndex] = useState<number>(-1); // Currently selected suggestion index (-1 = none)
  const [preventReopen, setPreventReopen] = useState<boolean>(false); // Prevents suggestions from reopening after navigation
  const [error, setError] = useState<string | null>(null); // Error message display

  const navigate = useNavigate(); // React Router hook for navigation

  // Log component render
  React.useEffect(() => {
    logComponentRender("MovieSearch", { isHeaderSearch });
  }, [isHeaderSearch]);

  // ============================================================================
  // REFS FOR DOM MANIPULATION
  // ============================================================================

  const suggestionsRef = useRef<HTMLUListElement>(null); // Reference to suggestions list container
  const selectedItemRef = useRef<HTMLLIElement>(null); // Reference to currently selected suggestion item

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Effect 1: Fetch autocomplete suggestions when query changes
  useEffect(() => {
    const fetchAutocomplete = async () => {
      // Only fetch if query has 2+ characters and we're not preventing reopening
      if (query.trim().length > 1 && !preventReopen) {
        setError(null);
        try {
          // Fetch both movies and actors simultaneously for better UX
          const movieResults: Movie[] = await fetchMovies(query);
          const actorResults: Actor[] = await fetchActors(query);

          // Transform movies to include type discriminator
          const movieSuggestions: MovieSuggestion[] = movieResults.map(
            (item) => ({
              ...item,
              type: "movie",
            })
          );

          // Transform actors to include type discriminator
          const actorSuggestions: ActorSuggestion[] = actorResults.map(
            (item) => ({
              ...item,
              type: "actor",
            })
          );

          // Combine both types of suggestions
          const combinedSuggestions: Suggestion[] = [
            ...movieSuggestions,
            ...actorSuggestions,
          ];

          // Remove duplicates based on unique combination of id and type
          // This prevents the same movie/actor from appearing twice
          const uniqueSuggestions = combinedSuggestions.filter(
            (item, index, self) =>
              index ===
              self.findIndex((t) => t.id === item.id && t.type === item.type)
          );

          setSuggestions(uniqueSuggestions);
          setShowSuggestions(true);

          // Show helpful message if no suggestions found
          if (uniqueSuggestions.length === 0) {
            setError("No suggestions found.");
          }
        } catch (error) {
          setError("An error occurred while fetching suggestions.");
          setShowSuggestions(false);
          console.error(error);
        }
      } else {
        // Hide suggestions if query is too short or reopening is prevented
        setShowSuggestions(false);
      }
    };

    fetchAutocomplete();
  }, [query, preventReopen]); // Re-run when query or preventReopen changes

  // Effect 2: Handle auto-scrolling for keyboard navigation
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

      // Auto-scroll down if selected item is below visible area
      if (itemTop + itemHeight > scrollTop + containerHeight) {
        container.scrollTop = itemTop + itemHeight - containerHeight;
      }
      // Auto-scroll up if selected item is above visible area
      else if (itemTop < scrollTop) {
        container.scrollTop = itemTop;
      }
    }
  }, [selectedIndex]); // Re-run when selectedIndex changes

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  // Handle form submission and search execution
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Log search action for analytics
    addBreadcrumb("search", "User initiated search", "info", {
      query,
      isHeaderSearch,
    });

    // Track search event with PostHog
    trackSearchEvent(query, 0, "movie"); // We'll update the count after fetching

    setError(null);
    setMovies([]); // Clear previous results

    try {
      const movieResults = await fetchMovies(query);
      setMovies(movieResults);

      // Log search results
      logSearchQuery(query, movieResults.length, "movie");

      // Update PostHog with actual results count
      trackSearchEvent(query, movieResults.length, "movie");

      if (movieResults.length === 0) {
        setError("No movies found.");
      }
    } catch (error) {
      setError(
        "An error occurred while fetching movies. Please try again later."
      );
      console.error(error);
    }

    // Hide suggestions and prevent them from reopening
    setShowSuggestions(false);
    setPreventReopen(true);
  };

  // Handle keyboard navigation and shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const handleArrowDown = () => {
      addBreadcrumb("navigation", "User pressed arrow down", "info", {
        selectedIndex: selectedIndex + 1,
      });
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    };

    const handleArrowUp = () => {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    };

    const handleEnter = () => {
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
    };

    const handleEscape = () => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    };

    // Clean switch statement
    switch (e.key) {
      case "ArrowDown":
        handleArrowDown();
        break;
      case "ArrowUp":
        handleArrowUp();
        break;
      case "Enter":
        handleEnter();
        break;
      case "Escape":
        handleEscape();
        break;
    }
  };

  // Handle input value changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedIndex(-1); // Reset selection when input changes
    setPreventReopen(false); // Allow suggestions to reopen when typing
  };

  // Handle clicking on a suggestion item
  const handleSuggestionClick = (item: Suggestion) => {
    const currentPage = window.location.pathname;
    const targetPage =
      item.type === "movie" ? `/movie/${item.id}` : `/actor/${item.id}`;
    const itemTitle = item.type === "movie" ? item.title : item.name;

    // Log selection for analytics
    addBreadcrumb("selection", "User clicked suggestion", "info", {
      itemType: item.type,
      itemId: item.id,
      itemTitle,
    });

    // Log navigation
    logNavigation(currentPage, targetPage, "suggestion_click");

    // Track suggestion click with PostHog
    trackSearchEvent(itemTitle, 1, item.type);

    // Update input with selected item's name/title
    setQuery(itemTitle);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    setPreventReopen(true); // Prevent suggestions from reopening

    // Track navigation event
    trackNavigationEvent(currentPage, targetPage);

    // Navigate to appropriate detail page
    if (item.type === "movie") {
      navigate(`/movie/${item.id}`);
    } else {
      navigate(`/actor/${item.id}`);
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div
      className={`${styles.movieSearchContainer} ${
        isHeaderSearch ? styles.headerSearchContainer : ""
      }`}
    >
      {/* Search Form */}
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
              // Show suggestions when focusing if conditions are met
              if (!preventReopen && query.length > 1) {
                setShowSuggestions(true);
              }
            }}
            onBlur={() =>
              // Hide suggestions after a small delay to allow clicks to register
              setTimeout(() => {
                setShowSuggestions(false);
                setSelectedIndex(-1);
              }, 100)
            }
          />
        </div>
      </form>

      {/* Error Display */}
      {error && <div className={styles.errorContainer}>{error}</div>}

      {/* Autocomplete Suggestions */}
      {showSuggestions && (
        <ul ref={suggestionsRef} className={styles.suggestionsList}>
          {suggestions.map((item, index) => (
            <li
              key={`${item.type}-${item.id}`} // Unique key combining type and id
              ref={index === selectedIndex ? selectedItemRef : null} // Ref for scrolling
              onClick={() => handleSuggestionClick(item)}
              className={`${styles.suggestionItem} ${
                index === selectedIndex ? styles.activeSuggestion : ""
              }`}
              onMouseEnter={() => setSelectedIndex(index)} // Update selection on hover
            >
              {/* Render different content based on item type */}
              {item.type === "movie" ? (
                // Movie suggestion layout
                <>
                  <img
                    src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                    alt={item.title}
                    className={styles.posterImage}
                    onError={(e) => {
                      // Hide broken image and show fallback
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextElementSibling?.classList.remove(
                        styles.hidden
                      );
                    }}
                  />
                  <div className={`${styles.imageFallback} ${styles.hidden}`}>
                    <span>No Image</span>
                  </div>
                  <div className={styles.movieInfo}>
                    <h3 className={styles.movieTitle}>{item.title}</h3>
                    <p className={styles.movieReleaseYear}>
                      {item.release_date
                        ? new Date(item.release_date).getFullYear()
                        : "N/A"}
                    </p>
                  </div>
                </>
              ) : (
                // Actor suggestion layout
                <>
                  <img
                    src={`https://image.tmdb.org/t/p/w92${item.profile_path}`}
                    alt={item.name}
                    className={styles.posterImage}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextElementSibling?.classList.remove(
                        styles.hidden
                      );
                    }}
                  />
                  <div className={`${styles.imageFallback} ${styles.hidden}`}>
                    <span>No Image</span>
                  </div>
                  <div className={styles.actorInfo}>
                    <h4 className={styles.actorName}>{item.name}</h4>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Movie Results List - Only show when not in header mode */}
      {!isHeaderSearch && <MovieList movies={movies} />}
    </div>
  );
};

// Export component wrapped with error boundary for crash protection
export default withErrorBoundary(MovieSearch, "MovieSearch");
