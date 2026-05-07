import { useAuth } from "../context/AuthContext.tsx";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-8">
        <h1
          className="text-xl font-bold text-blue-600 cursor-pointer"
          onClick={() => navigate("/")}
        >
          PropFlow
        </h1>
        {user?.role === "Agent" && (
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm text-gray-600 hover:text-blue-600"
          >
            Agent Dashboard
          </button>
        )}
        <button
          onClick={() => navigate("/")}
          className="text-sm text-gray-600 hover:text-blue-600"
        >
          Listings
        </button>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">
          {user?.fullName} · <span className="text-blue-500">{user?.role}</span>
        </span>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
