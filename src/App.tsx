import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MovieSearch from "./components/MovieSearch";
import Header from "./components/Header/Header";
import MovieDetails from "./components/MovieDetails"; // New details component
import ActorFilmography from "./components/ActorFilmography";

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
