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
  console.log('AgeWithBirthTooltip rendering', { age, birthday, hasBirthday: !!birthday });

  if (!birthday) {
    console.log('No birthday, returning plain span');
    return <span>{age}</span>;
  }

  // Just use the working DateWithTooltip component but show age as display text
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
  console.log('ActorMetrics rendering', { 
    actorName: actor.name, 
    currentAge: actor.currentAge, 
    birthday: actor.birthday,
    ageAtDeath: actor.ageAtDeath,
    ageAtRelease: actor.ageAtRelease
  });

  return (
    <div className={`${styles.metrics} ${className || ""}`}>
      {actor.currentAge && (
        <div className={styles.metricRow}>
          <span className={styles.metricLabel}>Current Age</span>
          <span className={styles.metricValue}>
            {actor.birthday ? (
              <DateWithTooltip 
                date={actor.birthday} 
                displayFormat="year" 
                tooltipPrefix="Born on" 
              />
            ) : (
              actor.currentAge
            )}
          </span>
        </div>
      )}
      {actor.deathday && actor.ageAtDeath && (
        <div className={styles.metricRow}>
          <span className={styles.metricLabel}>Age at Death</span>
          <span className={styles.metricValue}>
            <AgeWithBirthTooltip age={actor.ageAtDeath} birthday={actor.birthday} />
          </span>
        </div>
      )}
      {actor.ageAtRelease && (
        <div className={styles.metricRow}>
          <span className={styles.metricLabel}>Age in Movie</span>
          <span className={styles.metricValue}>
            <AgeWithBirthTooltip age={actor.ageAtRelease} birthday={actor.birthday} />
          </span>
        </div>
      )}
    </div>
  );
};
