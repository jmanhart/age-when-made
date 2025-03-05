import React from "react";
import styles from "./HomePage.module.css";
// import { useNavigate } from "react-router-dom";
import MovieSearch from "../components/MovieSearch/MovieSearch";

const HomePage: React.FC = () => {
  //   const navigate = useNavigate();

  return (
    <div className={styles.homePage}>
      <h1>age-when-made.com</h1>
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
