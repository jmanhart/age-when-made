import React from "react";
import { ActorProps } from "../types";
import styles from "../ActorCard.module.css";
import classNames from "classnames";

interface ActorImageProps {
  actor: ActorProps;
  size?: "small" | "medium" | "large";
  className?: string;
}

export const ActorImage: React.FC<ActorImageProps> = ({
  actor,
  size = "medium",
  className,
}) => {
  const imageClasses = classNames(
    styles.actorImage,
    {
      [styles.deceased]: actor.deathday,
      [styles.noImage]: !actor.profilePath,
      [styles[`image--${size}`]]: size,
    },
    className
  );

  if (!actor.profilePath) {
    return <div className={imageClasses}>No Image Available</div>;
  }

  return (
    <div className={styles.imageContainer}>
      <img
        src={`https://image.tmdb.org/t/p/w500${actor.profilePath}`}
        alt={`${actor.name} as ${actor.character}`}
        className={imageClasses}
      />
      {actor.deathday && (
        <div className={styles.deceasedRibbon}>
          <span>💀 RIP</span>
        </div>
      )}
    </div>
  );
};
