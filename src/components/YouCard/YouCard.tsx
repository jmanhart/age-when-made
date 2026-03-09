import React from "react";
import { calculateAgeAtDate } from "../../utils/calculateAge";
import styles from "./YouCard.module.css";

interface YouCardProps {
  birthDate: string;
  movieReleaseDate: string;
  variant?: "default" | "compact";
}

const YouCard: React.FC<YouCardProps> = ({
  birthDate,
  movieReleaseDate,
  variant = "default",
}) => {
  const ageAtRelease = calculateAgeAtDate(birthDate, movieReleaseDate);
  const currentAge = calculateAgeAtDate(
    birthDate,
    new Date().toISOString().split("T")[0]
  );
  const bornAfterMovie = ageAtRelease !== null && ageAtRelease < 0;

  const isCompact = variant === "compact";
  const cardClassName = `${styles.card}${isCompact ? ` ${styles["card--compact"]}` : ""}`;
  const avatarClassName = `${styles.avatarPlaceholder}${isCompact ? ` ${styles["avatarPlaceholder--compact"]}` : ""}`;

  return (
    <div className={cardClassName}>
      <div className={avatarClassName}>You</div>
      <div className={styles.details}>
        <h3 className={styles.name}>You</h3>
        <div className={styles.metrics}>
          {currentAge !== null && (
            <div className={styles.metricRow}>
              <span className={styles.metricLabel}>Current Age</span>
              <span className={styles.metricValue}>{currentAge}</span>
            </div>
          )}
          {bornAfterMovie ? (
            <p className={styles.olderNote}>
              Movie is {Math.abs(ageAtRelease)} year
              {Math.abs(ageAtRelease) !== 1 ? "s" : ""} older than you
            </p>
          ) : (
            ageAtRelease !== null && (
              <div className={styles.metricRow}>
                <span className={styles.metricLabel}>Age in Movie</span>
                <span className={styles.metricValue}>{ageAtRelease}</span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default YouCard;
