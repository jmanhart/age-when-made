import React from "react";
import styles from "./SortCycleButton.module.css";

const SORT_CYCLE = ["none", "oldest", "youngest"] as const;

interface SortCycleButtonProps {
  value: string;
  onChange: (value: string) => void;
}

const SortCycleButton: React.FC<SortCycleButtonProps> = ({ value, onChange }) => {
  const handleClick = () => {
    const currentIndex = SORT_CYCLE.indexOf(value as typeof SORT_CYCLE[number]);
    const nextIndex = (currentIndex + 1) % SORT_CYCLE.length;
    onChange(SORT_CYCLE[nextIndex]);
  };

  const getIcon = () => {
    if (value === "oldest") return "\u2193"; // ↓
    if (value === "youngest") return "\u2191"; // ↑
    return "\u2195"; // ↕
  };

  const getLabel = () => {
    if (value === "oldest") return "Oldest";
    if (value === "youngest") return "Youngest";
    return "Billing";
  };

  const label = getLabel();
  const isActive = value !== "none";

  return (
    <button
      className={`${styles.button} ${isActive ? styles.active : ""}`}
      onClick={handleClick}
      aria-label={`Sort: ${label}. Click to cycle.`}
      title={label}
    >
      <span className={styles.icon}>{getIcon()}</span>
      <span className={styles.label}>{label}</span>
    </button>
  );
};

export default SortCycleButton;
