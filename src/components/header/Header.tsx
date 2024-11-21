import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MovieSearch from "../MovieSearch";
import styles from "./Header.module.css";

const Header: React.FC = () => {
  const location = useLocation();

  // Do not render the header on the root `/` route
  if (location.pathname === "/") {
    return null;
  }

  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/"); // Navigate to the home page
  };
  return (
    <header className={styles.header}>
      <button
        className={styles.backButton}
        onClick={handleBack}
        aria-label="Go Back"
      >
        &#8592; Back
      </button>

      <MovieSearch isHeaderSearch={true} />
    </header>
  );
};

export default Header;
