import React from "react";
import { Actor } from "../../types/types";
import ActorCard from "../ActorCard/ActorCard";
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
        </div>

        <div>
          <SettingsMenu options={settingsOptions} />
        </div>
      </div>

      {/* Cast Grid */}
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
                actor={{
                  id: actor.id,
                  name: actor.name,
                  character: actor.character,
                  profilePath: actor.profile_path || undefined,
                  birthday: actor.birthday || undefined,
                  deathday: actor.deathday || undefined,
                  currentAge: actor.currentAge || undefined,
                  ageAtDeath: actor.ageAtDeath || undefined,
                  ageAtRelease: actor.ageAtRelease || undefined,
                }}
              />
            ))}
      </div>
    </main>
  );
};

export default CastContent;

