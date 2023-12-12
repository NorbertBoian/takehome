import "./App.css";
import { SearchBar } from "./components/SearchBar";

function App() {
  return (
    <div style={{ width: "clamp(20rem, 50vw, 50rem)" }}>
      <SearchBar />
    </div>
  );
}

export default App;
