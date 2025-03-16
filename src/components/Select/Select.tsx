import React from "react";
import styles from "./Select.module.css";

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{
    value: string;
    label: string;
  }>;
  variant?: "default" | "primary";
  size?: "small" | "default" | "large";
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  variant = "default",
  size = "default",
  className,
}) => {
  const selectClassName = [
    styles.select,
    variant === "primary" && styles.primary,
    size === "small" && styles.small,
    size === "large" && styles.large,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={selectClassName}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
