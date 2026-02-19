import "./App.css";
import "./index.css";
import AppRouter from "./config/Routes.jsx";
import { Toaster } from "sonner";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <UserProvider>
      <div>
        <Toaster position="top-right" richColors />
        <AppRouter />
      </div>
    </UserProvider>
  );
}
export default App;