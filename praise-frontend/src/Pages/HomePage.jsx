import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRepository } from "../context/RepositoryContext";
import { useBadge } from "../context/BadgeContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Milestones from "../Components/Milestones";
import BadgeUnlockPopup from "../Components/BadgeUnlockPopup";

const HomePage = () => {
  const { user, logout, loading } = useAuth();
  const { selectedRepository, selectRepository } = useRepository();
  const { checkBadges, unlockedBadges, showPopup, hidePopup } = useBadge();
  const [currentRepo, setCurrentRepo] = useState(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate("/");
    }
  };

  const handleRepoChange = async (repo) => {
    setCurrentRepo(repo);
    selectRepository(repo);

    // Check for badge unlocks when contributor selects a repository
    if (repo && repo.userRole === "contributor") {
      try {
        await checkBadges(repo.id);
      } catch (error) {
        console.error("Error checking badges:", error);
      }
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

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Sidebar */}
      <Sidebar onRepoChange={handleRepoChange} />

      {/* Badge Unlock Popup */}
      {showPopup && unlockedBadges.length > 0 && (
        <BadgeUnlockPopup badges={unlockedBadges} onClose={hidePopup} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {currentRepo ? (
          <div className="p-8">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">📁</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {currentRepo.name}
                  </h1>
                  <p className="text-gray-600">{currentRepo.fullName}</p>
                </div>
              </div>

              {/* Role-based Content */}
              <div className="bg-gray-50 rounded-lg p-4">
                {currentRepo.userRole === "owner" ? (
                  <div>
                    <h3 className="text-lg font-semibold text-green-700 mb-2">
                      Repository Owner
                    </h3>
                    <p className="text-gray-700">
                      You are the owner of this repository. As an owner, you
                      have full control over this repository including:
                    </p>
                    <ul className="mt-2 ml-4 list-disc text-gray-600">
                      <li>Managing badges and criteria</li>
                      <li>Inviting contributors</li>
                      <li>Viewing detailed analytics</li>
                      <li>Configuring repository settings</li>
                    </ul>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-semibold text-blue-700 mb-2">
                      Repository Contributor
                    </h3>
                    <p className="text-gray-700">
                      You are a contributor in this repository. As a
                      contributor, you can:
                    </p>
                    <ul className="mt-2 ml-4 list-disc text-gray-600">
                      <li>View your badges and progress</li>
                      <li>See contribution statistics</li>
                      <li>Track your achievements</li>
                      <li>Compare with other contributors</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Repository Details */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800">Language</h4>
                  <p className="text-blue-600">
                    {currentRepo.language || "Not specified"}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800">Stars</h4>
                  <p className="text-green-600">
                    {currentRepo.stargazersCount || 0}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-800">Forks</h4>
                  <p className="text-purple-600">
                    {currentRepo.forksCount || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-4xl">📁</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-700 mb-2">
                Select a Repository
              </h2>
              <p className="text-gray-500">
                Choose a repository from the sidebar to view details and manage
                badges
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
