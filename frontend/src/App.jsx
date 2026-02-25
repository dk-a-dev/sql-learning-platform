import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuthStore } from './stores';
import Dashboard from './pages/Dashboard/Dashboard';
import Workspace from './pages/Workspace/Workspace';
import Login from './pages/Auth/Login';
import { Database, LogOut } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  const { isAuthenticated, logout } = useAuthStore();

  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <Link to="/" className="brand-logo">
            <div className="icon-container">
              <Database size={18} />
            </div>
            CipherSQL
          </Link>
          <nav>
            {isAuthenticated ? (
              <button className="btn-logout" onClick={logout} title="Logout">
                <LogOut size={18} />
              </button>
            ) : (
              <Link to="/login" className="nav-link">
                Sign In
              </Link>
            )}
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route
              path="/workspace/:id"
              element={
                <ProtectedRoute>
                  <Workspace />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
