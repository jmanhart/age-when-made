import React from "react";
import { ActorProps } from "../types";
import styles from "../ActorCard.module.css";

interface ActorMetricsProps {
  actor: ActorProps;
  variant?: "compact" | "detailed";
  className?: string;
}

export const ActorMetrics: React.FC<ActorMetricsProps> = ({
  actor,
  variant = "default",
  className,
}) => {
  return (
    <div className={`${styles.metrics} ${className || ""}`}>
      {actor.currentAge && (
        <div className={styles.metricRow}>
          <span className={styles.metricLabel}>Current Age</span>
          <span className={styles.metricValue}>{actor.currentAge}</span>
        </div>
      )}
      {actor.deathday && actor.ageAtDeath && (
        <div className={styles.metricRow}>
          <span className={styles.metricLabel}>Age at Death</span>
          <span className={styles.metricValue}>{actor.ageAtDeath}</span>
        </div>
      )}
      {actor.ageAtRelease && (
        <div className={styles.metricRow}>
          <span className={styles.metricLabel}>Age in Movie</span>
          <span className={styles.metricValue}>{actor.ageAtRelease}</span>
        </div>
      )}
    </div>
  );
};
