import React, { useState } from "react";
import styles from "./SettingsMenu.module.css";

interface SettingsOption {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

interface SettingsMenuProps {
  options: SettingsOption[];
}

const GearIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6.5 1L6.2 2.6C5.8 2.8 5.4 3 5.1 3.3L3.5 2.7L2 5.3L3.3 6.3C3.3 6.5 3.2 6.8 3.2 7C3.2 7.2 3.2 7.5 3.3 7.7L2 8.7L3.5 11.3L5.1 10.7C5.4 11 5.8 11.2 6.2 11.4L6.5 13H9.5L9.8 11.4C10.2 11.2 10.6 11 10.9 10.7L12.5 11.3L14 8.7L12.7 7.7C12.8 7.5 12.8 7.2 12.8 7C12.8 6.8 12.8 6.5 12.7 6.3L14 5.3L12.5 2.7L10.9 3.3C10.6 3 10.2 2.8 9.8 2.6L9.5 1H6.5ZM8 5C9.1 5 10 5.9 10 7C10 8.1 9.1 9 8 9C6.9 9 6 8.1 6 7C6 5.9 6.9 5 8 5Z"
      fill="currentColor"
    />
  </svg>
);

const SettingsMenu: React.FC<SettingsMenuProps> = ({ options }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className={styles.container}>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={styles.button}
        aria-label="Settings"
      >
        <GearIcon />
      </button>

      {isMenuOpen && (
        <div className={styles.menu}>
          {options.map((option) => (
            <label key={option.id} className={styles.menuItem}>
              <input
                type="checkbox"
                checked={option.checked}
                onChange={(e) => option.onChange(e.target.checked)}
                className={styles.checkbox}
              />
              <span className={styles.label}>{option.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default SettingsMenu;
