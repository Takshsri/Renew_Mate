import { Link, useLocation } from "react-router-dom";
// Using Lucide icons for a modern tech feel
import { LayoutDashboard, CreditCard, PlusCircle, UserCircle, Zap } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  // Helper to highlight the active link
  const isActive = (path) => location.pathname === path;

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Subscriptions", path: "/subscriptions", icon: <CreditCard size={20} /> },
    { name: "Add Subscription", path: "/add-subscription", icon: <PlusCircle size={20} /> },
    { name: "Profile", path: "/profile", icon: <UserCircle size={20} /> },
  ];

  return (
    <div className="h-screen w-64 bg-[#0a0a0f] border-r border-white/10 text-slate-300 p-6 flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
      
      {/* Brand Logo with Glow */}
      <div className="flex items-center gap-3 mb-12">
        <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
          <Zap className="text-cyan-400" size={24} fill="currentColor" />
        </div>
        <h2 className="text-xl font-black tracking-tighter text-white uppercase">
          Renew<span className="text-cyan-400">Mate</span>
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 border ${
              isActive(item.path)
                ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.1)]"
                : "border-transparent hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className={`${isActive(item.path) ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-300"}`}>
              {item.icon}
            </span>
            <span className="font-medium text-sm tracking-wide">{item.name}</span>
            
            {/* Active Indicator Dot */}
            {isActive(item.path) && (
              <div className="ml-auto w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]" />
            )}
          </Link>
        ))}
      </nav>

      {/* User Status / Bottom Section */}
      
    </div>
  );
}