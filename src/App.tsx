import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MovieSearch from "./components/MovieSearch";
import MovieDetails from "./components/MovieDetails"; // New details component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MovieSearch />} />
        <Route path="/movie/:movieId" element={<MovieDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
