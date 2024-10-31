import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MovieSearch from "./components/MovieSearch";
import MovieDetails from "./components/MovieDetails"; // New details component
import ActorFilmography from "./components/ActorFilmography";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MovieSearch />} />
        <Route path="/movie/:movieId" element={<MovieDetails />} />
        <Route path="/actor/:actorId" element={<ActorFilmography />} />
      </Routes>
    </Router>
  );
};

export default App;
