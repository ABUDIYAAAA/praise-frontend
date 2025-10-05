import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  LineChart,
  Line,
} from "recharts";

const ContributionCharts = ({ chartData, userStats }) => {
  if (!chartData || !userStats) return null;

  // Prepare data for different chart types
  const contributionBreakdown = [
    { name: "Merged PRs", value: userStats.mergedPRs || 0, color: "#10B981" },
    { name: "Open PRs", value: userStats.openPRs || 0, color: "#3B82F6" },
    { name: "Closed PRs", value: userStats.closedPRs || 0, color: "#EF4444" },
  ].filter((item) => item.value > 0);

  const codeContributions = [
    {
      name: "Additions",
      value: userStats.totalAdditions || 0,
      color: "#10B981",
    },
    {
      name: "Deletions",
      value: userStats.totalDeletions || 0,
      color: "#EF4444",
    },
  ].filter((item) => item.value > 0);

  const overviewStats = [
    { category: "Pull Requests", count: userStats.totalPRs || 0 },
    { category: "Commits", count: userStats.totalCommits || 0 },
    { category: "Lines Changed", count: userStats.totalLinesChanged || 0 },
  ];

  // Badge progress data
  const badgeProgressData = [
    {
      name: "Earned",
      value: chartData.badgeStats?.earnedBadges || 0,
      color: "#10B981",
    },
    {
      name: "Remaining",
      value:
        (chartData.badgeStats?.totalBadges || 0) -
        (chartData.badgeStats?.earnedBadges || 0),
      color: "#6B7280",
    },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-gray-200 font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Contribution Overview */}
      <div className="bg-gray-900 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">
          Contribution Overview
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={overviewStats}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="category" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill="#00FFE7" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PR Status Breakdown */}
        {contributionBreakdown.length > 0 && (
          <div className="bg-gray-900 rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-white mb-4">
              Pull Request Status
            </h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={contributionBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {contributionBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Code Changes */}
        {codeContributions.length > 0 && (
          <div className="bg-gray-900 rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-white mb-4">
              Code Changes
            </h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={codeContributions} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9CA3AF" />
                <YAxis type="category" dataKey="name" stroke="#9CA3AF" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {codeContributions.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Badge Progress */}
        <div className="bg-gray-900 rounded-2xl p-6">
          <h4 className="text-lg font-semibold text-white mb-4">
            Badge Progress
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={badgeProgressData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {badgeProgressData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center mt-4">
            <div className="text-2xl font-bold text-[#00FFE7]">
              {chartData.badgeStats?.progressPercentage || 0}%
            </div>
            <div className="text-gray-400">Completion Rate</div>
          </div>
        </div>

        {/* Activity Timeline */}
        {chartData.activityTimeline?.prActivity?.length > 0 && (
          <div className="bg-gray-900 rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-white mb-4">
              Recent Activity
            </h4>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData.activityTimeline.prActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="_id" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#00FFE7"
                  fill="#00FFE7"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl p-4 border border-blue-500/30">
          <div className="text-2xl font-bold text-blue-400">
            {userStats.totalPRs || 0}
          </div>
          <div className="text-sm text-gray-300">Total Pull Requests</div>
        </div>
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-4 border border-green-500/30">
          <div className="text-2xl font-bold text-green-400">
            {userStats.mergedPRs || 0}
          </div>
          <div className="text-sm text-gray-300">Merged PRs</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl p-4 border border-purple-500/30">
          <div className="text-2xl font-bold text-purple-400">
            {userStats.totalCommits || 0}
          </div>
          <div className="text-sm text-gray-300">Total Commits</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl p-4 border border-yellow-500/30">
          <div className="text-2xl font-bold text-yellow-400">
            {(userStats.totalLinesChanged || 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-300">Lines Changed</div>
        </div>
      </div>

      {/* Contribution Timeline */}
      {userStats.firstContribution && (
        <div className="bg-gray-900 rounded-2xl p-6">
          <h4 className="text-lg font-semibold text-white mb-4">
            Contribution Journey
          </h4>
          <div className="flex justify-between items-center text-sm">
            <div>
              <div className="text-gray-400">First Contribution</div>
              <div className="text-white font-medium">
                {new Date(userStats.firstContribution).toLocaleDateString()}
              </div>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-[#00FFE7] to-transparent flex-1 mx-4"></div>
            <div className="text-center">
              <div className="text-gray-400">Duration</div>
              <div className="text-white font-medium">
                {Math.ceil(
                  (new Date(userStats.lastContribution) -
                    new Date(userStats.firstContribution)) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                days
              </div>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-[#00FFE7] to-transparent flex-1 mx-4"></div>
            <div className="text-right">
              <div className="text-gray-400">Latest Contribution</div>
              <div className="text-white font-medium">
                {new Date(userStats.lastContribution).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContributionCharts;
