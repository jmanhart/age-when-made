import React from "react";
import { Actor } from "../../types/types";
import ActorCard from "../ActorCard/ActorCard";
import { CastTimeline } from "../CastTimeline";
import { mapActorToProps } from "./utils";
import Select from "../Select/Select";
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
}) => {
  const statusOptions = [
    { value: "All", label: "All" },
    { value: "Alive", label: "Alive" },
    { value: "Deceased", label: "Deceased" },
  ];

  const sortOptions = [
    { value: "none", label: "No Sort" },
    { value: "oldest", label: "Oldest" },
    { value: "youngest", label: "Youngest" },
  ];

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
      <div className={styles.filterSortContainer}>
        <div className={styles.filterSortWrapper}>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusOptions}
            className={styles.statusFilter}
          />

          <Select
            value={sortOrder}
            onChange={setSortOrder}
            options={sortOptions}
            className={styles.sortOrder}
          />

          {/* View Toggle */}
          <div className={styles.viewToggles}>
            <button
              className={`${styles.viewToggleButton} ${
                viewMode === "grid" ? styles.viewToggleActive : ""
              }`}
              onClick={() => setViewMode("grid")}
            >
              Grid
            </button>
            <button
              className={`${styles.viewToggleButton} ${
                viewMode === "timeline" ? styles.viewToggleActive : ""
              }`}
              onClick={() => setViewMode("timeline")}
            >
              Timeline
            </button>
          </div>

          {/* Age Mode Toggle (only in timeline view) */}
          {viewMode === "timeline" && (
            <div className={styles.ageToggles}>
              <button
                className={`${styles.viewToggleButton} ${
                  ageMode === "ageAtRelease" ? styles.viewToggleActive : ""
                }`}
                onClick={() => setAgeMode("ageAtRelease")}
              >
                Age When Made
              </button>
              <button
                className={`${styles.viewToggleButton} ${
                  ageMode === "currentAge" ? styles.viewToggleActive : ""
                }`}
                onClick={() => setAgeMode("currentAge")}
              >
                Current Age
              </button>
            </div>
          )}
        </div>

        <div>
          <SettingsMenu options={settingsOptions} />
        </div>
      </div>

      {/* Cast View */}
      {viewMode === "grid" ? (
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
            : filteredCast.map((actor) => (
                <ActorCard
                  key={actor.id}
                  actor={mapActorToProps(actor)}
                />
              ))}
        </div>
      ) : (
        <CastTimeline filteredCast={filteredCast} ageMode={ageMode} sortOrder={sortOrder} />
      )}
    </main>
  );
};

export default CastContent;
