import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import "./styles/theme.css";
import { SentryErrorBoundary } from "./components/ErrorBoundary";
import { logComponentRender, logPerformance } from "./utils/sentry";

import Header from "./components/header";
import MovieDetails from "./components/MovieDetails";
import ActorFilmography from "./components/ActorFilmography";
import HomePage from "./pages/HomePage";

const App = () => {
  // Log app initialization
  useEffect(() => {
    const startTime = performance.now();
    logComponentRender("App", {
      userAgent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      theme: window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light",
    });

    // Set initial theme based on user preference
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    document.documentElement.setAttribute(
      "data-theme",
      prefersDark ? "dark" : "light"
    );

    const initTime = performance.now() - startTime;
    logPerformance("app_initialization", initTime, {
      theme: prefersDark ? "dark" : "light",
      userAgent: navigator.userAgent,
    });
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
