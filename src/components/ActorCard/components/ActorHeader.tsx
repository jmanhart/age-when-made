import React from "react";
import { ActorProps } from "../types";
import styles from "../ActorCard.module.css";

interface ActorHeaderProps {
  actor: ActorProps;
  className?: string;
}

export const ActorHeader: React.FC<ActorHeaderProps> = ({
  actor,
  className,
}) => {
  return (
    <header className={className}>
      <h3 className={styles.actorName}>{actor.name}</h3>
      <h4 className={styles.characterName}>{actor.character}</h4>
    </header>
  );
};
