import React from "react";
import styles from "./SegmentControl.module.css";

export interface Segment {
  value: string;
  label: string;
  count?: number;
}

interface SegmentControlProps {
  segments: Segment[];
  value: string;
  onChange: (value: string) => void;
}

const SegmentControl: React.FC<SegmentControlProps> = ({
  segments,
  value,
  onChange,
}) => {
  return (
    <div className={styles.segmentControl}>
      {segments.map((segment) => (
        <button
          key={segment.value}
          className={`${styles.segment} ${
            value === segment.value ? styles.segmentActive : ""
          }`}
          onClick={() => onChange(segment.value)}
        >
          {segment.count !== undefined && (
            <span className={styles.count}>{segment.count}</span>
          )}
          {segment.label}
        </button>
      ))}
    </div>
  );
};

export default SegmentControl;
