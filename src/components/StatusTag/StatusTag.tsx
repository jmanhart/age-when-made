import React from "react";
import styles from "./StatusTag.module.css";

// Props interface for the component
interface StatusTagProps {
  // Content
  children?: React.ReactNode; // Optional: custom text override
  icon?: React.ReactNode; // Optional icon (future enhancement)
  iconPosition?: "left" | "right"; // Where to place the icon

  // Cast data (required for automatic status calculation)
  deceasedCount: number; // Number of deceased actors
  totalCount: number; // Total number of actors

  // Styling
  size?: "small" | "medium" | "large"; // Size of the tag
  variant?: "living" | "deceased"; // Whether to display as living or deceased tag

  // Behavior
  clickable?: boolean; // Whether the tag is clickable
  onClick?: () => void; // Click handler (if clickable)
  disabled?: boolean; // Disabled state

  // Accessibility
  ariaLabel?: string; // Screen reader label

  // Custom styling
  className?: string; // Additional CSS classes
  style?: React.CSSProperties; // Inline styles
}

const StatusTag: React.FC<StatusTagProps> = ({
  // Destructure props with defaults
  children,
  icon,
  iconPosition = "left",
  deceasedCount,
  totalCount,
  size = "medium",
  variant,
  clickable = false,
  onClick,
  disabled = false,
  ariaLabel,
  className,
  style,
}) => {
  // Calculate the percentage of deceased actors
  const deceasedPercentage =
    totalCount > 0 ? Math.round((deceasedCount / totalCount) * 100) : 0;

  // Determine the status for styling
  const getStatus = (): "all-deceased" | "partial-deceased" | "all-living" => {
    if (deceasedPercentage === 100) return "all-deceased";
    if (deceasedPercentage === 0) return "all-living";
    return "partial-deceased";
  };

  // Generate rich content for the StatusTag with styled elements
  const getStatusContent = (): React.ReactNode => {
    // If variant is specified, use it to determine content
    if (variant === "living") {
      return (
        <>
          <span className={styles.statusLabel}>Alive</span>
          <span className={styles.countBadge}>{totalCount}</span>
        </>
      );
    }

    if (variant === "deceased") {
      return (
        <>
          <span className={styles.percentage}>💀</span>
          <span className={styles.statusLabel}>Dead</span>
          <span className={styles.countBadge}>{totalCount}</span>
        </>
      );
    }

    // Default behavior for backward compatibility
    if (deceasedPercentage === 100) {
      return (
        <>
          <span className={styles.percentage}>💀</span>
          <span className={styles.statusLabel}>All Dead</span>
          <span className={styles.countBadge}>
            ({deceasedCount}/{totalCount})
          </span>
        </>
      );
    }
    if (deceasedPercentage === 0) {
      return (
        <>
          <span className={styles.statusLabel}>All Alive</span>
          <span className={styles.percentage}>{totalCount}</span>
        </>
      );
    }
    return (
      <>
        <span className={styles.percentage}>{deceasedCount}</span>
        <span className={styles.statusLabel}>Deceased</span>
        <span className={styles.countBadge}>{deceasedPercentage}%</span>
      </>
    );
  };

  // Build the CSS classes dynamically
  const tagClasses = [
    styles.statusTag,
    styles[`status--${getStatus()}`], // Use calculated status
    styles[`size--${size}`],
    clickable && styles.clickable,
    disabled && styles.disabled,
    className,
  ]
    .filter(Boolean) // Remove falsy values
    .join(" ");

  // Handle click events
  const handleClick = (event: React.MouseEvent) => {
    if (disabled || !clickable || !onClick) return;

    event.preventDefault();
    onClick();
  };

  // Handle keyboard events for accessibility
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled || !clickable || !onClick) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };

  // Determine the appropriate HTML element and props
  const TagElement = clickable ? "button" : "span";
  const tagProps = {
    className: tagClasses,
    style,
    ...(clickable && {
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      disabled,
      type: "button" as const,
      "aria-label":
        ariaLabel || (typeof children === "string" ? children : undefined),
      tabIndex: disabled ? -1 : 0,
    }),
  };

  // Render the icon if provided
  const renderIcon = () => {
    if (!icon) return null;

    return (
      <span className={`${styles.icon} ${styles[`icon--${iconPosition}`]}`}>
        {icon}
      </span>
    );
  };

  // Use custom children if provided, otherwise use calculated rich content
  const displayContent = children || getStatusContent();

  return (
    <TagElement {...tagProps}>
      {/* Left icon */}
      {icon && iconPosition === "left" && renderIcon()}

      {/* Main content */}
      <span className={styles.content}>{displayContent}</span>

      {/* Right icon */}
      {icon && iconPosition === "right" && renderIcon()}
    </TagElement>
  );
};

export default StatusTag;
