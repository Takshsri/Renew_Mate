import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import SubscriptionList from "../components/SubscriptionList";
import { Menu, X } from "lucide-react"; // Make sure lucide-react is installed

export default function Subscriptions() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#050508] text-slate-200 font-sans overflow-x-hidden">
      
      {/* 1. Sidebar - Responsive Behavior */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:relative lg:translate-x-0 lg:flex
      `}>
        <Sidebar />
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile Header / Navbar Integration */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-md sticky top-0 z-30">
          <h2 className="text-xl font-black text-white italic">
            RENEW<span className="text-cyan-400">MATE</span>
          </h2>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 bg-white/5 rounded-lg border border-white/10 text-cyan-400"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <Navbar />

        <main className="p-4 sm:p-6 lg:p-8 relative">
          {/* Decorative Background Glow (matches Dashboard) */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />

          {/* Page Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase italic">
                Active <span className="text-cyan-400">Vault</span>
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-1 tracking-widest uppercase">
                Manage and monitor your digital assets
              </p>
            </div>

            {/* Quick Stats/Actions for Tablet/PC */}
            <div className="hidden sm:flex gap-4">
               <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-mono">
                  STATUS: <span className="text-green-400">ENCRYPTED</span>
               </div>
            </div>
          </div>

          {/* Subscription List Container */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden transition-all duration-300">
            <div className="p-1 sm:p-2">
              {/* Note: SubscriptionList needs to be responsive internally (Flex-wrap or Grid) */}
              <SubscriptionList />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}