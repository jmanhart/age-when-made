import React, { useState, useRef, useEffect } from "react";
import styles from "./DateSelector.module.css";

interface DateSelectorProps {
  selectedDate?: Date;
  onDateChange: (date: Date) => void;
  minYear?: number;
  maxYear?: number;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  showLabels?: boolean;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onDateChange,
  minYear = 1900,
  maxYear = new Date().getFullYear(),
  placeholder = "Select date...",
  disabled = false,
  className,
  showLabels = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"day" | "month" | "year">("day");
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Generate arrays for each selector
  const years = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => maxYear - i
  );

  const months = [
    { value: 0, label: "January" },
    { value: 1, label: "February" },
    { value: 2, label: "March" },
    { value: 3, label: "April" },
    { value: 4, label: "May" },
    { value: 5, label: "June" },
    { value: 6, label: "July" },
    { value: 7, label: "August" },
    { value: 8, label: "September" },
    { value: 9, label: "October" },
    { value: 10, label: "November" },
    { value: 11, label: "December" },
  ];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getDaysArray = () => {
    if (!selectedDate) return [];
    const daysInMonth = getDaysInMonth(
      selectedDate.getFullYear(),
      selectedDate.getMonth()
    );
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  // Filter based on active tab and search
  const getFilteredItems = () => {
    if (activeTab === "year") {
      return years.filter((year) => year.toString().includes(searchTerm));
    } else if (activeTab === "month") {
      return months.filter((month) =>
        month.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      return getDaysArray().filter((day) =>
        day.toString().includes(searchTerm)
      );
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
        setActiveTab("day");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleItemSelect = (value: number) => {
    if (!selectedDate) {
      // Create new date if none exists
      const newDate = new Date();
      newDate.setFullYear(activeTab === "year" ? value : newDate.getFullYear());
      newDate.setMonth(activeTab === "month" ? value : newDate.getMonth());
      newDate.setDate(activeTab === "day" ? value : newDate.getDate());
      onDateChange(newDate);
    } else {
      // Update existing date
      const newDate = new Date(selectedDate);
      if (activeTab === "year") {
        newDate.setFullYear(value);
      } else if (activeTab === "month") {
        newDate.setMonth(value);
      } else {
        newDate.setDate(value);
      }
      onDateChange(newDate);
    }

    // Move to next tab or close if done
    if (activeTab === "day") {
      setActiveTab("month");
    } else if (activeTab === "month") {
      setActiveTab("year");
    } else {
      setIsOpen(false);
      setSearchTerm("");
      setActiveTab("day");
    }
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchTerm("");
        setActiveTab("day");
      }
    }
  };

  const formatDisplayDate = () => {
    if (!selectedDate) return placeholder;

    const day = selectedDate.getDate();
    const month = months[selectedDate.getMonth()].label;
    const year = selectedDate.getFullYear();

    return `${day} ${month} ${year}`;
  };

  const getTabLabel = () => {
    switch (activeTab) {
      case "day":
        return "Select Day";
      case "month":
        return "Select Month";
      case "year":
        return "Select Year";
      default:
        return "Select Date";
    }
  };

  const getSearchPlaceholder = () => {
    switch (activeTab) {
      case "day":
        return "Search days...";
      case "month":
        return "Search months...";
      case "year":
        return "Search years...";
      default:
        return "Search...";
    }
  };

  return (
    <div
      className={`${styles.dateSelector} ${className || ""}`}
      ref={dropdownRef}
    >
      <button
        type="button"
        className={`${styles.trigger} ${isOpen ? styles.open : ""}`}
        onClick={handleToggle}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={styles.selectedValue}>{formatDisplayDate()}</span>
        <span className={styles.arrow}>▼</span>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.tabContainer}>
            <button
              type="button"
              className={`${styles.tab} ${
                activeTab === "day" ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab("day")}
            >
              Day
            </button>
            <button
              type="button"
              className={`${styles.tab} ${
                activeTab === "month" ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab("month")}
            >
              Month
            </button>
            <button
              type="button"
              className={`${styles.tab} ${
                activeTab === "year" ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab("year")}
            >
              Year
            </button>
          </div>

          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder={getSearchPlaceholder()}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
              autoFocus
            />
          </div>

          <div className={styles.itemList} role="listbox">
            {getFilteredItems().length > 0 ? (
              getFilteredItems().map((item) => {
                const value = typeof item === "number" ? item : item.value;
                const label = typeof item === "number" ? item : item.label;
                const isSelected =
                  selectedDate &&
                  ((activeTab === "day" && selectedDate.getDate() === value) ||
                    (activeTab === "month" &&
                      selectedDate.getMonth() === value) ||
                    (activeTab === "year" &&
                      selectedDate.getFullYear() === value));

                return (
                  <button
                    key={value}
                    type="button"
                    className={`${styles.itemOption} ${
                      isSelected ? styles.selected : ""
                    }`}
                    onClick={() => handleItemSelect(value)}
                    role="option"
                    aria-selected={isSelected}
                  >
                    {label}
                  </button>
                );
              })
            ) : (
              <div className={styles.noResults}>No items found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateSelector;
