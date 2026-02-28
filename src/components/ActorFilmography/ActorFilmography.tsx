import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  fetchActorFilmography,
  fetchActorDetails,
  fetchActorByName,
} from "../../utils/api";
import { Movie, Actor } from "../../types/types";
import styles from "./ActorFilmography.module.css";
import { parseActorIdentifier, createMovieSlug } from "../../utils/slugUtils";

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
  // Extract actor identifier from URL parameters (e.g., /actor/123 or /actor/actor-name-123)
  const { actorIdentifier } = useParams<{ actorIdentifier: string }>();

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
   * Runs when actorIdentifier changes (component mounts or URL changes)
   */
  useEffect(() => {
    const controller = new AbortController();

    const getActorData = async () => {
      if (actorIdentifier) {
        const parsed = parseActorIdentifier(actorIdentifier);
        if (parsed) {
          let actorDetails: Actor | null = null;

          if (parsed.id) {
            actorDetails = (await fetchActorDetails(parsed.id)) as Actor;
          } else if (parsed.name) {
            actorDetails = await fetchActorByName(
              parsed.name.replace(/-/g, " "),
              controller.signal
            );
          }

          if (controller.signal.aborted) return;

          if (actorDetails) {
            setActor(actorDetails);

            let filmographyData = await fetchActorFilmography(
              actorDetails.id,
              controller.signal
            );

            if (controller.signal.aborted) return;

            filmographyData = filmographyData.sort(
              (a, b) =>
                new Date(b.release_date).getTime() -
                new Date(a.release_date).getTime()
            );
            setFilmography(filmographyData);
          }
        }
      }
    };

    getActorData().catch((err) => {
      if (!controller.signal.aborted) console.error(err);
    });

    return () => controller.abort();
  }, [actorIdentifier]);

  // Loading states - show appropriate messages while data is being fetched
  if (!actor) return <p>Loading actor data...</p>;
  if (filmography.length === 0) return <p>No filmography data available.</p>;

  return (
    <div className={styles.actorFilmographyContainer}>
      {/* Actor Info Sidebar */}
      <aside className={styles.actorSidebar}>
        <img
          src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
          alt={`${actor.name}'s profile`}
          className={styles.actorImage}
        />
        
        <div className={styles.actorInfo}>
          <h1 className={styles.actorName}>{actor.name}</h1>
          
          {actor.birthday && (
            <p className={styles.actorAgeStatus}>
              {actor.deathday ? (
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
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        <h2 className={styles.filmographyTitle}>Filmography</h2>

        {/* Movie Grid */}
        <div className={styles.filmographyGrid}>
          {filmography.map((movie) => (
            <Link
              key={movie.id}
              to={`/movie/${createMovieSlug(movie.title, movie.release_date)}`}
              className={styles.movieCard}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={`${movie.title} poster`}
                className={styles.moviePoster}
                loading="lazy"
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

              <div className={styles.movieInfo}>
                <h3 className={styles.movieTitle}>{movie.title}</h3>
                
                <p className={styles.movieYear}>
                  {new Date(movie.release_date).getFullYear()}
                </p>

                <p className={styles.ageAtRelease}>
                  {actor.deathday &&
                  new Date(movie.release_date) > new Date(actor.deathday) ? (
                    <>
                      <span className={styles.posthumousAge}>
                        Would have been {movie.ageAtRelease ?? "N/A"}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className={styles.filmingAge}>
                        Age {movie.ageAtRelease ?? "N/A"}
                      </span>
                    </>
                  )}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ActorFilmography;
