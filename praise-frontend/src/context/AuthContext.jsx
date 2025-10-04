import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

// Configure axios defaults
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5175";
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on app load
  const checkAuth = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/auth/me");

      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (error) {
      console.log("Not authenticated:", error.response?.data?.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // GitHub OAuth login
  const loginWithGitHub = () => {
    // Redirect to backend GitHub OAuth endpoint
    window.location.href = `${API_URL}/auth/github`;
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      await axios.post("/auth/logout");
      setUser(null);
      setError(null);
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      setError("Logout failed");
      return {
        success: false,
        error: error.response?.data?.message || "Logout failed",
      };
    } finally {
      setLoading(false);
    }
  };

  // Get current user data
  const getCurrentUser = async () => {
    try {
      const response = await axios.get("/auth/me");
      if (response.data.success) {
        setUser(response.data.data);
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error("Get user error:", error);
      setUser(null);
      return null;
    }
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  // Check auth status on component mount
  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    user,
    loading,
    error,
    loginWithGitHub,
    logout,
    getCurrentUser,
    checkAuth,
    clearError,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
