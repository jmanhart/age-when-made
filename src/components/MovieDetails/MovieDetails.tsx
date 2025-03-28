import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchMovieById, fetchMovieCast } from "../../utils/api";
import { Movie, Actor } from "../../types/types";
import styles from "./MovieDetails.module.css";
import ActorCard from "../ActorCard/ActorCard.tsx";
import Select from "../Select/Select";
import SettingsMenu from "../SettingsMenu/SettingsMenu";

const MovieDetails: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [cast, setCast] = useState<Actor[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("none");
  const [hideNoImage, setHideNoImage] = useState(true);
  const [hideNoBirthDate, setHideNoBirthDate] = useState(false);
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

  const statusOptions = [
    { value: "All", label: "All" },
    { value: "Alive", label: "Alive" },
    { value: "Deceased", label: "Deceased" },
  ];

  const sortOptions = [
    { value: "none", label: "No Sort" },
    { value: "oldest", label: "Oldest" },
    { value: "youngest", label: "Youngest" },
  ];

  const settingsOptions = [
    {
      id: "hideNoImage",
      label: "Hide Actors Without Images",
      checked: hideNoImage,
      onChange: setHideNoImage,
    },
    {
      id: "hideNoBirthDate",
      label: "Hide Actors Without Birth Dates",
      checked: hideNoBirthDate,
      onChange: setHideNoBirthDate,
    },
  ];

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
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusOptions}
            className={styles.statusFilter}
          />

          <Select
            value={sortOrder}
            onChange={setSortOrder}
            options={sortOptions}
            className={styles.sortOrder}
          />
        </div>

        <div>
          <SettingsMenu options={settingsOptions} />
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
              <ActorCard
                key={actor.id}
                actor={{
                  id: actor.id,
                  name: actor.name,
                  character: actor.character,
                  profilePath: actor.profile_path || undefined,
                  birthday: actor.birthday || undefined,
                  deathday: actor.deathday || undefined,
                  currentAge: actor.currentAge || undefined,
                  ageAtDeath: actor.ageAtDeath || undefined,
                  ageAtRelease: actor.ageAtRelease || undefined,
                }}
              />
            ))}
      </div>
    </div>
  );
};

export default MovieDetails;
