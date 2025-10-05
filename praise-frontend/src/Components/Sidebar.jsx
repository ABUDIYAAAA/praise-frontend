import React, { useState, useRef, useEffect } from "react";
import ImportRepo from "./ImportRepo";
import ProfilePopup from "./ProfilePopup";
import { useGitHub } from "../context/GitHubContext";
import { useRepository } from "../context/RepositoryContext";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({
  repoName = "Repo",
  userRole = "Contributor",
  repoIcon = "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
  onProfileClick = () => {},
  onRepoChange = () => {},
}) => {
  // --- STATE FOR VISIBILITY AND THEME ---
  const [showRepoModal, setShowRepoModal] = useState(false);
  const [showImportRepo, setShowImportRepo] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // --- REFS FOR CLICK-OUTSIDE LOGIC ---
  const repoRef = useRef(null);
  const profileRef = useRef(null);

  const { repositories: importedRepositories, fetchRepositories } =
    useRepository();
  const { user, logout } = useAuth();
  const profile = {
    name: user.githubUsername,
    avatar: user.githubAvatar,
  };
  console.log(user);
  useEffect(() => {
    if (importedRepositories.length === 0) {
      fetchRepositories();
    }
  }, [fetchRepositories, importedRepositories.length]);

  const repositoriesList = importedRepositories.map((repo) => ({
    id: repo._id,
    name: repo.name,
    fullName: repo.fullName,
    description: repo.description,
    private: repo.private,
    url: repo.url,
    cloneUrl: repo.cloneUrl,
    language: repo.language,
    stargazersCount: repo.stargazersCount,
    forksCount: repo.forksCount,
    updatedAt: repo.updatedAt,
    createdAt: repo.createdAt,
    defaultBranch: repo.defaultBranch,
    topics: repo.topics || [],
    owner: repo.owner,
    role: repo.userRole === "owner" ? "Owner" : "Contributor",
    userRole: repo.userRole,
    importedAt: repo.importedAt,
    permissions: repo.permissions,
  }));

  // Logic to close the Repo dropdown when clicking outside
  useEffect(() => {
    const handleClickRepo = (e) => {
      if (repoRef.current && !repoRef.current.contains(e.target)) {
        setShowRepoModal(false);
      }
    };
    if (showRepoModal) document.addEventListener("mousedown", handleClickRepo);
    return () => document.removeEventListener("mousedown", handleClickRepo);
  }, [showRepoModal]);

  // Logic to close the Profile Popup when clicking outside
  useEffect(() => {
    const handleClickProfile = (e) => {
      const isClickInsideProfileArea =
        profileRef.current && profileRef.current.contains(e.target);
      if (showProfilePopup && !isClickInsideProfileArea) {
        setShowProfilePopup(false);
      }
    };
    if (showProfilePopup)
      document.addEventListener("mousedown", handleClickProfile);
    return () => document.removeEventListener("mousedown", handleClickProfile);
  }, [showProfilePopup]);

  // Handler to toggle the profile popup
  const handleProfileClick = () => {
    setShowProfilePopup((prev) => !prev);
    setShowRepoModal(false);
  };

  return (
    <>
      {/* SIDEBAR (Intact) */}
      <aside className="fixed top-0 left-0 w-[260px] h-screen bg-[#1a1a1a] text-white flex flex-col justify-between shadow-[2px_0_8px_rgba(0,0,0,0.07)] z-50">
        {/* TOP SECTION (Intact) */}
        <div className="p-8 pb-6 border-b border-[#222] relative" ref={repoRef}>
          <div
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => setShowRepoModal((prev) => !prev)}
          >
            <img
              src={repoIcon}
              alt="Repo Icon"
              className="w-10 h-10 rounded-lg bg-white"
            />
            <div>
              <div className="font-semibold text-lg">{repoName}</div>
              <div className="text-sm text-[#bbb] mt-0.5">{userRole}</div>
            </div>
            <span className="ml-2 text-[#bbb]">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M7 5l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>

          {/* DROPDOWN MENU (Intact) */}
          {showRepoModal && (
            <div
              className="
                absolute left-55 top-[40px]
                bg-neutral-900/95 backdrop-blur-md
                rounded-2xl p-6 min-w-[320px]
                shadow-[0_8px_30px_rgba(0,0,0,0.5)]
                border border-white/10
                z-50 transition-all duration-300
              "
            >
              {/* Heading */}
              <div className="mb-4 text-lg font-semibold text-gray-100 tracking-wide">
                Select Repository
              </div>

              {/* Repository List */}
              <ul
                className="
                  mb-4
                  max-h-[260px]
                  overflow-y-auto
                  pr-2
                  scrollbar-thin scrollbar-thumb-[#333] scrollbar-track-transparent
                "
              >
                {repositoriesList.map((repo) => (
                  <li
                    key={repo.name}
                    className="flex justify-between items-center px-3 py-2 rounded-lg 
                               hover:bg-neutral-800 cursor-pointer transition-colors duration-200"
                    onClick={() => {
                      onRepoChange(repo);
                      setShowRepoModal(false);
                    }}
                  >
                    {/* Repo Name */}
                    <span className="text-sm text-gray-100 font-medium">
                      {repo.name}
                    </span>

                    {/* Role Badge */}
                    <span className="text-xs font-semibold text-gray-400 px-2 py-1 rounded-full border border-gray-600 text-center">
                      {repo.role}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Add Repository Button */}
              <button
                className="w-full py-2.5 px-4 bg-[#43b96f] text-white text-sm font-normal 
                           rounded-md shadow-sm hover:bg-[#3aa865] 
                           hover:shadow-md active:scale-[0.99] 
                           transition-all duration-200 flex items-center justify-center gap-2"
                onClick={() => {
                  setShowRepoModal(false);
                  setTimeout(() => setShowImportRepo(true), 100);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Repository from GitHub
              </button>
            </div>
          )}
        </div>

        {/* NAV (Intact) */}
        <nav className="flex-1 pt-8">
          <ul className="list-none p-0 m-0">
            <li className="px-8 py-3 cursor-pointer font-medium text-base transition-colors hover:bg-[#222]">
              Badges
            </li>
            <li className="px-8 py-3 cursor-pointer font-medium text-base transition-colors hover:bg-[#222]">
              Communities
            </li>
          </ul>
        </nav>

        {/* PROFILE SECTION - MODIFIED FOR NAME AND CHEVRON */}
        <div className="p-3 border-t border-[#222] relative" ref={profileRef}>
          <div
            className={`
              cursor-pointer flex items-center justify-between gap-3 p-3 rounded-lg 
              transition-all duration-200 
              ${
                showProfilePopup
                  ? "bg-[#222] border border-[#333]"
                  : "hover:bg-[#222]"
              }
            `}
            onClick={handleProfileClick}
          >
            <div className="flex items-center gap-3">
              <img
                src={profile.avatar}
                alt="Profile"
                className="w-9 h-9 rounded-full"
              />
              <div className="font-medium text-[15px]">
                {/* Displaying only the name as requested */}
                {profile.name}
              </div>
            </div>

            {/* Chevron symbol (>) */}
            <span className="text-[#bbb]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className={`${
                  showProfilePopup ? "transform rotate-90" : ""
                } transition-transform duration-200`}
              >
                <path
                  d="M7 5l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>

          {/* PROFILE POPUP - Renders the imported component */}
          {showProfilePopup && (
            <ProfilePopup
              userName={profile.name}
              darkModeEnabled={isDarkMode}
              onClose={() => setShowProfilePopup(false)}
              onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
              onEditProfile={onProfileClick}
            />
          )}
        </div>
      </aside>

      {/* IMPORT REPO MODAL (Intact) */}
      {showImportRepo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-[#1f1f1f] rounded-lg p-6 w-[500px] relative">
            <ImportRepo onClose={() => setShowImportRepo(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
