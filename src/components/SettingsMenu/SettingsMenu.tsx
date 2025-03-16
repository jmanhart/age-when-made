import React, { useState } from "react";
import styles from "./SettingsMenu.module.css";
import SliderIcon from "../../assets/icons/sliderIcon";

interface SettingsOption {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

interface SettingsMenuProps {
  options: SettingsOption[];
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ options }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className={styles.container}>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={styles.button}
        aria-label="Settings"
      >
        <SliderIcon className={styles.icon} />
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
