import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import RecipePage from "./pages/RecipePage";
import LoginPage from "./pages/LoginPage";
import "./App.css";

// A wrapper component to include the header and logout logic
const AppContent: React.FC = () => {
  // Centralized state for the ID token
  const [idToken, setIdToken] = useState<string | null>(
    localStorage.getItem("idToken")
  );
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginSuccess = (token: string) => {
    localStorage.setItem("idToken", token);
    setIdToken(token);
  };

  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem("idToken");
    setIdToken(null);
    navigate("/login");
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="login-container">
          {/* Show logout button only on the main page when logged in */}
          {idToken && location.pathname === "/" && (
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          )}
        </div>
      </header>
      <main>
        <Routes>
          <Route
            path="/login"
            element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
          />
          <Route
            path="/"
            element={
              idToken ? (
                <RecipePage idToken={idToken} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          {/* Redirect any other path to the main page or login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

// Main App component sets up the router
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
