import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchActorFilmography, fetchActorDetails } from "../../utils/api";
import { Movie, Actor } from "../../types/types";
import styles from "./ActorFilmography.module.css";
import {
  logComponentRender,
  logUserAction,
  logPerformance,
} from "../../utils/sentry";

/**
 * ActorFilmography Component
 *
 * Displays a comprehensive view of an actor's filmography including:
 * - Actor profile image and name
 * - Complete list of movies they've appeared in
 * - Movie details (title, release date, actor's age during filming)
 * - Navigation links to individual movie pages
 */
const ActorFilmography: React.FC = () => {
  // Extract actor ID from URL parameters (e.g., /actor/123)
  const { actorId } = useParams<{ actorId: string }>();

  // State management for component data
  const [filmography, setFilmography] = useState<Movie[]>([]); // Array of movies the actor appeared in
  const [actor, setActor] = useState<Actor | null>(null); // Actor's personal details

  // Commented out navigation hook - could be used for programmatic navigation
  // const navigate = useNavigate();

  // Helper functions for age calculations
  const calculateCurrentAge = (birthday: string) => {
    return new Date().getFullYear() - new Date(birthday).getFullYear();
  };

  const getBirthYear = (birthday: string) => {
    return new Date(birthday).getFullYear();
  };

  /**
   * Main data fetching effect
   * Runs when actorId changes (component mounts or URL changes)
   */
  useEffect(() => {
    const getActorData = async () => {
      if (actorId) {
        const startTime = performance.now();

        // Fetch actor's personal details (name, profile image, etc.)
        const actorDetails = (await fetchActorDetails(
          Number(actorId)
        )) as Actor;
        setActor(actorDetails);

        // Fetch actor's complete filmography
        let filmographyData = await fetchActorFilmography(Number(actorId));

        // Sort filmography by release date (newest first)
        // This creates a chronological timeline from most recent to oldest
        filmographyData = filmographyData.sort(
          (a, b) =>
            new Date(b.release_date).getTime() -
            new Date(a.release_date).getTime()
        );
        setFilmography(filmographyData);
      }
    };
    getActorData();
  }, [actorId]);

  // Loading states - show appropriate messages while data is being fetched
  if (!actor) return <p>Loading actor data...</p>;
  if (filmography.length === 0) return <p>No filmography data available.</p>;

  return (
    <div className={styles.actorFilmographyContainer}>
      {/* Actor Profile Header Section */}
      <div className={styles.actorHeader}>
        {/* Actor's profile image from TMDB */}
        <img
          src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
          alt={`${actor.name}'s profile`}
          className={styles.actorFilmographyImage}
        />
        <div>
          {/* Actor's name as main heading */}
          <h2 className={styles.actorName}>{actor.name}</h2>

          {/* Actor's age/death status */}
          {actor.birthday && (
            <p className={styles.actorAgeStatus}>
              {actor.deathday ? (
                // Actor is deceased - separate elements for styling
                <>
                  <span className={styles.wouldBeAge}>
                    Would be {calculateCurrentAge(actor.birthday)}
                  </span>
                  <span className={styles.ageLabel}> years old</span>
                  <span className={styles.lifeSpan}>
                    {" "}
                    ({getBirthYear(actor.birthday)} -{" "}
                    {getBirthYear(actor.deathday)})
                  </span>
                </>
              ) : (
                // Actor is alive - show current age
                <>
                  <span className={styles.currentAge}>
                    {calculateCurrentAge(actor.birthday)}
                  </span>
                  <span className={styles.ageLabel}> years old</span>
                  <span className={styles.lifeSpan}>
                    {" "}
                    ({getBirthYear(actor.birthday)})
                  </span>
                </>
              )}
            </p>
          )}
        </div>
      </div>

      {/* Filmography List Section */}
      <h3 className={styles.filmographyTitle}>Filmography</h3>

      {/* Grid/List of all movies */}
      <ul className={styles.filmographyList}>
        {filmography.map((movie) => (
          <li key={movie.id} className={styles.filmographyItem}>
            {/* Each movie is a clickable link to its details page */}
            <Link to={`/movie/${movie.id}`} className={styles.movieLink}>
              {/* Movie poster image */}
              <div className={styles.filmographyItemContent}>
                <img
                  src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                  alt={`${movie.title} poster`}
                  className={styles.moviePoster}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) {
                      fallback.style.display = "flex";
                    }
                  }}
                />
                <div
                  className={styles.imageFallback}
                  style={{ display: "none" }}
                >
                  <span>No Image</span>
                </div>

                {/* Movie information container */}
                <div className={styles.movieDetails}>
                  {/* Movie title */}
                  <h4 className={styles.movieTitle}>{movie.title}</h4>

                  {/* Release date - full date format */}
                  <p className={styles.movieReleaseDate}>
                    Release Date: {movie.release_date}
                  </p>

                  {/* Actor's age when the movie was filmed/released */}
                  <p className={styles.ageAtRelease}>
                    {actor.deathday &&
                    new Date(movie.release_date) > new Date(actor.deathday) ? (
                      // Posthumous release - show age they would have been
                      <>
                        <span className={styles.posthumousLabel}>
                          Would have been{" "}
                        </span>
                        <span className={styles.posthumousAge}>
                          {movie.ageAtRelease ?? "N/A"}
                        </span>
                        <span className={styles.posthumousSuffix}>
                          {" "}
                          years old
                        </span>
                      </>
                    ) : (
                      // Regular release - show age during filming
                      <>
                        <span className={styles.filmingLabel}>
                          Age during filming:{" "}
                        </span>
                        <span className={styles.filmingAge}>
                          {movie.ageAtRelease ?? "N/A"}
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActorFilmography;
