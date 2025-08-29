import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MovieSearch from "../MovieSearch/MovieSearch";
import Button from "../Button/Button";
import styles from "./Header.module.css";

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Do not render the header on the root `/` route
  if (location.pathname === "/") {
    return null;
  }

  const handleBack = () => {
    navigate(-1); // Always go back to previous page
  };

  return (
    <header className={styles.header}>
      <Button variant="secondary" onClick={handleBack}>
        &#8592; Back
      </Button>
      <MovieSearch isHeaderSearch={true} />
    </header>
  );
};

export default Header;
