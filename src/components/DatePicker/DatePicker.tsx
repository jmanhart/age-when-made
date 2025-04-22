import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./DatePicker.module.css";

interface DatePickerProps {
  value: string | null;
  onChange: (date: string | null) => void;
  className?: string;
  minAge?: number;
  maxAge?: number;
  placeholder?: string;
}

const BirthDatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  className,
  minAge = 0,
  maxAge = 120,
  placeholder = "Select birth date",
}) => {
  const currentDate = new Date();
  const minDate = new Date();
  minDate.setFullYear(currentDate.getFullYear() - maxAge);

  const maxDate = new Date();
  maxDate.setFullYear(currentDate.getFullYear() - minAge);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      onChange(`${year}-${month}-${day}`);
    } else {
      onChange(null);
    }
  };

  const selectedDate = value ? new Date(value) : null;

  return (
    <div className={`${styles.container} ${className || ""}`}>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        minDate={minDate}
        maxDate={maxDate}
        placeholderText={placeholder}
        dateFormat="yyyy-MM-dd"
        showYearDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={maxAge - minAge + 1}
        className={styles.datePicker}
        popperClassName={styles.popper}
      />
    </div>
  );
};

export default BirthDatePicker;
