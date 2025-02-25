import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchMovieById, fetchMovieCast } from "../../utils/api";
import { Movie, Actor } from "../../types/types";
import SliderIcon from "../../assets/icons/sliderIcon";
import styles from "./MovieDetails.module.css";

const MovieDetails: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [cast, setCast] = useState<Actor[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("none");
  const [hideNoImage, setHideNoImage] = useState(true);
  const [hideNoBirthDate, setHideNoBirthDate] = useState(false); // New state for hiding actors with no birth date
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle settings menu
  const [loadingCast, setLoadingCast] = useState<boolean>(true);

  useEffect(() => {
    const getMovieDetails = async () => {
      if (movieId) {
        const movieData = await fetchMovieById(Number(movieId));
        setMovie(movieData);

        if (movieData?.release_date) {
          setLoadingCast(true);
          const castData = await fetchMovieCast(
            Number(movieId),
            movieData.release_date
          );
          setCast(castData);
          setLoadingCast(false);
        }
      }
    };
    getMovieDetails();
  }, [movieId]);

  if (!movie) return <p>Loading movie details...</p>;

  // Calculate the movie's age
  const calculateMovieAge = (releaseDate: string) => {
    const releaseYear = new Date(releaseDate).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - releaseYear;
  };

  // Calculate actor metrics
  // const totalActors = cast.length;
  // const actorsAlive = cast.filter((actor) => !actor.deathday).length;
  // const actorsDeceased = totalActors - actorsAlive;

  // Filtered Cast Calculation
  const filteredCast = cast
    .filter((actor) => {
      const statusCondition =
        statusFilter === "All" ||
        (statusFilter === "Deceased" && actor.deathday) ||
        (statusFilter === "Alive" && !actor.deathday);
      const imageCondition = !hideNoImage || actor.profile_path;
      const birthDateCondition = !hideNoBirthDate || actor.birthday; // New filter condition
      return statusCondition && imageCondition && birthDateCondition;
    })
    .sort((a, b) => {
      if (sortOrder === "oldest")
        return (b.currentAge || 0) - (a.currentAge || 0);
      if (sortOrder === "youngest")
        return (a.currentAge || 0) - (b.currentAge || 0);
      return 0;
    });

  // Calculate Metrics Based on Filtered List
  const totalActors = filteredCast.length;
  const actorsAlive = filteredCast.filter((actor) => !actor.deathday).length;
  const actorsDeceased = totalActors - actorsAlive;

  return (
    <div className={styles.movieDetailsContainer}>
      {/* Movie Header */}
      <div className={styles.movieHeader}>
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={`${movie.title} poster`}
          className={styles.moviePoster}
        />
        <div className={styles.movieInfo}>
          <h1 className={styles.movieTitle}>{movie.title}</h1>
          <p className={styles.movieReleaseDate}>
            Release Date: {movie.release_date}
          </p>
          <p className={styles.movieAge}>
            Movie Age: {calculateMovieAge(movie.release_date)} years
          </p>
          <p className={styles.movieOverview}>{movie.overview}</p>

          {/* Actor Metrics */}
          <div className={styles.actorMetrics}>
            <p>Total Actors: {totalActors}</p>
            <p>Actors Alive: {actorsAlive}</p>
            <p>Actors Deceased: {actorsDeceased}</p>
          </div>
        </div>
      </div>

      {/* Filter and Sort Controls */}
      <div className={styles.filterSortContainer}>
        <div className={styles.filterSortWrapper}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.statusFilter}
          >
            <option value="All">All</option>
            <option value="Alive">Alive</option>
            <option value="Deceased">Deceased</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className={styles.sortOrder}
          >
            <option value="none">No Sort</option>
            <option value="oldest">Oldest</option>
            <option value="youngest">Youngest</option>
          </select>
        </div>

        <div>
          <div className={styles.settingsContainer}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={styles.menuButton}
              aria-label="Settings"
            >
              {/* SVG icon for a gear */}
              <SliderIcon className={styles.sliderIcon} />
            </button>

            {isMenuOpen && (
              <div className={styles.menu}>
                <label>
                  <input
                    type="checkbox"
                    checked={hideNoImage}
                    onChange={(e) => setHideNoImage(e.target.checked)}
                  />
                  Hide Actors Without Images
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={hideNoBirthDate}
                    onChange={(e) => setHideNoBirthDate(e.target.checked)}
                  />
                  Hide Actors Without Birth Dates
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cast List Grid */}
      <div className={styles.castGrid}>
        {loadingCast
          ? Array(8)
              .fill(0)
              .map((_, index) => (
                <div key={index} className={styles.placeholderCastItem}>
                  <div className={styles.placeholderImage}></div>
                  <div className={styles.placeholderText}></div>
                </div>
              ))
          : filteredCast.map((actor) => (
              <Link
                to={`/actor/${actor.id}`}
                key={actor.id}
                className={styles.castItem}
              >
                {actor.profile_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                    alt={`${actor.name}'s profile`}
                    className={`${styles.actorImage} ${
                      actor.deathday ? styles.deceased : ""
                    }`}
                  />
                ) : (
                  <div className={`${styles.actorImage} ${styles.noImage}`}>
                    No Image
                  </div>
                )}
                <div className={styles.actorDetails}>
                  <h2 className={styles.actorName}>{actor.name}</h2>
                  <h3 className={styles.characterName}>{actor.character}</h3>
                  <div className={styles.metrics}>
                    <div className={styles.metricRow}>
                      <span className={styles.metricLabel}>Birthday:</span>
                      <span className={styles.metricValue}>
                        {actor.birthday || "N/A"}
                      </span>
                    </div>
                    {actor.deathday ? (
                      <>
                        <div className={styles.metricRow}>
                          <span className={styles.metricLabel}>
                            Date of Death:
                          </span>
                          <span className={styles.metricValue}>
                            {actor.deathday}
                          </span>
                        </div>
                        <div className={styles.metricRow}>
                          <span className={styles.metricLabel}>
                            Age at Death:
                          </span>
                          <span className={styles.metricValue}>
                            {actor.ageAtDeath ?? "N/A"}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className={styles.metricRow}>
                        <span className={styles.metricLabel}>Current Age:</span>
                        <span className={styles.metricValue}>
                          {actor.currentAge ?? "N/A"}
                        </span>
                      </div>
                    )}
                    <div className={styles.metricRow}>
                      <span className={styles.metricLabel}>
                        Age at Release:
                      </span>
                      <span className={styles.metricValue}>
                        {actor.ageAtRelease ?? "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default MovieDetails;
