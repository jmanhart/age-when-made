import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import MovieSearch from "./components/MovieSearch";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div></div>
      <h1>Movie Search App</h1>
      <div className="card">
        <MovieSearch /> {/* MovieSearch component added here */}
      </div>
    </>
  );
}

export default App;
