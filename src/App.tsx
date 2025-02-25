import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/header/Header.tsx";
import MovieDetails from "./components/MovieDetails/MovieDetails.tsx"; // New details component
import ActorFilmography from "./components/ActorFilmography/ActorFilmography.tsx";

import HomePage from "./pages/HomePage";
const App = () => {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/" element={<MovieSearch />} /> */}
          <Route path="/movie/:movieId" element={<MovieDetails />} />
          <Route path="/actor/:actorId" element={<ActorFilmography />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
