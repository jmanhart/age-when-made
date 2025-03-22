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
  const imageUrl = actor.profilePath
    ? actor.profilePath.startsWith("http")
      ? actor.profilePath
      : `https://image.tmdb.org/t/p/w500${actor.profilePath}`
    : "";

  return (
    <Link to={`/actor/${actor.id}`} className={styles.castItem}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`${actor.name}`}
          className={`${styles.actorImage} ${
            actor.deathday ? styles.deceased : ""
          }`}
          loading="lazy"
        />
      ) : (
        <div className={`${styles.actorImage} ${styles.noImage}`}>
          <span>No Image Available</span>
        </div>
      )}
      <div className={styles.actorDetails}>
        <header>
          <h3 className={styles.actorName}>{actor.name}</h3>
          <h4 className={styles.characterName}>{actor.character}</h4>
        </header>

        <div className={styles.metrics}>
          {actor.birthday && (
            <div className={styles.metricRow}>
              <span className={styles.metricLabel}>Birthday</span>
              <span className={styles.metricValue}>{actor.birthday}</span>
            </div>
          )}

          {actor.deathday ? (
            <>
              <div className={styles.metricRow}>
                <span className={styles.metricLabel}>Died</span>
                <span className={styles.metricValue}>{actor.deathday}</span>
              </div>
              {actor.ageAtDeath && (
                <div className={styles.metricRow}>
                  <span className={styles.metricLabel}>Age at Death</span>
                  <span className={styles.metricValue}>{actor.ageAtDeath}</span>
                </div>
              )}
            </>
          ) : (
            actor.currentAge && (
              <div className={styles.metricRow}>
                <span className={styles.metricLabel}>Current Age</span>
                <span className={styles.metricValue}>{actor.currentAge}</span>
              </div>
            )
          )}

          {actor.ageAtRelease && (
            <div className={styles.metricRow}>
              <span className={styles.metricLabel}>Age in Movie</span>
              <span className={styles.metricValue}>{actor.ageAtRelease}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ActorCard;
