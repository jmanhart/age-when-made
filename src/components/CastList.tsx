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
        <p>Birthday: {actor.birthday || "FAR"}</p>
        <p>Age at Release: {calculateAgeAtDate(actor.birthday, releaseDate)}</p>
        {actor.deathday && (
          <p>
            Deceased: {actor.deathday} (Age at Death:{" "}
            {calculateAgeAtDate(actor.birthday, actor.deathday)})
          </p>
        )}
      </li>
    ))}
  </ul>
);

export default CastList;
