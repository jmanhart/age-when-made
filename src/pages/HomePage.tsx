import React from "react";
import styles from "./HomePage.module.css";
import MovieSearch from "../components/MovieSearch/MovieSearch";
import StatusTag from "../components/StatusTag/StatusTag";
import { logComponentRender } from "../utils/sentry";

const HomePage: React.FC = () => {
  // Log homepage render
  React.useEffect(() => {
    logComponentRender("HomePage", {
      isLandingPage: true,
      hasSearchComponent: true,
    });
  }, []);

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
