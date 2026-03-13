import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Chatbot from "../components/Chatbot";
import { Menu, X } from "lucide-react";

export default function ChatPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#050508] text-slate-200 font-sans">
      
      {/* Sidebar - Consistent with other pages */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:static lg:translate-x-0 lg:block lg:w-64 lg:flex-shrink-0
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Mobile Toggle (Hidden on Desktop) */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-md sticky top-0 z-30">
          <h2 className="text-xl font-black text-white italic">RENEW<span className="text-cyan-400">MATE</span></h2>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-white/5 rounded-lg border border-white/10 text-cyan-400">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <Navbar />

        {/* The Chatbot component now sits inside the layout */}
        <main className="flex-1 relative overflow-hidden">
          <Chatbot />
        </main>
      </div>
    </div>
  );
}