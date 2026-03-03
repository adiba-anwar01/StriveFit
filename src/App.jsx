import "./App.css";
import "./index.css";
import AppRouter from "./config/Routes.jsx";
import { Toaster } from "sonner";

function App() {
  return (
    <div>
      <Toaster position="top-right" richColors />
      <AppRouter />
    </div>
  );
}
export default App;
