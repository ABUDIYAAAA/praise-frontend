import React, { useState, useRef, useEffect } from "react";
import ImportRepo from "./ImportRepo";

const Sidebar = ({
  repoName = "Repo",
  userRole = "Contributor",
  repoIcon = "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
  profile = { name: "Your Name", avatar: "https://i.pravatar.cc/40" },
  onProfileClick = () => {},
  repositories = [
    { name: "Repo 1", role: "Contributor" },
    { name: "Repo 2", role: "Maintainer" },
  ],
  onRepoChange = () => {},
}) => {
  const [showRepoModal, setShowRepoModal] = useState(false);
  const [showImportRepo, setShowImportRepo] = useState(false);
  const repoRef = useRef(null);

  // Close dropdown if click outside
  useEffect(() => {
    const handleClick = (e) => {
      if (repoRef.current && !repoRef.current.contains(e.target)) {
        setShowRepoModal(false);
      }
    };
    if (showRepoModal) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showRepoModal]);

  return (
    <>
      {/* SIDEBAR */}
      <aside className="w-[260px] h-screen bg-[#1a1a1a] text-white flex flex-col justify-between shadow-[2px_0_8px_rgba(0,0,0,0.07)] relative">
        {/* TOP SECTION */}
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

          {/* DROPDOWN MENU */}
          {showRepoModal && (
            <div className="absolute left-0 top-[70px] bg-[#222] rounded-lg p-6 min-w-[320px] shadow-lg z-50">
              <div className="mb-4 font-semibold text-lg">
                Select Repository
              </div>
              <ul className="mb-4">
                {repositories.map((repo) => (
                  <li
                    key={repo.name}
                    className="flex justify-between items-center px-3 py-2 rounded hover:bg-[#333] cursor-pointer"
                    onClick={() => {
                      onRepoChange(repo);
                      setShowRepoModal(false);
                    }}
                  >
                    <span>{repo.name}</span>
                    <span className="text-xs text-[#bbb] px-2 py-1 rounded bg-[#333] text-center">
                      {repo.role}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                className="w-full py-2 bg-[#2ea44f] text-white rounded font-medium hover:bg-[#238636] transition"
                onClick={() => {
                  setShowRepoModal(false);
                  setTimeout(() => setShowImportRepo(true), 100); // ⏱ fix render delay
                }}
              >
                Add New Repository from GitHub
              </button>
            </div>
          )}
        </div>

        {/* NAV */}
        <nav className="flex-1 pt-8">
          <ul className="list-none p-0 m-0">
            <li className="px-8 py-3 cursor-pointer font-medium text-base transition-colors hover:bg-[#222]">
              🏅 Badges
            </li>
            <li className="px-8 py-3 cursor-pointer font-medium text-base transition-colors hover:bg-[#222]">
              👥 Communities
            </li>
          </ul>
        </nav>

        {/* PROFILE */}
        <div
          className="p-6 border-t border-[#222] cursor-pointer flex items-center gap-3"
          onClick={onProfileClick}
        >
          <img
            src={profile.avatar}
            alt="Profile"
            className="w-9 h-9 rounded-full"
          />
          <div>
            <div className="font-medium text-[15px]">{profile.name}</div>
            <div className="text-xs text-[#bbb]">Edit Settings</div>
          </div>
        </div>
      </aside>

      {/* IMPORT REPO MODAL */}
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
