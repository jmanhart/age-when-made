import React from "react";
import { Cast } from "../types/types";
import { calculateAgeAtDate } from "../utils/calculateAge";

interface CastListProps {
  cast: Cast[];
  releaseDate: string;
}

const CastList: React.FC<CastListProps> = ({ cast, releaseDate }) => (
  <ul>
    {cast.map((actor) => (
      <li key={actor.id}>
        <strong>{actor.name}</strong> as {actor.character}
        <p>Birthday: {actor.birthday || "N/A"}</p>
        {actor.deathday ? (
          <p>
            Deceased: {actor.deathday} (Age at Death: {actor.ageAtDeath})
          </p>
        ) : (
          <>
            <p>
              Current Age:{" "}
              {actor.currentAge !== null ? actor.currentAge : "N/A"}
            </p>
            <p>
              Age at Release:{" "}
              {actor.ageAtRelease !== null ? actor.ageAtRelease : "N/A"}
            </p>
          </>
        )}
      </li>
    ))}
  </ul>
);

export default CastList;
