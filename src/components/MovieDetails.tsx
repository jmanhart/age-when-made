import React, { useEffect, useState } from "react";
import { fetchMovieById, fetchMovieCast } from "../utils/api"; // Import fetchMovieCast
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import calculateMovieAge from "../utils/calculateMovieAge"; // Import the helper function
import { Movie, Actor } from "../types/types";
import styles from "./MovieDetails.module.css";

const MovieDetails: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [cast, setCast] = useState<Actor[]>([]); // State for cast list
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const getMovieDetails = async () => {
      if (movieId) {
        const movieData = await fetchMovieById(Number(movieId));
        setMovie(movieData);

        // Fetch the cast details when the movie data is loaded
        if (movieData?.release_date) {
          const castData = await fetchMovieCast(
            Number(movieId),
            movieData.release_date
          );
          setCast(castData);
        }
      }
    };
    getMovieDetails();
  }, [movieId]);

  if (!movie) return <p>Loading...</p>;

  return (
    <div className={styles.detailsWrapper}>
      <button onClick={() => navigate(-1)}>Back</button>
      <h1>{movie.title}</h1>
      <p>Release Date: {movie.release_date}</p>
      <p>Movie Age: {calculateMovieAge(movie.release_date)} years</p>
      <p>{movie.overview}</p>
      <h2>Cast</h2>
      <ul className={styles.castList}>
        {cast.map((actor) => (
          <li key={actor.id} className={styles.castItem}>
            {actor.profile_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                alt={`${actor.name}'s profile`}
                className={`${styles.actorImage} ${
                  actor.deathday ? styles.Deceased : ""
                }`}
              />
            ) : (
              <div className="placeholder-image">No Image</div>
            )}
            <br />
            <strong>{actor.name}</strong> as {actor.character}
            <p>Birthday: {actor.birthday || "No Data Available"}</p>
            {actor.deathday ? (
              <p>
                Deceased: {actor.deathday} (Age at Death: {actor.ageAtDeath})
              </p>
            ) : (
              <>
                <p>Current Age: {actor.currentAge ?? "No Data Available"}</p>
                <p>
                  Age at Release: {actor.ageAtRelease ?? "No Data Available"}
                </p>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MovieDetails;
