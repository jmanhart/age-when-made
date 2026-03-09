import React, { useRef } from "react";
import styles from "./BirthDatePicker.module.css";

interface BirthDatePickerProps {
  birthDate: string | null;
  onChange: (date: string | null) => void;
  onClear: () => void;
}

const BirthDatePicker: React.FC<BirthDatePickerProps> = ({
  birthDate,
  onChange,
  onClear,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClear();
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className={styles.container}>
      <label className={styles.label} htmlFor="birth-date-picker">
        Your Birthday
      </label>
      <div className={styles.inputWrapper}>
        <input
          ref={inputRef}
          id="birth-date-picker"
          type="date"
          className={styles.dateInput}
          value={birthDate || ""}
          onChange={(e) => onChange(e.target.value || null)}
          aria-label="Your birth date"
          max={new Date().toISOString().split("T")[0]}
        />
        {birthDate && (
          <button
            className={styles.clearIcon}
            onClick={handleClear}
            aria-label="Clear birth date"
            type="button"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 3L3 11M3 3L11 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default BirthDatePicker;
