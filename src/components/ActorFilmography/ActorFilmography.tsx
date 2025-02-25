import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchActorFilmography, fetchActorDetails } from "../../utils/api";
import { Movie, Actor } from "../../types/types";
import styles from "./ActorFilmography.module.css";

const ActorFilmography: React.FC = () => {
  const { actorId } = useParams<{ actorId: string }>();
  const [filmography, setFilmography] = useState<Movie[]>([]);
  const [actor, setActor] = useState<Actor | null>(null);
  // const navigate = useNavigate();

  useEffect(() => {
    const getActorData = async () => {
      if (actorId) {
        const actorDetails = (await fetchActorDetails(
          Number(actorId)
        )) as Actor;
        setActor(actorDetails);

        let filmographyData = await fetchActorFilmography(Number(actorId));
        // Sort the filmography by release date in descending order
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

  if (!actor) return <p>Loading actor data...</p>;
  if (filmography.length === 0) return <p>No filmography data available.</p>;

  return (
    <div className={styles.actorFilmographyContainer}>
      <div className={styles.actorHeader}>
        <img
          src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
          alt={`${actor.name}'s profile`}
          className={styles.actorImage}
        />
        <h2 className={styles.actorName}>{actor.name}</h2>
      </div>

      <h3 className={styles.filmographyTitle}>Filmography</h3>
      <ul className={styles.filmographyList}>
        {filmography.map((movie) => (
          <li key={movie.id} className={styles.filmographyItem}>
            <Link to={`/movie/${movie.id}`} className={styles.movieLink}>
              <img
                src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                alt={`${movie.title} poster`}
                className={styles.moviePoster}
              />
              <div className={styles.movieDetails}>
                <h4 className={styles.movieTitle}>{movie.title}</h4>
                <p className={styles.movieReleaseDate}>
                  Release Date: {movie.release_date}
                </p>
                <p className={styles.ageAtRelease}>
                  Age during filming: {movie.ageAtRelease ?? "N/A"}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActorFilmography;
