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
            <button onClick={handleLogout} className="pill-button logout">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              <span>ログアウト</span>
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
