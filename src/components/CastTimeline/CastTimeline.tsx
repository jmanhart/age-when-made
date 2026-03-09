import React, { useMemo } from "react";
import { Actor } from "../../types/types";
import ActorCard from "../ActorCard/ActorCard";
import YouCard from "../YouCard/YouCard";
import { mapActorToProps } from "../MovieDetails/utils";
import { calculateAgeAtDate } from "../../utils/calculateAge";
import styles from "./CastTimeline.module.css";

interface CastTimelineProps {
  filteredCast: Actor[];
  ageMode: "ageAtRelease" | "currentAge";
  sortOrder: string;
  birthDate?: string | null;
  movieReleaseDate?: string;
}

interface AgeGroup {
  age: number | null;
  actors: Actor[];
  hasYouCard?: boolean;
}

const CastTimeline: React.FC<CastTimelineProps> = ({
  filteredCast,
  ageMode,
  sortOrder,
  birthDate,
  movieReleaseDate,
}) => {
  const userAge = useMemo(() => {
    if (!birthDate || !movieReleaseDate) return null;
    if (ageMode === "currentAge") {
      return calculateAgeAtDate(birthDate, new Date().toISOString().split("T")[0]);
    }
    return calculateAgeAtDate(birthDate, movieReleaseDate);
  }, [birthDate, movieReleaseDate, ageMode]);

  const ageGroups = useMemo(() => {
    const grouped = new Map<number | null, Actor[]>();

    for (const actor of filteredCast) {
      let age: number | undefined | null;
      if (ageMode === "currentAge") {
        age = actor.deathday ? actor.ageAtDeath : actor.currentAge;
      } else {
        age = actor.ageAtRelease;
      }
      const key = age != null ? Math.floor(age) : null;

      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(actor);
    }

    const groups: AgeGroup[] = [];
    const unknownGroup = grouped.get(null);
    grouped.delete(null);

    // Sort numeric ages based on sort order
    const sortedAges = Array.from(grouped.keys()).sort((a, b) =>
      sortOrder === "youngest"
        ? (a as number) - (b as number)
        : (b as number) - (a as number)
    );

    // Track whether we've inserted the You card
    let youCardInserted = false;
    const userAgeKey = userAge != null && userAge >= 0 ? Math.floor(userAge) : null;

    for (const age of sortedAges) {
      const group: AgeGroup = { age: age as number, actors: grouped.get(age)! };

      // Insert You card into the matching age group
      if (userAgeKey !== null && age === userAgeKey) {
        group.hasYouCard = true;
        youCardInserted = true;
      }

      groups.push(group);
    }

    // If user has a valid age but no matching group exists, create one
    if (userAgeKey !== null && !youCardInserted && birthDate && movieReleaseDate) {
      const youGroup: AgeGroup = { age: userAgeKey, actors: [], hasYouCard: true };
      // Insert in sorted position
      const insertIdx = groups.findIndex((g) =>
        g.age !== null
          ? sortOrder === "youngest"
            ? g.age > userAgeKey
            : g.age < userAgeKey
          : true
      );
      if (insertIdx === -1) {
        groups.push(youGroup);
      } else {
        groups.splice(insertIdx, 0, youGroup);
      }
    }

    // Unknown at the bottom
    if (unknownGroup && unknownGroup.length > 0) {
      groups.push({ age: null, actors: unknownGroup });
    }

    // If user was born after movie (negative age), show at top/bottom
    if (userAge !== null && userAge < 0 && birthDate && movieReleaseDate) {
      const bornAfterGroup: AgeGroup = { age: null, actors: [], hasYouCard: true };
      groups.unshift(bornAfterGroup);
    }

    return groups;
  }, [filteredCast, ageMode, sortOrder, userAge, birthDate, movieReleaseDate]);

  if (ageGroups.length === 0) {
    return (
      <div className={styles.emptyState}>
        No actors to display in timeline view.
      </div>
    );
  }

  return (
    <div className={styles.timeline}>
      {ageGroups.map((group, idx) => (
        <div
          key={group.age != null ? group.age : `unknown-${idx}`}
          className={styles.ageGroup}
        >
          <div className={styles.ageMarker}>
            {group.age != null ? (
              group.age
            ) : (
              <span className={styles.unknownLabel}>?</span>
            )}
          </div>
          <div className={styles.actorsRow}>
            {group.hasYouCard && birthDate && movieReleaseDate && (
              <YouCard
                birthDate={birthDate}
                movieReleaseDate={movieReleaseDate}
                variant="compact"
              />
            )}
            {group.actors.map((actor) => (
              <ActorCard
                key={actor.id}
                actor={mapActorToProps(actor)}
                variant="compact"
                imageSize="small"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CastTimeline;
