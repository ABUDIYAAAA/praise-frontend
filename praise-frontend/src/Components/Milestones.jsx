import React, { useState } from "react";
import { motion } from "framer-motion";
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
import { useRepository } from "../context/RepositoryContext";
import { useBadge } from "../context/BadgeContext";
import BadgeCelebration from "./BadgeCelebration";
import ContributionCharts from "./ContributionCharts";
import useBadgeProgress from "../hooks/useBadgeProgress";
import { useAuth } from "../context/AuthContext";

const Milestones = () => {
  const [mode] = useState("Pull Requests"); // Fixed to PRs only
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
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

  // Badge image mapping
  const getImageForBadge = (badge) => {
    if (badge.criteriaType === "prs") {
      switch (badge.criteriaValue) {
        case 1:
          return "/images/8.png";
        case 5:
          return "/images/9.png";
        case 20:
          return "/images/10.png";
        default:
          return "/images/11.png";
      }
    }
    return "/images/11.png";
  };

  const milestones = badgeProgress.map((badge) => ({
    id: badge._id,
    level: `${badge.criteriaValue} PRs`,
    title: badge.name,
    description: badge.description,
    active: badge.isAwarded,
    currentValue: badge.currentValue,
    criteriaValue: badge.criteriaValue,
    icon: badge.icon,
    img: getImageForBadge(badge),
  }));

  // Push logic: Auto-mark badges as completed based on current PRs
  const currentPRs = userStats?.totalPRs || 0;

  // Update milestones with push logic
  const updatedMilestones = milestones.map((milestone) => ({
    ...milestone,
    active: currentPRs >= milestone.criteriaValue || milestone.active,
  }));

  // Find the next uncompleted milestone
  const nextMilestone = updatedMilestones.find((m) => !m.active);
  const nextTarget = nextMilestone
    ? nextMilestone.criteriaValue
    : updatedMilestones[updatedMilestones.length - 1]?.criteriaValue || 0;

  // Calculate progress towards next milestone
  const previousMilestone = nextMilestone
    ? updatedMilestones[
        updatedMilestones.findIndex((m) => m.id === nextMilestone.id) - 1
      ]
    : updatedMilestones[updatedMilestones.length - 1];

  const previousTarget = previousMilestone?.criteriaValue || 0;
  const progressStart = previousTarget;
  const progressRange = nextTarget - progressStart;
  const currentProgress = currentPRs - progressStart;

  // Progress calculation with push logic - jumps to next when 100%
  let progressPercent;
  if (!nextMilestone) {
    // All badges completed
    progressPercent = 100;
  } else if (currentPRs >= nextTarget) {
    // Current badge should be completed, but showing 100% briefly before jumping
    progressPercent = 100;
  } else {
    // Normal progress calculation
    progressPercent = Math.min(
      100,
      Math.max(0, (currentProgress / progressRange) * 100)
    );
  }

  // PR chart data (last 50 PRs)
  const prChartData = prActivity.map((item) => ({
    date: new Date(item._id).getDate().toString().padStart(2, "0"),
    prs: item.count,
  }));

  if (loading)
    return (
      <div className="min-h-screen w-full bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00ffe7] mx-auto mb-4"></div>
          <p className="text-gray-400">Loading milestones...</p>
        </div>
      </div>
    );

  if (error)
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

  if (!selectedRepository)
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

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-white flex flex-col items-center overflow-x-hidden px-6 sm:px-10 py-12">
      {/* Header */}
      <div className="w-full max-w-6xl flex flex-col sm:flex-row justify-between items-center gap-6 mb-8">
        {/* Left: Page Title */}
        <div className="text-center sm:text-left flex-1">
          <h1 className="text-3xl font-bold">Milestones</h1>
        </div>

        {/* Right: Repository Name */}
        <div className="text-center sm:text-right flex-1">
          <p className="text-gray-400 text-lg font-medium">
            {selectedRepository?.name || "No Repository Selected"}
          </p>
        </div>
      </div>

      {/* NEW Progress/Summary Box (Now with custom left content) */}
      <div className="w-full max-w-6xl mb-12 p-6 bg-gray-900/70 border border-gray-800 rounded-2xl shadow-xl flex flex-col md:flex-row gap-6">
        {/* Left Side: Content from the Provided Picture */}
        <div className="flex-1 p-6 bg-gray-800 rounded-xl border border-gray-700/50 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-700 rounded-lg flex-shrink-0 overflow-hidden">
            <img
              src={user.githubAvatar}
              className="w-full h-full object-cover rounded-lg"
              alt="Profile"
            />
          </div>
          <div className="flex flex-col items-center sm:items-start flex-grow">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              {user.githubUsername}
            </h2>
            {/* Show first 3 milestones with their completion status */}
            {updatedMilestones.slice(0, 3).map((milestone, index) => (
              <div key={milestone.id} className="flex items-center gap-3 mb-2">
                <div
                  className={`w-5 h-5 rounded-sm flex items-center justify-center ${
                    milestone.active ? "bg-[#00ffe7] text-black" : "bg-gray-600"
                  }`}
                >
                  {milestone.active && (
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span
                  className={`text-lg ${
                    milestone.active
                      ? "text-white font-medium"
                      : "text-gray-400"
                  }`}
                >
                  {milestone.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Next Milestone Progress (remains the same) */}
        <div className="flex-1 p-4 bg-gray-800 rounded-xl border border-gray-700/50 flex flex-col justify-between">
          <h2 className="text-xl font-semibold mb-4 text-[#00ffe7]">
            Next Milestone Progress
          </h2>
          <div>
            <p className="text-lg font-medium text-gray-300">
              Target:{" "}
              <span className="text-white font-bold">
                {nextMilestone ? nextMilestone.title : "All Unlocked!"}
              </span>
            </p>
            <p className="text-sm text-gray-500 mb-4">
              {nextMilestone
                ? `Reach ${nextTarget} PRs to unlock the next badge.`
                : "You've earned every badge available!"}
            </p>
          </div>

          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-[#00ffe7] to-[#00bfa5] h-3 rounded-full transition-all duration-700 shadow-[0_0_6px_#00ffe7]"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-gray-400">{progressStart} PRs</span>
            <span
              className="font-semibold"
              style={{ color: progressPercent >= 100 ? "#4ADE80" : "#00ffe7" }}
            >
              {progressPercent.toFixed(1)}% Complete
            </span>
            <span className="text-gray-400">{nextTarget} PRs</span>
          </div>
        </div>
      </div>
      {/* END NEW BOX */}

      {/* Timeline */}
      <div className="relative w-full max-w-6xl flex flex-col items-center overflow-hidden">
        <motion.div
          className="flex flex-wrap items-center justify-center sm:justify-between gap-8 sm:gap-4 w-full px-2 sm:px-0"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {updatedMilestones.map((m, i) => {
            const isOwner = userRole === "owner";
            const showActive = isOwner || m.active;
            const nextInactiveIndex = updatedMilestones.findIndex(
              (milestone) => !milestone.active
            );

            const dotVariants = {
              hidden: { scale: 0.6, opacity: 0, y: 20 },
              visible: {
                scale: 1,
                opacity: 1,
                y: 0,
                transition: { type: "spring", stiffness: 250, damping: 25 },
              },
            };

            return (
              <React.Fragment key={m.id || i}>
                {/* Timeline Dot */}
                <motion.div
                  variants={dotVariants}
                  className="flex flex-col items-center text-center flex-1 min-w-[80px] relative mt-4"
                >
                  <motion.div
                    whileHover={{
                      y: -4,
                      scale: 1.1,
                      boxShadow: "0 0 20px rgba(0,255,231,0.6)",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center overflow-hidden relative bg-gray-800 cursor-pointer transition-all duration-500 ${
                      showActive
                        ? "border-4 border-[#00ffe7] shadow-[0_0_20px_rgba(0,255,231,0.6),0_0_40px_rgba(0,255,231,0.3)]"
                        : "border-2 border-gray-700"
                    }`}
                  >
                    <img
                      src={m.img}
                      alt={m.title}
                      className={`object-contain w-10 h-10 sm:w-12 sm:h-12 transition-all duration-500 ${
                        showActive ? "opacity-100" : "opacity-50 grayscale"
                      }`}
                    />
                  </motion.div>

                  {/* Level & Title */}
                  <p
                    className={`mt-2 font-semibold text-xs sm:text-sm ${
                      showActive ? "text-[#00ffe7]" : "text-gray-400"
                    }`}
                  >
                    {m.level}
                  </p>
                  <p className="text-xs text-gray-500">{m.title}</p>
                </motion.div>

                {/* Timeline Line */}
                {i < updatedMilestones.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                      delay: i * 0.08,
                    }}
                    className="h-1 flex-1 origin-left rounded-full relative"
                  >
                    <div className="absolute inset-0 bg-gray-700 rounded-full transition-all duration-500"></div>
                    {(isOwner || updatedMilestones[i + 1].active) && (
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: i * 0.1 + 0.2 }}
                        className="absolute inset-0 bg-gradient-to-r from-[#00ffe7] to-[#00bfa5] rounded-full shadow-[0_0_8px_#00ffe7] origin-left"
                      ></motion.div>
                    )}
                  </motion.div>
                )}
              </React.Fragment>
            );
          })}
        </motion.div>

        {/* Owner Edit Button */}
        {userRole === "owner" && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="mt-14 px-6 py-3 rounded-xl bg-[#00ffe7]/20 border border-[#00ffe7]/40 text-[#00ffe7] hover:bg-[#00ffe7]/30 transition-all duration-300"
          >
            Edit Milestones
          </motion.button>
        )}
      </div>

      {/* PR Activity Chart */}
      {prChartData.length > 0 && (
        <div className="w-full max-w-6xl mt-16 bg-gray-900 p-6 rounded-2xl shadow-lg">
          <h2 className="text-gray-200 text-lg mb-4 text-center">
            Pull Requests Activity - Last 30 Days
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
                name="Pull Requests"
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
