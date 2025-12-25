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
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/3008bd3e-97f9-4a21-aba7-a942f3f48b31',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'DateWithTooltip.tsx:18',message:'DateWithTooltip render entry',data:{date,displayFormat,tooltipPrefix,customDisplayText,hasClassName:!!className},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A,B'})}).catch(()=>{});
  // #endregion

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

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/3008bd3e-97f9-4a21-aba7-a942f3f48b31',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'DateWithTooltip.tsx:34',message:'DateWithTooltip computed values',data:{displayText,tooltipText,dateWithTooltipClass:styles.dateWithTooltip,tooltipTextClass:styles.tooltipText,finalClassName:`${styles.dateWithTooltip} ${className || ""}`},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A,C,E'})}).catch(()=>{});
  // #endregion

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
