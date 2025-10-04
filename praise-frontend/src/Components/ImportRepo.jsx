import React from "react";
import { Search, ChevronDown, Lock } from "lucide-react";

const repos = [
  {
    id: 1,
    name: "python_codeforces",
    date: "Sep 29",
    icon: "https://github.githubassets.com/favicons/favicon.png",
    private: true,
  },
  {
    id: 2,
    name: "react-mindspark",
    date: "Sep 22",
    icon: "https://vitejs.dev/logo.svg",
    private: true,
  },
  {
    id: 3,
    name: "DCODE-Smaple-Repo",
    date: "Sep 15",
    icon: "https://vitejs.dev/logo.svg",
    private: true,
  },
  {
    id: 4,
    name: "enteyatra",
    date: "Sep 12",
    icon: "https://github.githubassets.com/favicons/favicon.png",
    private: true,
  },
  {
    id: 5,
    name: "apparel-arc-store",
    date: "Aug 4",
    icon: "https://vitejs.dev/logo.svg",
    private: true,
  },
];

const ImportRepo = ({ onClose }) => {
  return (
    <div className="text-white bg-[#1f1f1f] rounded-lg p-6 w-full max-w-2xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Import Git Repository</h2>
        <button
          onClick={onClose}
          className="text-[#bbb] text-2xl hover:text-white"
        >
          &times;
        </button>
      </div>

      {/* Account selector + search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button className="flex items-center justify-between px-4 py-2 bg-neutral-900 rounded-md border border-neutral-700 w-full sm:w-1/3">
          <div className="flex items-center gap-2">
            <img
              src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
              alt="GitHub"
              className="w-5 h-5"
            />
            <span className="text-sm">skxm03</span>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search repositories..."
            className="w-full pl-10 pr-3 py-2 rounded-md bg-neutral-900 border border-neutral-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>
      </div>

      {/* Repository list */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {repos.map((repo) => (
          <div
            key={repo.id}
            className="flex items-center justify-between bg-neutral-900 rounded-md border border-neutral-800 px-4 py-3 hover:bg-neutral-800 transition"
          >
            <div className="flex items-center gap-3">
              <img
                src={repo.icon}
                alt={repo.name}
                className="w-6 h-6 rounded"
              />
              <span className="text-sm font-medium">{repo.name}</span>
              {repo.private && <Lock className="w-3.5 h-3.5 text-gray-400" />}
              <span className="text-xs text-gray-400">· {repo.date}</span>
            </div>
            <button className="px-4 py-1.5 text-sm font-medium rounded-md bg-white text-black hover:bg-gray-200 transition">
              Import
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImportRepo;
