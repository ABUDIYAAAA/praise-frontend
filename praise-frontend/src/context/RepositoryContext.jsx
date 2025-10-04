import React, { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const RepositoryContext = createContext();

export const useRepository = () => {
  const context = useContext(RepositoryContext);
  if (!context) {
    throw new Error("useRepository must be used within a RepositoryProvider");
  }
  return context;
};

export const RepositoryProvider = ({ children }) => {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRepository, setSelectedRepository] = useState(null);
  const { isAuthenticated } = useAuth();

  // Configure axios defaults
  axios.defaults.withCredentials = true;
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5175";

  // Fetch user's imported repositories
  const fetchRepositories = useCallback(
    async (options = {}) => {
      if (!isAuthenticated) {
        setError("User not authenticated");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { page = 1, limit = 50, search = "", role = null } = options;
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(search && { search }),
          ...(role && { role }),
        });

        const response = await axios.get(
          `${API_BASE_URL}/api/repositories?${params}`
        );

        if (response.data.success) {
          setRepositories(response.data.data.repositories);
          return response.data.data;
        } else {
          throw new Error(
            response.data.message || "Failed to fetch repositories"
          );
        }
      } catch (err) {
        console.error("Error fetching repositories:", err);

        let errorMessage = "Failed to fetch repositories";

        if (err.response?.status === 401) {
          errorMessage = "Authentication required. Please log in again.";
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        }

        setError(errorMessage);
        setRepositories([]);
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, API_BASE_URL]
  );

  // Get repository details
  const getRepositoryDetails = useCallback(
    async (repositoryId) => {
      if (!isAuthenticated) {
        throw new Error("User not authenticated");
      }

      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/repositories/${repositoryId}`
        );

        if (response.data.success) {
          return response.data.data;
        } else {
          throw new Error(
            response.data.message || "Failed to fetch repository details"
          );
        }
      } catch (err) {
        console.error("Error fetching repository details:", err);
        throw err;
      }
    },
    [isAuthenticated, API_BASE_URL]
  );

  // Import repositories
  const importRepositories = useCallback(
    async (repositoryIds) => {
      if (!isAuthenticated) {
        throw new Error("User not authenticated");
      }

      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/repositories/import`,
          {
            repositoryIds,
          }
        );

        if (response.data.success) {
          // Refresh repositories list after import
          await fetchRepositories();
          return response.data.data;
        } else {
          throw new Error(
            response.data.message || "Failed to import repositories"
          );
        }
      } catch (err) {
        console.error("Error importing repositories:", err);
        throw err;
      }
    },
    [isAuthenticated, API_BASE_URL, fetchRepositories]
  );

  // Search repositories
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

  // Filter repositories by role
  const filterByRole = useCallback(
    (role) => {
      if (!role) {
        return repositories;
      }

      return repositories.filter((repo) => repo.userRole === role);
    },
    [repositories]
  );

  // Sort repositories
  const sortRepositories = useCallback((repos, sortBy = "importedAt") => {
    const sortedRepos = [...repos];

    switch (sortBy) {
      case "name":
        return sortedRepos.sort((a, b) => a.name.localeCompare(b.name));
      case "role":
        return sortedRepos.sort((a, b) => {
          // Owners first, then contributors
          if (a.userRole === "owner" && b.userRole === "contributor") return -1;
          if (a.userRole === "contributor" && b.userRole === "owner") return 1;
          return a.name.localeCompare(b.name);
        });
      case "importedAt":
      default:
        return sortedRepos.sort(
          (a, b) => new Date(b.importedAt) - new Date(a.importedAt)
        );
    }
  }, []);

  // Select repository
  const selectRepository = useCallback((repository) => {
    setSelectedRepository(repository);
  }, []);

  // Clear repositories data
  const clearRepositories = useCallback(() => {
    setRepositories([]);
    setSelectedRepository(null);
    setError(null);
  }, []);

  // Refresh repositories data
  const refreshRepositories = useCallback(async () => {
    await fetchRepositories();
  }, [fetchRepositories]);

  // Get repository statistics
  const getRepositoryStats = useCallback(() => {
    if (!repositories.length) return null;

    const stats = {
      total: repositories.length,
      owner: repositories.filter((repo) => repo.userRole === "owner").length,
      contributor: repositories.filter(
        (repo) => repo.userRole === "contributor"
      ).length,
      languages: {},
    };

    repositories.forEach((repo) => {
      if (repo.language) {
        stats.languages[repo.language] =
          (stats.languages[repo.language] || 0) + 1;
      }
    });

    // Sort languages by count
    stats.topLanguages = Object.entries(stats.languages)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([language, count]) => ({ language, count }));

    return stats;
  }, [repositories]);

  const value = {
    repositories,
    loading,
    error,
    selectedRepository,
    fetchRepositories,
    getRepositoryDetails,
    importRepositories,
    searchRepositories,
    filterByRole,
    sortRepositories,
    selectRepository,
    clearRepositories,
    refreshRepositories,
    getRepositoryStats,
  };

  return (
    <RepositoryContext.Provider value={value}>
      {children}
    </RepositoryContext.Provider>
  );
};
