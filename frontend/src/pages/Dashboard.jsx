import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import SubscriptionList from "../components/SubscriptionList";
import SpendingChart from "../components/SpendingChart";
import { API_URL } from "../api/api";
import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(`${API_URL}/dashboard`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setStats(data.stats);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#050508] text-slate-200 font-sans overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden lg:pl-64 transition-all duration-300">
        <Navbar />

        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 relative">
          <div className="max-w-7xl mx-auto w-full">

            {/* Header */}
            <header className="mb-8 mt-14 lg:mt-0 flex justify-between items-center">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white italic uppercase">
                Command <span className="text-cyan-400">Center</span>
              </h1>
            </header>

            {/* Stats Cards */}
            {stats ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <StatCard label="Total" value={stats.totalSubscriptions} />
                <StatCard label="Active" value={stats.activeSubscriptions} />
                <StatCard label="Expired" value={stats.expiredSubscriptions || 0} />
                <StatCard label="Upcoming" value={stats.upcomingRenewals} />
                <StatCard label="Monthly Spend" value={`₹${stats.monthlySpending}`} highlight />
              </div>
            ) : (
              <div className="text-cyan-400 text-xs font-bold animate-pulse uppercase tracking-widest">
                Loading Dashboard Data...
              </div>
            )}

            {/* Chart + Subscriptions */}
            <div className="space-y-6 pb-24">

              <div className="bg-white/5 p-4 md:p-6 rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
                <SpendingChart stats={stats} />
              </div>

              <div className="bg-white/5 p-4 md:p-6 rounded-3xl border border-white/5 shadow-2xl">
                <SubscriptionList />
              </div>

            </div>
          </div>
        </main>

        {/* Floating AI Assistant */}
        <Link
          to="/chat"
          className="fixed bottom-8 right-8 z-50 group flex items-center gap-3 transition-transform hover:scale-105"
        >
          <span className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-2xl">
            Ask AI Assistant
          </span>

          <div className="relative">
            <div className="absolute -inset-2 bg-cyan-500/20 rounded-full blur-xl animate-pulse"></div>

            <div className="relative bg-[#0d0d12] border border-white/10 p-4 rounded-full shadow-2xl flex items-center justify-center">
              <MessageSquare className="text-cyan-400" size={28} />

              <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-cyan-500 border-2 border-[#050508] rounded-full"></div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

function StatCard({ label, value, highlight }) {
  return (
    <div className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
        {label}
      </p>

      <h2
        className={`text-2xl font-bold ${
          highlight ? "text-cyan-400" : "text-white"
        }`}
      >
        {value}
      </h2>
    </div>
  );
}