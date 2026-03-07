import React, { useMemo } from "react";
import { Actor } from "../../types/types";
import ActorCard from "../ActorCard/ActorCard";
import { mapActorToProps } from "../MovieDetails/utils";
import styles from "./CastTimeline.module.css";

interface CastTimelineProps {
  filteredCast: Actor[];
  ageMode: "ageAtRelease" | "currentAge";
  sortOrder: string;
}

interface AgeGroup {
  age: number | null;
  actors: Actor[];
}

const CastTimeline: React.FC<CastTimelineProps> = ({
  filteredCast,
  ageMode,
  sortOrder,
}) => {
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

    for (const age of sortedAges) {
      groups.push({ age: age as number, actors: grouped.get(age)! });
    }

    // Unknown at the bottom
    if (unknownGroup && unknownGroup.length > 0) {
      groups.push({ age: null, actors: unknownGroup });
    }

    return groups;
  }, [filteredCast, ageMode, sortOrder]);

  if (ageGroups.length === 0) {
    return (
      <div className={styles.emptyState}>
        No actors to display in timeline view.
      </div>
    );
  }

  return (
    <div className={styles.timeline}>
      {ageGroups.map((group) => (
        <div
          key={group.age != null ? group.age : "unknown"}
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
