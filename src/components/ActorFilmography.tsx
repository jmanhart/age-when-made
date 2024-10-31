import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchActorFilmography } from "../utils/api";
import fetchActorDetails from "../utils/fetchActorDetails";
import { Movie, Actor } from "../types/types";
import styles from "./ActorFilmography.module.css"; // Assuming you have CSS styles for this component

const ActorFilmography: React.FC = () => {
  const { actorId } = useParams<{ actorId: string }>();
  const [filmography, setFilmography] = useState<Movie[]>([]);
  const [actor, setActor] = useState<Actor | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getActorData = async () => {
      if (actorId) {
        const actorDetails = await fetchActorDetails(Number(actorId));
        const actorWithAge: Actor = {
          ...actorDetails,
          id: Number(actorId),
          ageAtRelease: null,
          currentAge: null,
          ageAtDeath: null,
          character: "",
        };
        setActor(actorWithAge);

        const filmographyData = await fetchActorFilmography(Number(actorId));
        setFilmography(filmographyData);
      }
    };
    getActorData();
  }, [actorId]);

  if (!actor) return <p>Loading actor data...</p>;
  if (filmography.length === 0) return <p>No filmography data available.</p>;

  return (
    <div>
      <button onClick={() => navigate(-1)}>Back</button>
      <div className={styles.actorHeader}>
        <img
          src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
          alt={`${actor.name}'s profile`}
          className={styles.actorImage}
        />
        <h2>{actor.name}</h2>
      </div>
      <h3>Filmography</h3>
      <ul>
        {filmography.map((movie) => (
          <li key={movie.id}>
            <p>{movie.title}</p>
            <p>Age during filming: {movie.ageAtRelease ?? "N/A"}</p>
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
// import { Movie } from "../types/types";

// const ActorFilmography: React.FC = () => {
//   const { actorId } = useParams<{ actorId: string }>();
//   const [filmography, setFilmography] = useState<Movie[]>([]);
//   const navigate = useNavigate();
//   useEffect(() => {
//     const getFilmography = async () => {
//       if (actorId) {
//         const data = await fetchActorFilmography(Number(actorId));
//         setFilmography(data);
//       }
//     };
//     getFilmography();
//   }, [actorId]);

//   if (filmography.length === 0) return <p>No filmography data available.</p>;

//   return (
//     <div>
//       <button onClick={() => navigate(-1)}>Back</button>
//       <h2>Filmography</h2>
//       <img
//         src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
//         alt={`${actor.name}'s profile`}
//         className={`${styles.actorImage} ${
//           actor.deathday ? styles.Deceased : ""
//         }`}
//       />
//       <ul>
//         {filmography.map((movie) => (
//           <li key={movie.id}>
//             <p>{movie.title}</p>
//             <p>Age during filming: {movie.ageAtRelease ?? "N/A"}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ActorFilmography;
