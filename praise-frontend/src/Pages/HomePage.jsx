import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRepository } from "../context/RepositoryContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Milestones from "../Components/Milestones";

// Communities placeholder component
const Communities = () => {
  return (
    <div className="p-8 text-center">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-2-2V10a2 2 0 012-2h2m2-4h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V6a2 2 0 012-2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Discord Not Setup Yet
        </h3>
        <p className="text-gray-500">
          Community features will be available once Discord integration is
          configured.
        </p>
      </div>
    </div>
  );
};

const HomePage = () => {
  const { user, logout, loading, checkAuth, setAuthToken } = useAuth();
  const [activeSection, setActiveSection] = useState("badges");
  const [searchParams, setSearchParams] = useSearchParams();
  const { selectRepository } = useRepository();
  const navigate = useNavigate();

  // Handle OAuth token from URL
  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      console.log("🎫 Token received from OAuth callback:", token);

      // Store the token using AuthContext method
      setAuthToken(token);

      // Clear token from URL
      setSearchParams({});

      // Re-check authentication to get user data
      checkAuth();
    }
  }, [searchParams, setSearchParams, checkAuth, setAuthToken]);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate("/");
    }
  };

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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            Please log in to access this page.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleRepoChange = (repo) => {
    console.log("Repository selected:", repo);
    selectRepository(repo);
    setActiveSection("badges"); // Reset to badges when changing repos
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Sidebar */}
      <Sidebar
        onRepoChange={handleRepoChange}
        onSectionChange={handleSectionChange}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 gap-8 ml-[260px]">
        {activeSection === "badges" && <Milestones />}
        {activeSection === "communities" && <Communities />}
      </div>
    </div>
  );
};

export default HomePage;
