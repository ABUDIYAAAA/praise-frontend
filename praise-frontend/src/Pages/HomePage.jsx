import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRepository } from "../context/RepositoryContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Milestones from "../Components/Milestones";

const HomePage = () => {
  const { user, logout, loading, checkAuth, setAuthToken } = useAuth();
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
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Sidebar */}
      <Sidebar onRepoChange={handleRepoChange} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 gap-8 ml-[260px]">
        <Milestones />
      </div>
    </div>
  );
};

export default HomePage;
