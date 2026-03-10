import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import SubscriptionList from "../components/SubscriptionList";
import SpendingChart from "../components/SpendingChart";
import Chatbot from "../components/Chatbot";
import { API_URL } from "../api/api";

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
      
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto custom-scrollbar relative">

        <Navbar />

        <main className="p-8 relative z-10">

          <header className="mb-8">
            <h1 className="text-3xl font-black tracking-tight text-white italic uppercase">
              Command <span className="text-cyan-400">Center</span>
            </h1>
          </header>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">

              <div className="bg-white/5 p-4 rounded-xl">
                <p className="text-sm text-slate-400">Total</p>
                <h2 className="text-xl font-bold">{stats.totalSubscriptions}</h2>
              </div>

              <div className="bg-white/5 p-4 rounded-xl">
                <p className="text-sm text-slate-400">Active</p>
                <h2 className="text-xl font-bold">{stats.activeSubscriptions}</h2>
              </div>

              <div className="bg-white/5 p-4 rounded-xl">
                <p className="text-sm text-slate-400">Upcoming</p>
                <h2 className="text-xl font-bold">{stats.upcomingRenewals}</h2>
              </div>

              <div className="bg-white/5 p-4 rounded-xl">
                <p className="text-sm text-slate-400">Monthly Spend</p>
                <h2 className="text-xl font-bold">₹{stats.monthlySpending}</h2>
              </div>

            </div>
          )}

          {/* Existing layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            <div className="lg:col-span-7 bg-white/5 p-6 rounded-3xl">
              <SpendingChart stats={stats} />
            </div>

            <div className="lg:col-span-5">
              <Chatbot />
            </div>

            <div className="lg:col-span-12 bg-white/5 p-6 rounded-3xl">
              <SubscriptionList />
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}