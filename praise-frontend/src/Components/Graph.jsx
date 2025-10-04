// import React from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// const data = [
//   { date: "01", last6Days: 5, lastWeek: 3 },
//   { date: "02", last6Days: 4, lastWeek: 5 },
//   { date: "03", last6Days: 5, lastWeek: 2 },
//   { date: "04", last6Days: 4, lastWeek: 5 },
//   { date: "05", last6Days: 6, lastWeek: 4 },
//   { date: "06", last6Days: 7, lastWeek: 3 },
//   { date: "07", last6Days: 5, lastWeek: 3 },
//   { date: "08", last6Days: 4, lastWeek: 5 },
//   { date: "09", last6Days: 5, lastWeek: 2 },
//   { date: "10", last6Days: 3, lastWeek: 5 },
//   { date: "11", last6Days: 6, lastWeek: 4 },
//   { date: "12", last6Days: 7, lastWeek: 3 },
// ];

// export default function PRChart() {
//   return (
//     <div className="w-full bg-gray-900 p-6 rounded-2xl shadow-lg">
//       <h2 className="text-gray-200 text-lg mb-4 text-center">
//         PRs raised from 1-12 Dec, 2020
//       </h2>
//       <ResponsiveContainer width="100%" height={300}>
//         <BarChart
//           data={data}
//           margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
//         >
//           <CartesianGrid
//             strokeDasharray="3 3"
//             stroke="#6b7280"
//             vertical={false}
//           />
//           <XAxis dataKey="date" stroke="#d1d5db" />
//           <YAxis stroke="#d1d5db" />
//           <Tooltip
//             cursor={{ fill: "#1f2937" }}
//             contentStyle={{ backgroundColor: "#111827", border: "none" }}
//             labelStyle={{ color: "#e5e7eb" }}
//           />
//           <Legend wrapperStyle={{ color: "#e5e7eb" }} />
//           <Bar
//             dataKey="last6Days"
//             fill="#6366f1"
//             name="Last 6 days"
//             radius={[4, 4, 0, 0]}
//           />
//           <Bar
//             dataKey="lastWeek"
//             fill="#f3f4f6"
//             name="Last Week"
//             radius={[4, 4, 0, 0]}
//           />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }
