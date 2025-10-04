import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { GitHubProvider } from "./context/GitHubContext";
import { RepositoryProvider } from "./context/RepositoryContext";
import { BadgeProvider } from "./context/BadgeContext";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import HomePage from "./Pages/HomePage";
import "./App.css";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirect to home if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/home" replace /> : children;
};

function App() {
  return (
    <AuthProvider>
      <GitHubProvider>
        <RepositoryProvider>
          <BadgeProvider>
            <Router>
              <div className="App">
                <Routes>
                  {/* Public routes - redirect to /home if authenticated */}
                  <Route
                    path="/"
                    element={
                      <PublicRoute>
                        <Signup />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/signup"
                    element={
                      <PublicRoute>
                        <Signup />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/login"
                    element={
                      <PublicRoute>
                        <Login />
                      </PublicRoute>
                    }
                  />

                  {/* Protected routes - require authentication */}
                  <Route
                    path="/home"
                    element={
                      <ProtectedRoute>
                        <HomePage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Redirect any unknown routes to home if authenticated, otherwise to login */}
                  <Route path="*" element={<Navigate to="/home" replace />} />
                </Routes>
              </div>
            </Router>
          </BadgeProvider>
        </RepositoryProvider>
      </GitHubProvider>
    </AuthProvider>
  );
}

export default App;
