import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import axios from 'axios';
import RecipePage from './pages/RecipePage';
import LoginPage from './pages/LoginPage';
import './App.css';

const AppContent: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null: loading, false: not auth, true: auth
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        await axios.get(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/auth/status`,
          { withCredentials: true },
        );
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuthStatus();
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/auth/logout`,
        {},
        { withCredentials: true },
      );
    } catch (error) {
      console.error('Logout failed on server', error);
    } finally {
      setIsAuthenticated(false);
      navigate('/login');
    }
  };

  // Render a loading state while checking auth status
  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Or a proper spinner component
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="login-container">
          {isAuthenticated && location.pathname === '/' && (
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
              isAuthenticated ? (
                <RecipePage />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
