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

const milestones = [
  {
    level: "5 PRs",
    title: "Initium",
    active: true,
    img: "/images/8.png",
  },
  {
    level: "10 PRs",
    title: "Progressus",
    active: true,
    img: "/images/9.png",
  },
  {
    level: "25 PRs",
    title: "Fortis",
    active: true,
    img: "/images/10.png",
  },
  {
    level: "50 PRs",
    title: "Praetor",
    active: true,
    img: "/images/11.png",
  },
  {
    level: "75 PRs",
    title: "Magister",
    active: true,
    img: "/images/12.png",
  },
  {
    level: "100 PRs",
    title: "Eximius",
    active: true,
    img: "/images/13.png",
  },
];

const modes = ["Pull Requests", "Commits", "Issues Resolved"];

const chartData = [
  { date: "01", last6Days: 5, lastWeek: 3 },
  { date: "02", last6Days: 4, lastWeek: 5 },
  { date: "03", last6Days: 5, lastWeek: 2 },
  { date: "04", last6Days: 4, lastWeek: 5 },
  { date: "05", last6Days: 6, lastWeek: 4 },
  { date: "06", last6Days: 7, lastWeek: 3 },
  { date: "07", last6Days: 5, lastWeek: 3 },
  { date: "08", last6Days: 4, lastWeek: 5 },
  { date: "09", last6Days: 5, lastWeek: 2 },
  { date: "10", last6Days: 3, lastWeek: 5 },
  { date: "11", last6Days: 6, lastWeek: 4 },
  { date: "12", last6Days: 7, lastWeek: 3 },
];

const Milestones = () => {
  const [mode, setMode] = useState("Pull Requests");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-white flex flex-col items-center overflow-x-hidden px-6 sm:px-10 py-12">
      {/* Header */}
      <div className="w-full max-w-6xl flex flex-col sm:flex-row justify-between items-center gap-6 mb-12">
        <h1 className="text-3xl font-bold text-center sm:text-left">
          Milestones
        </h1>
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
              <div className="flex flex-col items-center text-center flex-1 min-w-[80px]">
                <motion.div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center overflow-hidden ${
                    m.active
                      ? "bg-[#00ffe7]/20 border-2 border-[#00ffe7]"
                      : "bg-gray-800 border border-gray-700"
                  } shadow-[0_4px_12px_rgba(0,255,231,0.1)]`}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={m.img}
                    alt={m.title}
                    className={`object-contain w-10 h-10 sm:w-12 sm:h-12 ${
                      m.active ? "opacity-100" : "opacity-50 grayscale"
                    }`}
                  />
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

        <motion.button
          whileHover={{ scale: 1.05 }}
          className="mt-14 px-6 py-3 rounded-xl bg-[#00ffe7]/20 border border-[#00ffe7]/40 text-[#00ffe7] hover:bg-[#00ffe7]/30 transition-all duration-300"
        >
          ✏️ Edit Milestones
        </motion.button>
      </div>

      {/* Chart Section */}
      <div className="w-full max-w-6xl mt-16 bg-gray-900 p-6 rounded-2xl shadow-lg">
        <h2 className="text-gray-200 text-lg mb-4 text-center">
          PRs raised from 1–12 Dec, 2020
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
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
              dataKey="last6Days"
              fill="#6366f1"
              name="Last 6 days"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="lastWeek"
              fill="#f3f4f6"
              name="Last Week"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Milestones;
