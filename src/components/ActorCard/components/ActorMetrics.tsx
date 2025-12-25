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
  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/3008bd3e-97f9-4a21-aba7-a942f3f48b31", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "ActorMetrics.tsx:12",
      message: "AgeWithBirthTooltip entry",
      data: {
        age,
        birthday,
        hasBirthday: !!birthday,
        ageString: age.toString(),
      },
      timestamp: Date.now(),
      sessionId: "debug-session",
      hypothesisId: "B,E",
    }),
  }).catch(() => {});
  // #endregion

  if (!birthday) {
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/3008bd3e-97f9-4a21-aba7-a942f3f48b31", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "ActorMetrics.tsx:17",
        message: "No birthday - returning plain span",
        data: { age },
        timestamp: Date.now(),
        sessionId: "debug-session",
        hypothesisId: "B",
      }),
    }).catch(() => {});
    // #endregion
    return <span>{age}</span>;
  }

  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/3008bd3e-97f9-4a21-aba7-a942f3f48b31", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "ActorMetrics.tsx:24",
      message: "Rendering DateWithTooltip with customDisplayText",
      data: { birthday, age, customDisplayText: age.toString() },
      timestamp: Date.now(),
      sessionId: "debug-session",
      hypothesisId: "A,E",
    }),
  }).catch(() => {});
  // #endregion

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
  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/3008bd3e-97f9-4a21-aba7-a942f3f48b31", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "ActorMetrics.tsx:48",
      message: "ActorMetrics render entry",
      data: {
        actorName: actor.name,
        currentAge: actor.currentAge,
        birthday: actor.birthday,
        ageAtDeath: actor.ageAtDeath,
        ageAtRelease: actor.ageAtRelease,
        variant,
        className,
      },
      timestamp: Date.now(),
      sessionId: "debug-session",
      hypothesisId: "B",
    }),
  }).catch(() => {});
  // #endregion

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
