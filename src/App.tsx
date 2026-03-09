import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import "./styles/theme.css";
import { SentryErrorBoundary } from "./components/ErrorBoundary";
import { BirthDateProvider } from "./hooks/useBirthDate";

import Header from "./components/header";
import MovieDetails from "./components/MovieDetails";
import ActorFilmography from "./components/ActorFilmography";
import HomePage from "./pages/HomePage";

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
      <BirthDateProvider>
      <Router>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            overscrollBehavior: "none",
          }}
        >
          <Header />
          <main
            style={{
              paddingTop: "calc(var(--header-height) + var(--spacing-4))",
              flex: 1,
              overscrollBehavior: "none",
            }}
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              {/* <Route path="/" element={<MovieSearch />} /> */}
              <Route
                path="/movie/:movieIdentifier"
                element={<MovieDetails />}
              />
              <Route
                path="/actor/:actorIdentifier"
                element={<ActorFilmography />}
              />
            </Routes>
          </main>
        </div>
      </Router>
      </BirthDateProvider>
    </SentryErrorBoundary>
  );
};

export default App;
