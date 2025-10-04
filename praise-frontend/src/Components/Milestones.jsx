import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const Milestones = () => {
  const [mode, setMode] = useState("Pull Requests");
  const [isOpen, setIsOpen] = useState(false);

  const modes = ["Pull Requests", "Commits", "Issues Resolved"];

  const milestones = [
    { level: "5 PRs", title: "First Open Source Contribution", active: true },
    { level: "10 PRs", title: "Consistent Contributor", active: true },
    { level: "25 PRs", title: "Open Source Enthusiast", active: true },
    { level: "50 PRs", title: "Community Hero", active: false },
    { level: "75 PRs", title: "Veteran Contributor", active: false },
    { level: "100 PRs", title: "Legendary Dev", active: false },
  ];

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-white flex flex-col items-center overflow-x-hidden px-6 sm:px-10 py-12">
      {/* Header */}
      <div className="w-full max-w-6xl flex flex-col sm:flex-row justify-between items-center gap-6 mb-12">
        <h1 className="text-3xl font-bold text-center sm:text-left">Milestones</h1>

        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-between gap-2 bg-[#1a1a1a] hover:bg-[#222] px-5 py-2.5 rounded-lg border border-[#00ffe7]/30 text-[#00ffe7] transition-all duration-300"
          >
            {mode}
            <ChevronDown className="w-4 h-4" />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 bg-[#1a1a1a] border border-[#00ffe7]/20 rounded-lg overflow-hidden shadow-lg z-10 w-40">
              {modes.map((m) => (
                <div
                  key={m}
                  onClick={() => {
                    setMode(m);
                    setIsOpen(false);
                  }}
                  className="px-4 py-2 cursor-pointer hover:bg-[#00ffe7]/10 text-sm transition-colors"
                >
                  {m}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative w-full max-w-6xl flex flex-col items-center overflow-hidden">
        <div className="flex flex-wrap items-center justify-center sm:justify-between gap-6 sm:gap-4 w-full px-2 sm:px-0">
          {milestones.map((m, i) => (
            <React.Fragment key={i}>
              {/* Milestone Node */}
              <div className="flex flex-col items-center text-center flex-1 min-w-[80px]">
                <motion.div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center ${
                    m.active
                      ? "bg-[#00ffe7]/20 border-2 border-[#00ffe7]"
                      : "bg-gray-800 border border-gray-700"
                  } shadow-[0_4px_12px_rgba(0,255,231,0.1)]`}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.span
                    className={`text-2xl ${
                      m.active ? "text-[#00ffe7]" : "text-gray-400"
                    }`}
                  >
                    🏅
                  </motion.span>
                </motion.div>
                <p
                  className={`mt-2 font-semibold ${
                    m.active ? "text-[#00ffe7]" : "text-gray-400"
                  }`}
                >
                  {m.level}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">{m.title}</p>
              </div>

              {/* Connecting Line */}
              {i < milestones.length - 1 && (
                <motion.div
                  className={`h-1 flex-1 ${
                    milestones[i + 1].active ? "bg-[#00ffe7]" : "bg-gray-700"
                  }`}
                  layout
                  transition={{ duration: 0.5 }}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Edit Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="mt-14 px-6 py-3 rounded-xl bg-[#00ffe7]/20 border border-[#00ffe7]/40 text-[#00ffe7] hover:bg-[#00ffe7]/30 transition-all duration-300"
        >
          ✏️ Edit Milestones
        </motion.button>
      </div>
    </div>
  );
};

export default Milestones;
