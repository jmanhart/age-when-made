import React from "react";
import styles from "./HomePage.module.css";
import MovieSearch from "../components/MovieSearch/MovieSearch";
import StatusTag from "../components/StatusTag/StatusTag";

const HomePage: React.FC = () => {
  return (
    <div className={styles.homePage}>
      <h1>age-when-made</h1>
      <p>
        Have you ever wondered how old an actor was when they made a certain
        movie? <br />
        Well this app will help! <br />
        (This is still a work in progress so be kind :D )
      </p>
      <MovieSearch isHeaderSearch={true} />
    </div>
  );
};

export default HomePage;
