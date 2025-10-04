import React, { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const BadgeContext = createContext();

export const useBadge = () => {
  const context = useContext(BadgeContext);
  if (!context) {
    throw new Error("useBadge must be used within a BadgeProvider");
  }
  return context;
};

export const BadgeProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unlockedBadges, setUnlockedBadges] = useState([]);
  const [showBadgePopup, setShowBadgePopup] = useState(false);
  const { isAuthenticated } = useAuth();

  // Configure axios defaults
  axios.defaults.withCredentials = true;
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5175";

  // Check and award badges for a repository
  const checkBadges = useCallback(
    async (repositoryId) => {
      if (!isAuthenticated) {
        setError("User not authenticated");
        return { newlyAwarded: [] };
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axios.post(`${API_BASE_URL}/api/badges/check`, {
          repositoryId,
        });

        if (response.data.success) {
          const { newlyAwarded } = response.data.data;

          if (newlyAwarded.length > 0) {
            setUnlockedBadges(newlyAwarded);
            setShowBadgePopup(true);
          }

          return response.data.data;
        } else {
          throw new Error(response.data.message || "Failed to check badges");
        }
      } catch (err) {
        console.error("Error checking badges:", err);

        let errorMessage = "Failed to check badges";

        if (err.response?.status === 401) {
          errorMessage = "Authentication required. Please log in again.";
        } else if (err.response?.status === 404) {
          errorMessage = "Repository not found or access denied.";
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        }

        setError(errorMessage);
        return { newlyAwarded: [] };
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, API_BASE_URL]
  );

  // Get user's badges for a repository
  const getUserBadges = useCallback(
    async (repositoryId) => {
      if (!isAuthenticated) {
        throw new Error("User not authenticated");
      }

      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/badges/repository/${repositoryId}`
        );

        if (response.data.success) {
          return response.data.data;
        } else {
          throw new Error(
            response.data.message || "Failed to fetch user badges"
          );
        }
      } catch (err) {
        console.error("Error fetching user badges:", err);
        throw err;
      }
    },
    [isAuthenticated, API_BASE_URL]
  );

  // Get repository leaderboard
  const getLeaderboard = useCallback(
    async (repositoryId, limit = 10) => {
      if (!isAuthenticated) {
        throw new Error("User not authenticated");
      }

      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/badges/repository/${repositoryId}/leaderboard?limit=${limit}`
        );

        if (response.data.success) {
          return response.data.data;
        } else {
          throw new Error(
            response.data.message || "Failed to fetch leaderboard"
          );
        }
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        throw err;
      }
    },
    [isAuthenticated, API_BASE_URL]
  );

  // Close badge popup
  const closeBadgePopup = useCallback(() => {
    setShowBadgePopup(false);
    setUnlockedBadges([]);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    loading,
    error,
    unlockedBadges,
    showBadgePopup,
    checkBadges,
    getUserBadges,
    getLeaderboard,
    closeBadgePopup,
    clearError,
  };

  return (
    <BadgeContext.Provider value={value}>{children}</BadgeContext.Provider>
  );
};
