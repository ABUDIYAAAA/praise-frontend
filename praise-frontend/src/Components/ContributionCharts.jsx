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
} from "recharts";

const ContributionCharts = ({ chartData, userStats }) => {
  if (!chartData || !userStats) return null;

  // Prepare data for different chart types
  const contributionBreakdown = [
    { name: "Merged PRs", value: userStats.mergedPRs || 0, color: "#00FFE7" },
    {
      name: "Open PRs",
      value: userStats.openPRs || 0,
      color: "rgba(0,255,231,0.6)",
    },
    {
      name: "Closed PRs",
      value: userStats.closedPRs || 0,
      color: "rgba(0,255,231,0.3)",
    },
  ].filter((item) => item.value > 0);

  const codeContributions = [
    {
      name: "Additions",
      value: userStats.totalAdditions || 0,
      color: "#00FFE7",
    },
    {
      name: "Deletions",
      value: userStats.totalDeletions || 0,
      color: "rgba(0,255,231,0.4)",
    },
  ].filter((item) => item.value > 0);

  const overviewStats = [
    { category: "Pull Requests", count: userStats.totalPRs || 0 },
    { category: "Commits", count: userStats.totalCommits || 0 },
    { category: "Lines Changed", count: userStats.totalLinesChanged || 0 },
  ];

  const badgeProgressData = [
    {
      name: "Earned",
      value: chartData.badgeStats?.earnedBadges || 0,
      color: "#00FFE7",
    },
    {
      name: "Remaining",
      value:
        (chartData.badgeStats?.totalBadges || 0) -
        (chartData.badgeStats?.earnedBadges || 0),
      color: "rgba(0,255,231,0.15)",
    },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0a0a0a] border border-[#00ffe7]/40 rounded-lg p-3 shadow-[0_0_12px_rgba(0,255,231,0.2)]">
          <p className="text-[#00ffe7] font-semibold mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color || "#e5e7eb" }}>
              {entry.name}: <span className="font-medium">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-10">
      {/* Contribution Overview */}
      <div className="bg-[#0a0a0a] rounded-2xl p-6 border border-[#00FFE7]/20 shadow-[0_0_25px_rgba(0,255,231,0.05)]">
        <h3 className="text-xl font-bold text-[#00FFE7] mb-6 tracking-wide">
          Contribution Overview
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={overviewStats}>
            <defs>
              <linearGradient id="tealGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00FFE7" stopOpacity={1} />
                <stop offset="100%" stopColor="#00FFE7" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(0,255,231,0.15)"
            />
            <XAxis dataKey="category" stroke="#00FFE7" tickLine={false} />
            <YAxis stroke="#00FFE7" tickLine={false} />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "transparent" }} // completely removes overlay
            />

            <Legend wrapperStyle={{ color: "#00FFE7" }} />
            <Bar
              dataKey="count"
              fill="url(#tealGradient)"
              radius={[6, 6, 0, 0]}
              barSize={40}
              animationDuration={1200}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PR Status Breakdown */}
        {contributionBreakdown.length > 0 && (
          <div className="bg-[#0a0a0a] rounded-2xl p-6 border border-[#00FFE7]/20 shadow-[0_0_25px_rgba(0,255,231,0.05)]">
            <h4 className="text-lg font-semibold text-[#00FFE7] mb-4">
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
                  paddingAngle={4}
                  dataKey="value"
                >
                  {contributionBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(0,255,231,0.05)" }} // soft cyan highlight
                />

                <Legend wrapperStyle={{ color: "#00FFE7" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Code Changes */}
        {codeContributions.length > 0 && (
          <div className="bg-[#0a0a0a] rounded-2xl p-6 border border-[#00FFE7]/20 shadow-[0_0_25px_rgba(0,255,231,0.05)]">
            <h4 className="text-lg font-semibold text-[#00FFE7] mb-4">
              Code Changes
            </h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={codeContributions} layout="horizontal">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(0,255,231,0.15)"
                />
                <XAxis type="number" stroke="#00FFE7" tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#00FFE7"
                  tickLine={false}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(0,255,231,0.05)" }} // soft cyan highlight
                />

                <Bar dataKey="count" fill="#00FFE7" radius={[4, 4, 0, 0]}>
                  {overviewStats.map((_, index) => (
                    <Cell
                      key={`bar-${index}`}
                      fill="#00FFE7"
                      style={{
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.filter =
                          "drop-shadow(0 0 10px #00ffe7)")
                      }
                      onMouseLeave={(e) => (e.target.style.filter = "none")}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Activity Timeline */}
        {chartData.activityTimeline?.prActivity?.length > 0 && (
          <div className="bg-[#0a0a0a] rounded-2xl p-6 border border-[#00FFE7]/20 shadow-[0_0_25px_rgba(0,255,231,0.05)]">
            <h4 className="text-lg font-semibold text-[#00FFE7] mb-4">
              Recent Activity
            </h4>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData.activityTimeline.prActivity}>
                <defs>
                  <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00FFE7" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#00FFE7" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(0,255,231,0.15)"
                />
                <XAxis dataKey="_id" stroke="#00FFE7" />
                <YAxis stroke="#00FFE7" />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(0,255,231,0.05)" }} // soft cyan highlight
                />

                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#00FFE7"
                  fill="url(#areaFill)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Pull Requests", value: userStats.totalPRs },
          { label: "Merged PRs", value: userStats.mergedPRs },
          { label: "Total Commits", value: userStats.totalCommits },
          { label: "Lines Changed", value: userStats.totalLinesChanged },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="rounded-xl p-4 bg-gradient-to-br from-[#00FFE7]/10 to-[#00FFE7]/5 border border-[#00FFE7]/30 text-center"
          >
            <div className="text-2xl font-bold text-[#00FFE7]">
              {stat.value?.toLocaleString() || 0}
            </div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Contribution Timeline */}
      {userStats.firstContribution && (
        <div className="bg-[#0a0a0a] rounded-2xl p-6 border border-[#00FFE7]/20 shadow-[0_0_25px_rgba(0,255,231,0.05)]">
          <h4 className="text-lg font-semibold text-[#00FFE7] mb-4">
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