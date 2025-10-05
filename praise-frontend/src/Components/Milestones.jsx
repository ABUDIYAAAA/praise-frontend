import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import useBadgeProgress from "../hooks/useBadgeProgress";
import { useRepository } from "../context/RepositoryContext";
import { useBadge } from "../context/BadgeContext";
import BadgeCelebration from "./BadgeCelebration";
import ContributionCharts from "./ContributionCharts";

const modes = ["Pull Requests", "Commits", "Issues Resolved"];

const Milestones = () => {
  const [mode, setMode] = useState("Pull Requests");
  const [isOpen, setIsOpen] = useState(false);

  const { selectedRepository } = useRepository();
  const { unlockedBadges, showBadgePopup, hideBadgePopup } = useBadge();
  const {
    loading,
    error,
    badgeProgress,
    userStats,
    prActivity,
    userRole,
    chartData,
  } = useBadgeProgress(selectedRepository?.id);

  console.log("Milestones - selectedRepository:", selectedRepository);
  console.log("Milestones - badgeProgress:", badgeProgress);

  // Create image mapping based on criteria values
  const getImageForBadge = (badge) => {
    if (badge.criteriaType === "prs") {
      switch (badge.criteriaValue) {
        case 1:
          return "/images/8.png"; // First PR
        case 5:
          return "/images/9.png"; // 5 PRs
        case 20:
          return "/images/10.png"; // 20 PRs
        default:
          return "/images/11.png"; // Other PR milestones
      }
    } else if (badge.criteriaType === "commits") {
      return "/images/11.png"; // Commits get image 11
    }
    return "/images/8.png"; // Default fallback
  };

  // Transform badge progress data for display
  const milestones = badgeProgress.map((badge) => ({
    id: badge._id,
    level: `${badge.criteriaValue} ${badge.criteriaType.toUpperCase()}`,
    title: badge.name,
    description: badge.description,
    active: badge.isAwarded,
    progress: badge.progress,
    currentValue: badge.currentValue,
    criteriaValue: badge.criteriaValue,
    icon: badge.icon,
    color: badge.color,
    img: getImageForBadge(badge),
  }));

  // Transform PR activity data for chart
  const prChartData = prActivity.map((item) => ({
    date: new Date(item._id).getDate().toString().padStart(2, "0"),
    prs: item.count,
  }));

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00ffe7] mx-auto mb-4"></div>
          <p className="text-gray-400">Loading milestones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error loading milestones: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#00ffe7] text-black rounded-lg hover:bg-[#00ffe7]/80 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!selectedRepository) {
    return (
      <div className="min-h-screen w-full bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-300 mb-2">
            No Repository Selected
          </h2>
          <p className="text-gray-500">
            Please select a repository to view milestones
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-white flex flex-col items-center overflow-x-hidden px-6 sm:px-10 py-12">
      {/* Header */}
      <div className="w-full max-w-6xl flex flex-col sm:flex-row justify-between items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-center sm:text-left">
            Milestones
          </h1>
          <p className="text-gray-400 mt-1">{selectedRepository.name}</p>
        </div>
        <div className="relative">
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
          {milestones.map((m, i) => {
            // For owners: show all milestones with green line to the end
            // For contributors: show green line only up to their current progress
            const isOwner = userRole === "owner";
            const shouldShowActive = isOwner || m.active;
            const shouldShowProgressLine =
              isOwner ||
              i < milestones.findIndex((milestone) => !milestone.active);

            return (
              <React.Fragment key={m.id || i}>
                <div className="flex flex-col items-center text-center flex-1 min-w-[80px]">
                  <motion.div
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center overflow-hidden relative bg-gray-800 ${
                      shouldShowActive
                        ? "border-2 border-[#00ffe7] shadow-[0_0_20px_rgba(0,255,231,0.3)]"
                        : "border border-gray-700"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Badge image */}
                    <img
                      src={m.img}
                      alt={m.title}
                      className={`object-contain w-10 h-10 sm:w-12 sm:h-12 ${
                        shouldShowActive
                          ? "opacity-100"
                          : "opacity-50 grayscale"
                      }`}
                      onError={(e) => {
                        // Fallback to emoji if image fails to load
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "block";
                      }}
                    />
                    <div
                      className={`text-2xl sm:text-3xl hidden ${
                        shouldShowActive
                          ? "opacity-100"
                          : "opacity-50 grayscale"
                      }`}
                    >
                      {m.icon || "🏆"}
                    </div>

                    {/* Progress ring for contributors */}
                    {!isOwner && !m.active && m.progress > 0 && (
                      <div
                        className="absolute inset-0 rounded-full border-2 border-[#00ffe7]/50"
                        style={{
                          background: `conic-gradient(#00ffe7 ${
                            m.progress * 3.6
                          }deg, transparent ${m.progress * 3.6}deg)`,
                        }}
                      />
                    )}
                  </motion.div>

                  <p
                    className={`mt-2 font-semibold text-xs sm:text-sm ${
                      shouldShowActive ? "text-[#00ffe7]" : "text-gray-400"
                    }`}
                  >
                    {m.level}
                  </p>
                  <p className="text-xs text-gray-500">{m.title}</p>

                  {/* Show progress for contributors */}
                  {!isOwner && !m.active && (
                    <p className="text-xs text-[#00ffe7]/70 mt-1">
                      {m.currentValue}/{m.criteriaValue}
                    </p>
                  )}
                </div>

                {i < milestones.length - 1 && (
                  <motion.div
                    className={`h-1 flex-1 ${
                      shouldShowProgressLine ? "bg-[#00ffe7]" : "bg-gray-700"
                    }`}
                    layout
                    transition={{ duration: 0.5 }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {userRole === "owner" && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="mt-14 px-6 py-3 rounded-xl bg-[#00ffe7]/20 border border-[#00ffe7]/40 text-[#00ffe7] hover:bg-[#00ffe7]/30 transition-all duration-300"
          >
            ✏️ Edit Milestones
          </motion.button>
        )}
      </div>

      {/* Chart Section */}
      {prChartData.length > 0 && (
        <div className="w-full max-w-6xl mt-16 bg-gray-900 p-6 rounded-2xl shadow-lg">
          <h2 className="text-gray-200 text-lg mb-4 text-center">
            {mode} Activity - Last 30 Days
          </h2>
          <div className="mb-4 text-center">
            <div className="inline-flex gap-4 text-sm text-gray-400">
              <span>
                Total PRs:{" "}
                <span className="text-[#00ffe7]">
                  {userStats?.totalPRs || 0}
                </span>
              </span>
              <span>
                Merged:{" "}
                <span className="text-green-400">
                  {userStats?.mergedPRs || 0}
                </span>
              </span>
              <span>
                Commits:{" "}
                <span className="text-blue-400">
                  {userStats?.totalCommits || 0}
                </span>
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={prChartData}
              margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#6b7280"
                vertical={false}
              />
              <XAxis dataKey="date" stroke="#d1d5db" />
              <YAxis stroke="#d1d5db" />
              <Tooltip
                cursor={{ fill: "#1f2937" }}
                contentStyle={{ backgroundColor: "#111827", border: "none" }}
                labelStyle={{ color: "#e5e7eb" }}
              />
              <Legend wrapperStyle={{ color: "#e5e7eb" }} />
              <Bar
                dataKey="prs"
                fill="#00ffe7"
                name={mode}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Enhanced Contribution Charts */}
      {userStats && chartData && (
        <div className="w-full max-w-6xl mt-16">
          <ContributionCharts chartData={chartData} userStats={userStats} />
        </div>
      )}

      {/* No Data Message */}
      {prChartData.length === 0 && !chartData && (
        <div className="w-full max-w-6xl mt-16 bg-gray-900 p-8 rounded-2xl shadow-lg text-center">
          <p className="text-gray-400 text-lg">
            No activity data available yet
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Start contributing to see your progress!
          </p>
        </div>
      )}

      {/* Badge Celebration Modal */}
      <BadgeCelebration
        badges={unlockedBadges}
        isOpen={showBadgePopup}
        onClose={hideBadgePopup}
        userStats={userStats}
        repository={selectedRepository}
      />
    </div>
  );
};

export default Milestones;
