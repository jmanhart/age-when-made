import React from "react";
import styles from "./HomePage.module.css";
// import { useNavigate } from "react-router-dom";
import MovieSearch from "../components/MovieSearch/MovieSearch";

const HomePage: React.FC = () => {
  //   const navigate = useNavigate();

  return (
    <div className={styles.homePage}>
      <h1>Age When Made</h1>
      <p>Search for movies, explore actors, and discover filmographies.</p>
      <MovieSearch isHeaderSearch={true} />
    </div>
  );
};

export default HomePage;
