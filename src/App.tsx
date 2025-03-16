import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import "@/styles/theme.css";
import { SentryErrorBoundary } from "@/components/ErrorBoundary";

import Header from "@/components/Header/Header";
import MovieDetails from "@/components/MovieDetails/MovieDetails";
import ActorFilmography from "@/components/ActorFilmography/ActorFilmography";
import HomePage from "@/pages/HomePage";

const App = () => {
  // Set initial theme based on user preference
  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    document.documentElement.setAttribute(
      "data-theme",
      prefersDark ? "dark" : "light"
    );
  }, []);

  return (
    <SentryErrorBoundary>
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
    </SentryErrorBoundary>
  );
};

export default App;
