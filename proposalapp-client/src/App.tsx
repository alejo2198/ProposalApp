import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ListingsPage from "./pages/ListingsPage";
import AgentDashboard from "./pages/AgentDashboard";
import Navbar from "./components/Navbar";

function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Navbar />}
      <Routes>
        <Route
          path="/login"
          element={!user ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!user ? <RegisterPage /> : <Navigate to="/" />}
        />
        <Route
          path="/"
          element={user ? <ListingsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/dashboard"
          element={
            user?.role === "Agent" ? <AgentDashboard /> : <Navigate to="/" />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
