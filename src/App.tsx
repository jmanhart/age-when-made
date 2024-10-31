import "./styles/global.css";
import MovieSearch from "./components/MovieSearch";

function App() {
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
