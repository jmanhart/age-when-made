import React from "react";
import { Link } from "react-router-dom";
import styles from "./ActorCard.module.css";
import "/src/styles/global.css";

interface ActorProps {
  id: number;
  name: string;
  character: string;
  profilePath?: string;
  birthday?: string;
  deathday?: string;
  currentAge?: number;
  ageAtDeath?: number;
  ageAtRelease?: number;
}

const ActorCard: React.FC<{ actor: ActorProps }> = ({ actor }) => {
  // Ensure profilePath is correctly formatted
  const imageUrl = actor.profilePath
    ? actor.profilePath.startsWith("http")
      ? actor.profilePath
      : `https://image.tmdb.org/t/p/w185${actor.profilePath}`
    : "";

  return (
    <Link to={`/actor/${actor.id}`} className={styles.castItem}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`${actor.name}'s profile`}
          className={`${styles.actorImage} ${
            actor.deathday ? styles.deceased : ""
          }`}
        />
      ) : (
        <div className={`${styles.actorImage} ${styles.noImage}`}>No Image</div>
      )}
      <div className={styles.actorDetails}>
        <h2 className={styles.actorName}>{actor.name}</h2>
        <h3 className={styles.characterName}>{actor.character}</h3>
        <div className={styles.metrics}>
          <div className={styles.metricRow}>
            <span className={styles.metricLabel}>Birthday:</span>
            <span className={styles.metricValue}>
              {actor.birthday || "N/A"}
            </span>
          </div>
          {actor.deathday ? (
            <>
              <div className={styles.metricRow}>
                <span className={styles.metricLabel}>Date of Death:</span>
                <span className={styles.metricValue}>{actor.deathday}</span>
              </div>
              <div className={styles.metricRow}>
                <span className={styles.metricLabel}>Age at Death:</span>
                <span className={styles.metricValue}>
                  {actor.ageAtDeath ?? "N/A"}
                </span>
              </div>
            </>
          ) : (
            <div className={styles.metricRow}>
              <span className={styles.metricLabel}>Current Age:</span>
              <span className={styles.metricValue}>
                {actor.currentAge ?? "N/A"}
              </span>
            </div>
          )}
          <div className={styles.metricRow}>
            <span className={styles.metricLabel}>Age at Release:</span>
            <span className={styles.metricValue}>
              {actor.ageAtRelease ?? "N/A"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ActorCard;
