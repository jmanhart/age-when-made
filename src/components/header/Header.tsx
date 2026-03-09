import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MovieSearch from "../MovieSearch/MovieSearch";
import BirthDatePicker from "../BirthDatePicker/BirthDatePicker";
import styles from "./Header.module.css";
import { useBirthDate } from "../../hooks/useBirthDate";

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { birthDate, setBirthDate, clearBirthDate } = useBirthDate();

  // Do not render the header on the root `/` route
  if (location.pathname === "/") {
    return null;
  }

  return (
    <header className={styles.header}>
      <span
        className={styles.logo}
        onClick={() => navigate("/")}
        role="link"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            navigate("/");
          }
        }}
      >
        AWM
      </span>
      <MovieSearch isHeaderSearch={true} />
      <BirthDatePicker
        birthDate={birthDate}
        onChange={setBirthDate}
        onClear={clearBirthDate}
      />
    </header>
  );
};

export default Header;
