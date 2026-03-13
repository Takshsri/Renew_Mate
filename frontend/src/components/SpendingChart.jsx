import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function SpendingChart({ stats }) {

  const data = [
    { name: "Monthly", amount: stats?.monthlySpending || 0 },
  ];

  return (
    <div className="bg-white/5 p-6 rounded-3xl border border-white/5 shadow-xl">

      <h2 className="text-lg font-semibold mb-4 text-white">
        Monthly Spending
      </h2>

      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>

            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />

            <XAxis dataKey="name" stroke="#94a3b8" />

            <YAxis stroke="#94a3b8" />

            <Tooltip
              contentStyle={{
                background: "#0f172a",
                border: "none",
                borderRadius: "10px"
              }}
            />

            <Bar
              dataKey="amount"
              fill="#22d3ee"
              radius={[10, 10, 0, 0]}
            />

          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}