import React, { useEffect, useMemo, useState } from "react";
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
  const [viewMode, setViewMode] = useState<"grid" | "timeline">("grid");
  const [ageMode, setAgeMode] = useState<"ageAtRelease" | "currentAge">(
    "ageAtRelease"
  );

  useEffect(() => {
    const controller = new AbortController();

    const getMovieDetails = async () => {
      if (movieIdentifier) {
        const parsed = parseMovieIdentifier(movieIdentifier);
        if (parsed) {
          let movieData: Movie | null = null;

          if (parsed.id) {
            movieData = await fetchMovieById(parsed.id, controller.signal);
          } else if (parsed.title) {
            movieData = await fetchMovieByTitle(
              parsed.title,
              parsed.year,
              controller.signal
            );
          }

          if (controller.signal.aborted) return;
          setMovie(movieData);

          if (movieData?.id && movieData?.release_date) {
            setLoadingCast(true);
            const castData = await fetchMovieCast(
              movieData.id,
              movieData.release_date,
              controller.signal
            );
            if (controller.signal.aborted) return;
            setCast(castData);
            setLoadingCast(false);
          }
        }
      }
    };

    getMovieDetails().catch((err) => {
      // Silently ignore cancelled requests
      if (!controller.signal.aborted) console.error(err);
    });

    return () => controller.abort();
  }, [movieIdentifier]);

  // Calculate Metrics Based on Original Cast (not filtered)
  const { actorsAlive, actorsDeceased } = useMemo(() => {
    const alive = cast.filter((actor) => !actor.deathday).length;
    return { actorsAlive: alive, actorsDeceased: cast.length - alive };
  }, [cast]);

  // Filtered Cast Calculation
  const filteredCast = useMemo(
    () =>
      cast
        .filter((actor) => {
          const statusCondition =
            statusFilter === "All" ||
            (statusFilter === "Deceased" && actor.deathday) ||
            (statusFilter === "Alive" && !actor.deathday);
          const imageCondition = !hideNoImage || actor.profile_path;
          const birthDateCondition = !hideNoBirthDate || actor.birthday;
          return statusCondition && imageCondition && birthDateCondition;
        })
        .sort((a, b) => {
          if (sortOrder === "oldest")
            return (b.currentAge || 0) - (a.currentAge || 0);
          if (sortOrder === "youngest")
            return (a.currentAge || 0) - (b.currentAge || 0);
          return 0;
        }),
    [cast, statusFilter, sortOrder, hideNoImage, hideNoBirthDate]
  );

  if (!movie) return <p>Loading movie details...</p>;

  return (
    <>
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
          viewMode={viewMode}
          setViewMode={setViewMode}
          ageMode={ageMode}
          setAgeMode={setAgeMode}
        />
      </div>
    </>
  );
};

export default MovieDetails;
