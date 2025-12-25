import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchMovieById,
  fetchMovieByTitle,
  fetchMovieCast,
} from "../../utils/api";
import { Movie, Actor } from "../../types/types";
import styles from "./MovieDetails.module.css";
import { parseMovieIdentifier } from "../../utils/slugUtils";
import MovieSidebar from "./MovieSidebar";
import CastContent from "./CastContent";

const MovieDetails: React.FC = () => {
  const { movieIdentifier } = useParams<{ movieIdentifier: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [cast, setCast] = useState<Actor[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("none");
  const [hideNoImage, setHideNoImage] = useState(true);
  const [hideNoBirthDate, setHideNoBirthDate] = useState(false);
  const [loadingCast, setLoadingCast] = useState<boolean>(true);

  useEffect(() => {
    const getMovieDetails = async () => {
      if (movieIdentifier) {
        const parsed = parseMovieIdentifier(movieIdentifier);
        if (parsed) {
          let movieData: Movie | null = null;

          if (parsed.id) {
            // Numeric ID - fetch by ID
            movieData = await fetchMovieById(parsed.id);
          } else if (parsed.title) {
            // Slug - fetch by title and year
            movieData = await fetchMovieByTitle(parsed.title, parsed.year);
          }

          setMovie(movieData);

          if (movieData?.id && movieData?.release_date) {
            setLoadingCast(true);
            const castData = await fetchMovieCast(
              movieData.id,
              movieData.release_date
            );
            setCast(castData);
            setLoadingCast(false);
          }
        }
      }
    };
    getMovieDetails();
  }, [movieIdentifier]);

  if (!movie) return <p>Loading movie details...</p>;

  // Calculate Metrics Based on Original Cast (not filtered)
  const totalActors = cast.length;
  const actorsAlive = cast.filter((actor) => !actor.deathday).length;
  const actorsDeceased = totalActors - actorsAlive;

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

  return (
    <div className={styles.movieDetailsContainer}>
      <MovieSidebar
        movie={movie}
        actorsAlive={actorsAlive}
        actorsDeceased={actorsDeceased}
      />
      <CastContent
        filteredCast={filteredCast}
        loadingCast={loadingCast}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        hideNoImage={hideNoImage}
        setHideNoImage={setHideNoImage}
        hideNoBirthDate={hideNoBirthDate}
        setHideNoBirthDate={setHideNoBirthDate}
      />
    </div>
  );
};

export default MovieDetails;
