import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from "recharts";

export default function SpendingChart({ subscriptions = [] }) {
  const monthly = subscriptions.filter((s) => s.billingCycle === "MONTHLY").length;
  const yearly = subscriptions.filter((s) => s.billingCycle === "YEARLY").length;
  const weekly = subscriptions.filter((s) => s.billingCycle === "WEEKLY").length;

  const monthlySpend = subscriptions
    .filter((s) => s.billingCycle === "MONTHLY")
    .reduce((sum, s) => sum + Number(s.price), 0);

  const yearlySpend = subscriptions
    .filter((s) => s.billingCycle === "YEARLY")
    .reduce((sum, s) => sum + Number(s.price), 0);

  const weeklySpend = subscriptions
    .filter((s) => s.billingCycle === "WEEKLY")
    .reduce((sum, s) => sum + Number(s.price), 0);

  const cycleData = [
    { name: "Weekly", count: weekly, spend: weeklySpend },
    { name: "Monthly", count: monthly, spend: monthlySpend },
    { name: "Yearly", count: yearly, spend: yearlySpend },
  ];

  const trendData = subscriptions
    .slice(0, 12)
    .map((sub, index) => ({
      name: sub.serviceName.slice(0, 8),
      price: Number(sub.price),
      index: index + 1,
    }))
    .sort((a, b) => a.price - b.price);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white mb-4">
          Subscription Cycle Distribution
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cycleData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                }}
              />
              <Legend />
              <Bar dataKey="count" fill="#22d3ee" radius={[8, 8, 0, 0]} />
              <Bar dataKey="spend" fill="#818cf8" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-white mb-4">
          Price Trend by Subscription
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
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
                dataKey="price"
                stroke="#22d3ee"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
