import React, { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const GitHubContext = createContext();

export const useGitHub = () => {
  const context = useContext(GitHubContext);
  if (!context) {
    throw new Error("useGitHub must be used within a GitHubProvider");
  }
  return context;
};

export const GitHubProvider = ({ children }) => {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  // Configure axios defaults
  axios.defaults.withCredentials = true;
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // Fetch user's repositories from GitHub
  const fetchRepositories = useCallback(async () => {
    if (!isAuthenticated) {
      setError("User not authenticated");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/github/repositories`);

      if (response.data.success) {
        setRepositories(response.data.data.repositories);
      } else {
        throw new Error(
          response.data.message || "Failed to fetch repositories"
        );
      }
    } catch (err) {
      console.error("Error fetching repositories:", err);

      let errorMessage = "Failed to fetch repositories";

      if (err.response?.status === 401) {
        errorMessage =
          "GitHub access token is invalid or expired. Please re-authenticate.";
      } else if (err.response?.status === 400) {
        errorMessage =
          "GitHub access token not found. Please authenticate with GitHub.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, API_BASE_URL]);

  // Search repositories by name or description
  const searchRepositories = useCallback(
    (searchTerm) => {
      if (!searchTerm.trim()) {
        return repositories;
      }

      return repositories.filter(
        (repo) =>
          repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (repo.description &&
            repo.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          repo.language?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    },
    [repositories]
  );

  // Filter repositories by various criteria
  const filterRepositories = useCallback(
    (filters = {}) => {
      let filtered = [...repositories];

      if (filters.language) {
        filtered = filtered.filter(
          (repo) =>
            repo.language?.toLowerCase() === filters.language.toLowerCase()
        );
      }

      if (filters.visibility === "public") {
        filtered = filtered.filter((repo) => !repo.private);
      } else if (filters.visibility === "private") {
        filtered = filtered.filter((repo) => repo.private);
      }

      if (filters.hasDescription !== undefined) {
        if (filters.hasDescription) {
          filtered = filtered.filter(
            (repo) => repo.description && repo.description.trim()
          );
        } else {
          filtered = filtered.filter(
            (repo) => !repo.description || !repo.description.trim()
          );
        }
      }

      return filtered;
    },
    [repositories]
  );

  // Sort repositories by various criteria
  const sortRepositories = useCallback((repos, sortBy = "updated") => {
    const sortedRepos = [...repos];

    switch (sortBy) {
      case "name":
        return sortedRepos.sort((a, b) => a.name.localeCompare(b.name));
      case "stars":
        return sortedRepos.sort(
          (a, b) => b.stargazersCount - a.stargazersCount
        );
      case "forks":
        return sortedRepos.sort((a, b) => b.forksCount - a.forksCount);
      case "created":
        return sortedRepos.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "updated":
      default:
        return sortedRepos.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
    }
  }, []);

  // Get repository statistics
  const getRepositoryStats = useCallback(() => {
    if (!repositories.length) return null;

    const stats = {
      total: repositories.length,
      public: repositories.filter((repo) => !repo.private).length,
      private: repositories.filter((repo) => repo.private).length,
      languages: {},
      totalStars: 0,
      totalForks: 0,
    };

    repositories.forEach((repo) => {
      if (repo.language) {
        stats.languages[repo.language] =
          (stats.languages[repo.language] || 0) + 1;
      }
      stats.totalStars += repo.stargazersCount || 0;
      stats.totalForks += repo.forksCount || 0;
    });

    // Sort languages by count
    stats.topLanguages = Object.entries(stats.languages)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([language, count]) => ({ language, count }));

    return stats;
  }, [repositories]);

  // Clear repositories data
  const clearRepositories = useCallback(() => {
    setRepositories([]);
    setError(null);
  }, []);

  // Refresh repositories data
  const refreshRepositories = useCallback(async () => {
    await fetchRepositories();
  }, [fetchRepositories]);

  const value = {
    repositories,
    loading,
    error,
    fetchRepositories,
    searchRepositories,
    filterRepositories,
    sortRepositories,
    getRepositoryStats,
    clearRepositories,
    refreshRepositories,
  };

  return (
    <GitHubContext.Provider value={value}>{children}</GitHubContext.Provider>
  );
};
