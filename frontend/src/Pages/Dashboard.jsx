import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import SubscriptionList from "../components/SubscriptionList";
import SpendingChart from "../components/SpendingChart";
import Chatbot from "../components/Chatbot";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-[#050508] text-slate-200 font-sans overflow-hidden">
      {/* 1. Fixed Sidebar */}
      <Sidebar />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto custom-scrollbar relative">
        
        {/* Decorative Background Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

        <Navbar />

        <main className="p-8 relative z-10">
          <header className="mb-8">
            <h1 className="text-3xl font-black tracking-tight text-white italic uppercase">
              Command <span className="text-cyan-400">Center</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1 tracking-widest uppercase">System Analytics & Neural Interface</p>
          </header>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Spending Chart - Takes 7/12 columns */}
            <div className="lg:col-span-7 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-2xl hover:border-cyan-500/30 transition-colors">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]" />
                  Spending Analysis
                </h2>
                <span className="text-[10px] text-slate-500 font-mono">LIVE_DATA_STREAM</span>
              </div>
              <SpendingChart />
            </div>

            {/* Chatbot - Takes 5/12 columns */}
            <div className="lg:col-span-5">
               <Chatbot />
            </div>

            {/* Recent Subscriptions - Full Width at Bottom */}
            <div className="lg:col-span-12 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <div className="w-4 h-4 bg-purple-400 rounded-sm rotate-45" />
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">Recent Subscriptions</h2>
              </div>
              
              {/* Ensure SubscriptionList internal styles are updated to be transparent/dark */}
              <div className="overflow-hidden">
                <SubscriptionList />
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}