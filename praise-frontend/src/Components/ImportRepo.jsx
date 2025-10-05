import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  ChevronDown,
  Lock,
  Star,
  GitFork,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useGitHub } from "../context/GitHubContext";
import { useRepository } from "../context/RepositoryContext";
import { useAuth } from "../context/AuthContext";

const ImportRepo = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("updated");
  const [importingRepos, setImportingRepos] = useState(new Set());

  const { user } = useAuth();
  const {
    repositories,
    loading,
    error,
    fetchRepositories,
    searchRepositories,
    sortRepositories,
    refreshRepositories,
  } = useGitHub();

  const { importRepositories, refreshRepositories: refreshImportedRepos } =
    useRepository();

  // Fetch repositories when component mounts
  useEffect(() => {
    if (repositories.length === 0) {
      fetchRepositories();
    }
  }, [fetchRepositories, repositories.length]);

  // Filter and sort repositories based on search term (now showing all repos, not just owned)
  const filteredAndSortedRepos = useMemo(() => {
    const searched = searchRepositories(searchTerm);
    return sortRepositories(searched, sortBy);
  }, [repositories, searchTerm, sortBy, searchRepositories, sortRepositories]);

  // Handle repository import
  const handleImport = async (repo) => {
    setImportingRepos((prev) => new Set(prev).add(repo.id));

    try {
      console.log("Importing repository:", repo.fullName);

      // Import repository using the RepositoryContext
      const importData = await importRepositories([repo.id]);

      // Show success message
      let message = `Repository "${repo.name}" imported successfully!`;

      if (importData.badgesCreated > 0) {
        message += ` ${importData.badgesCreated} badges created.`;
      }

      if (importData.imported && importData.imported.length > 0) {
        const importedRepo = importData.imported[0];
        message += ` Role: ${importedRepo.role}`;
      }

      alert(message);

      // Refresh imported repositories list
      await refreshImportedRepos();
    } catch (error) {
      console.error("Import failed:", error);
      alert(`Failed to import repository: ${error.message}`);
    } finally {
      setImportingRepos((prev) => {
        const updated = new Set(prev);
        updated.delete(repo.id);
        return updated;
      });
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  return (
    <div className="text-white rounded-lg p-6 w-full max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Import Git Repository</h2>
          <p className="text-sm text-gray-400 mt-1">
            Choose from your GitHub repositories to import
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refreshRepositories}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            title="Refresh repositories"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={onClose}
            className="text-[#bbb] text-2xl hover:text-white"
          >
            &times;
          </button>
        </div>
      </div>

      {/* Account info + search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex items-center gap-2 px-4 py-2 bg-neutral-900 rounded-md border border-neutral-700 w-full sm:w-auto">
          <img
            src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
            alt="GitHub"
            className="w-5 h-5"
          />
          <span className="text-sm">
            {user?.githubUsername || "GitHub User"}
          </span>
        </div>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search repositories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-md bg-neutral-900 border border-neutral-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-white"
        >
          <option value="updated">Recently updated</option>
          <option value="created">Recently created</option>
          <option value="name">Name</option>
          <option value="stars">Stars</option>
          <option value="forks">Forks</option>
        </select>
      </div>

      {/* Repository count */}
      {!loading && !error && (
        <div className="mb-4 text-sm text-gray-400">
          {filteredAndSortedRepos.length} of {repositories.length} repositories
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-md flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div>
            <p className="text-red-400 font-medium">
              Failed to load repositories
            </p>
            <p className="text-red-300 text-sm mt-1">{error}</p>
          </div>
          <button
            onClick={refreshRepositories}
            className="ml-auto px-3 py-1 text-sm bg-red-800 hover:bg-red-700 rounded transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
            <p className="text-gray-400">Loading repositories...</p>
          </div>
        </div>
      )}

      {/* Repository list */}
      {!loading && !error && (
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {filteredAndSortedRepos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">
                {searchTerm
                  ? "No repositories found matching your search."
                  : "No repositories found."}
              </p>
            </div>
          ) : (
            filteredAndSortedRepos.map((repo) => (
              <div
                key={repo.id}
                className="flex items-center justify-between bg-neutral-900 rounded-md border border-neutral-800 px-4 py-3 hover:bg-neutral-800 transition"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-neutral-700 rounded flex items-center justify-center">
                      <span className="text-xs font-mono">
                        {repo.language?.charAt(0) || "?"}
                      </span>
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium truncate">
                        {repo.name}
                      </span>
                      {repo.private && (
                        <Lock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      )}
                    </div>

                    {repo.description && (
                      <p className="text-xs text-gray-400 truncate">
                        {repo.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      {repo.language && <span>{repo.language}</span>}
                      {repo.stargazersCount > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          <span>{repo.stargazersCount}</span>
                        </div>
                      )}
                      {repo.forksCount > 0 && (
                        <div className="flex items-center gap-1">
                          <GitFork className="w-3 h-3" />
                          <span>{repo.forksCount}</span>
                        </div>
                      )}
                      <span>Updated {formatDate(repo.updatedAt)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleImport(repo)}
                  disabled={importingRepos.has(repo.id)}
                  className="ml-4 px-4 py-1.5 text-sm font-medium rounded-md bg-white text-black hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                >
                  {importingRepos.has(repo.id) ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>Importing...</span>
                    </div>
                  ) : (
                    "Import"
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ImportRepo;
