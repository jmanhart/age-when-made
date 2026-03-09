import React, { useMemo } from "react";
import { Actor } from "../../types/types";
import ActorCard from "../ActorCard/ActorCard";
import YouCard from "../YouCard/YouCard";
import { mapActorToProps } from "./utils";
import { calculateAgeAtDate } from "../../utils/calculateAge";
import SegmentControl from "../SegmentControl/SegmentControl";
import SortCycleButton from "../SortCycleButton/SortCycleButton";
import SettingsMenu from "../SettingsMenu/SettingsMenu";
import styles from "./MovieDetails.module.css";

interface CastContentProps {
  filteredCast: Actor[];
  loadingCast: boolean;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  sortOrder: string;
  setSortOrder: (value: string) => void;
  hideNoImage: boolean;
  setHideNoImage: (value: boolean) => void;
  hideNoBirthDate: boolean;
  setHideNoBirthDate: (value: boolean) => void;
  viewMode: "grid" | "timeline";
  setViewMode: (value: "grid" | "timeline") => void;
  ageMode: "ageAtRelease" | "currentAge";
  setAgeMode: (value: "ageAtRelease" | "currentAge") => void;
  birthDate?: string | null;
  movieReleaseDate?: string;
  totalCast: number;
  actorsAlive: number;
  actorsDeceased: number;
}

const CastContent: React.FC<CastContentProps> = ({
  filteredCast,
  loadingCast,
  statusFilter,
  setStatusFilter,
  sortOrder,
  setSortOrder,
  hideNoImage,
  setHideNoImage,
  hideNoBirthDate,
  setHideNoBirthDate,
  viewMode,
  setViewMode,
  ageMode,
  setAgeMode,
  birthDate,
  movieReleaseDate,
  totalCast,
  actorsAlive,
  actorsDeceased,
}) => {
  const statusSegments = [
    { value: "All", label: "All", count: totalCast },
    { value: "Alive", label: "Alive", count: actorsAlive },
    { value: "Deceased", label: "Dead", count: actorsDeceased },
  ];

  const viewSegments = [
    { value: "grid", label: "Grid" },
    { value: "timeline", label: "Timeline" },
  ];

  const ageModeSegments = [
    { value: "ageAtRelease", label: "Age When Made" },
    { value: "currentAge", label: "Current Age" },
  ];

  const showYouCard = !!birthDate && !!movieReleaseDate && statusFilter !== "Deceased";

  const userCurrentAge = useMemo(() => {
    if (!birthDate) return null;
    return calculateAgeAtDate(birthDate, new Date().toISOString().split("T")[0]);
  }, [birthDate]);

  const youCardIndex = useMemo(() => {
    if (!showYouCard || userCurrentAge === null) return 0;
    if (sortOrder === "none") return 0;

    const idx = filteredCast.findIndex((actor) => {
      const actorAge = actor.currentAge || 0;
      if (sortOrder === "oldest") return userCurrentAge > actorAge;
      if (sortOrder === "youngest") return userCurrentAge < actorAge;
      return false;
    });

    return idx === -1 ? filteredCast.length : idx;
  }, [filteredCast, sortOrder, userCurrentAge, showYouCard]);

  const settingsOptions = [
    {
      id: "hideNoImage",
      label: "Hide Actors Without Images",
      checked: hideNoImage,
      onChange: setHideNoImage,
    },
    {
      id: "hideNoBirthDate",
      label: "Hide Actors Without Birth Dates",
      checked: hideNoBirthDate,
      onChange: setHideNoBirthDate,
    },
  ];

  return (
    <main className={styles.mainContent}>
      {/* Filter and Sort Controls */}
      <div className={styles.filterSortWrapper}>
        <SegmentControl
          segments={statusSegments}
          value={statusFilter}
          onChange={setStatusFilter}
        />

        <SortCycleButton value={sortOrder} onChange={setSortOrder} />

        {/* Timeline toggle hidden for now
        <SegmentControl
          segments={viewSegments}
          value={viewMode}
          onChange={(v) => setViewMode(v as "grid" | "timeline")}
        />

        {viewMode === "timeline" && (
          <SegmentControl
            segments={ageModeSegments}
            value={ageMode}
            onChange={(v) => setAgeMode(v as "ageAtRelease" | "currentAge")}
          />
        )}
        */}

        <SettingsMenu options={settingsOptions} />
      </div>

      {/* Cast View */}
      <div className={styles.castGrid}>
        {loadingCast
          ? Array(8)
              .fill(0)
              .map((_, index) => (
                <div key={index} className={styles.placeholderCastItem}>
                  <div className={styles.placeholderImage}></div>
                  <div className={styles.placeholderText}></div>
                  <div className={styles.placeholderText}></div>
                  <div className={styles.placeholderText}></div>
                </div>
              ))
          : <>
              {filteredCast.map((actor, index) => (
                <React.Fragment key={actor.id}>
                  {showYouCard && index === youCardIndex && (
                    <YouCard birthDate={birthDate!} movieReleaseDate={movieReleaseDate!} />
                  )}
                  <ActorCard actor={mapActorToProps(actor)} />
                </React.Fragment>
              ))}
              {showYouCard && youCardIndex >= filteredCast.length && (
                <YouCard birthDate={birthDate!} movieReleaseDate={movieReleaseDate!} />
              )}
            </>}
      </div>
    </main>
  );
};

export default CastContent;
