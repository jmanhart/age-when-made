import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchActorFilmography } from "../utils/api";
import fetchActorDetails from "../utils/fetchActorDetails";
import { Movie, Actor } from "../types/types";
import styles from "./ActorFilmography.module.css";

const ActorFilmography: React.FC = () => {
  const { actorId } = useParams<{ actorId: string }>();
  const [filmography, setFilmography] = useState<Movie[]>([]);
  const [actor, setActor] = useState<Actor | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getActorData = async () => {
      if (actorId) {
        const actorDetails = await fetchActorDetails(Number(actorId));
        setActor(actorDetails);

        const filmographyData = await fetchActorFilmography(Number(actorId));
        setFilmography(filmographyData);
      }
    };
    getActorData();
  }, [actorId]);

  if (!actor) return <p>Loading actor data...</p>;
  if (filmography.length === 0) return <p>No filmography data available.</p>;

  return (
    <div className={styles.actorFilmographyContainer}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        Back
      </button>

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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActorFilmography;

// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { fetchActorFilmography } from "../utils/api";
// import fetchActorDetails from "../utils/fetchActorDetails";
// import { Movie, Actor } from "../types/types";
// import styles from "./ActorFilmography.module.css";
// import { calculateAgeAtDate } from "../utils/calculateAge";

// const ActorFilmography: React.FC = () => {
//   const { actorId } = useParams<{ actorId: string }>();
//   const [filmography, setFilmography] = useState<Movie[]>([]);
//   const [actor, setActor] = useState<Actor | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const getActorData = async () => {
//       if (actorId) {
//         const actorDetails = await fetchActorDetails(Number(actorId));
//         const actorWithAge: Actor = {
//           ...actorDetails,
//           id: Number(actorId),
//           ageAtRelease: null,
//           currentAge: null,
//           ageAtDeath: null,
//           character: "",
//         };
//         setActor(actorWithAge);

//         const filmographyData = await fetchActorFilmography(Number(actorId));

//         // Sort movies by release date (latest first) and add calculated age at release
//         const sortedFilmography = filmographyData
//           .filter((movie) => movie.release_date) // Ensure release date exists
//           .map((movie) => ({
//             ...movie,
//             ageAtRelease: calculateAgeAtDate(
//               actorDetails.birthday,
//               movie.release_date
//             ),
//           }))
//           .sort(
//             (a, b) =>
//               new Date(b.release_date).getTime() -
//               new Date(a.release_date).getTime()
//           );

//         setFilmography(sortedFilmography);
//       }
//     };
//     getActorData();
//   }, [actorId]);

//   if (!actor) return <p>Loading actor data...</p>;
//   if (filmography.length === 0) return <p>No filmography data available.</p>;

//   return (
//     <div className={styles.actorFilmographyContainer}>
//       <button onClick={() => navigate(-1)} className={styles.backButton}>
//         Back
//       </button>
//       <div className={styles.actorHeader}>
//         <img
//           src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
//           alt={`${actor.name}'s profile`}
//           className={styles.actorImage}
//         />
//         <div>
//           <h2 className={styles.actorName}>{actor.name}</h2>
//           <p className={styles.actorDetails}>
//             {actor.birthday ? `Born: ${actor.birthday}` : "Birthday unknown"}
//           </p>
//           {actor.deathday && (
//             <p className={styles.actorDetails}>Died: {actor.deathday}</p>
//           )}
//         </div>
//       </div>
//       {/* Filmography section */}
//       <h3 className={styles.filmographyTitle}>Filmography</h3>
//       <ul className={styles.filmographyList}>
//         {filmography.map((movie) => (
//           <li key={movie.id} className={styles.filmographyItem}>
//             <p className={styles.movieTitle}>{movie.title}</p>
//             <p className={styles.movieReleaseDate}>
//               Release Date: {movie.release_date}
//             </p>
//             <p className={styles.ageAtRelease}>
//               Age during filming: {movie.ageAtRelease ?? "N/A"}
//             </p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ActorFilmography;
