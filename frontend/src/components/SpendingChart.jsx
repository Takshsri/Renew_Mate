import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function SpendingChart({ stats }) {
  if (!stats) return null;

  const chartData = [
    {
      cycle: "Weekly",
      amount: stats.weeklySpending || 0,
    },
    {
      cycle: "Monthly",
      amount: stats.monthlySpending || 0,
    },
    {
      cycle: "Yearly",
      amount: stats.yearlySpending || 0,
    },
  ];

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-white mb-4">
        Spending Trend
      </h2>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="4 4" stroke="#334155" />
            <XAxis dataKey="cycle" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "12px",
              }}
            />

            <Line
              type="monotone"
              dataKey="amount"
              stroke="#22d3ee"
              strokeWidth={4}
              dot={{ r: 6, fill: "#22d3ee" }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}