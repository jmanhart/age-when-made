import React from "react";
import styles from "./DateWithTooltip.module.css";

interface DateWithTooltipProps {
  date: string;
  displayFormat?: "year" | "full";
  tooltipPrefix?: string;
  className?: string;
  customDisplayText?: string; // New prop for custom display text
}

export const DateWithTooltip: React.FC<DateWithTooltipProps> = ({
  date,
  displayFormat = "year",
  tooltipPrefix = "",
  className,
  customDisplayText,
}) => {
  const dateObj = new Date(date);
  
  const displayText = customDisplayText || (displayFormat === "year" 
    ? dateObj.getFullYear().toString()
    : dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }));

  const tooltipText = dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <span className={`${styles.dateWithTooltip} ${className || ""}`}>
      {displayText}
      <span className={styles.tooltipText}>
        {tooltipPrefix && `${tooltipPrefix} `}
        {tooltipText}
      </span>
    </span>
  );
};

export default DateWithTooltip;
