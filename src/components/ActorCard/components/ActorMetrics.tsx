import React from "react";
import { ActorProps } from "../types";
import styles from "../ActorCard.module.css";
import { DateWithTooltip } from "../../DateWithTooltip";
import tooltipStyles from "../../DateWithTooltip/DateWithTooltip.module.css";

// Component to show age with birth date tooltip
const AgeWithBirthTooltip: React.FC<{
  age: number;
  birthday?: string;
}> = ({ age, birthday }) => {
  if (!birthday) {
    return <span>{age}</span>;
  }

  return (
    <DateWithTooltip
      date={birthday}
      displayFormat="year"
      tooltipPrefix="Born on"
      customDisplayText={age.toString()}
    />
  );
};

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
          <span className={styles.metricValue}>
            <AgeWithBirthTooltip
              age={actor.currentAge}
              birthday={actor.birthday}
            />
          </span>
        </div>
      )}
      {actor.deathday && actor.ageAtDeath && (
        <div className={styles.metricRow}>
          <span className={styles.metricLabel}>Age at Death</span>
          <span className={styles.metricValue}>
            <AgeWithBirthTooltip
              age={actor.ageAtDeath}
              birthday={actor.birthday}
            />
          </span>
        </div>
      )}
      {actor.ageAtRelease && (
        <div className={styles.metricRow}>
          <span className={styles.metricLabel}>Age in Movie</span>
          <span className={styles.metricValue}>
            <AgeWithBirthTooltip
              age={actor.ageAtRelease}
              birthday={actor.birthday}
            />
          </span>
        </div>
      )}
    </div>
  );
};
