import { Footer } from "./components";
import { RootRouter } from "./routes";

function App() {
  return (
    <div className="p-10">
      <RootRouter />
      <Footer />
    </div>
  );
}

export default App;
