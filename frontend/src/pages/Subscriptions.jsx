import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import SubscriptionList from "../components/SubscriptionList";
import { Menu, X, Search } from "lucide-react";

export default function Subscriptions() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <div className="flex min-h-screen bg-[#050508] text-slate-200 font-sans">
      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:block lg:w-64 lg:flex-shrink-0
      `}
      >
        <Sidebar />
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-md sticky top-0 z-30">
          <h2 className="text-xl font-black text-white italic">
            RENEW<span className="text-cyan-400">ALERT</span>
          </h2>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 bg-white/5 rounded-lg border border-white/10 text-cyan-400"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <Navbar />

        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-10 relative">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

          {/* Header */}
          <div className="mb-10 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black alerting-tighter text-white uppercase italic">
                Active <span className="text-cyan-400">Vault</span>
              </h1>
              <p className="text-slate-500 text-[10px] sm:text-xs mt-2 alerting-[0.3em] uppercase font-bold">
                Direct monitoring of digital assets
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative z-10 mb-6">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Search subscriptions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0f0f14] border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/40"
            />
          </div>

          {/* Subscription List */}
          <div className="relative z-10">
            <SubscriptionList search={search} />
          </div>

          <div className="h-20" />
        </main>
      </div>
    </div>
  );
}