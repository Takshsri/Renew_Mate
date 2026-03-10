import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  CreditCard, 
  PlusCircle, 
  UserCircle, 
  Zap, 
  Home, 
  LogOut 
} from "lucide-react";
import logoImage from "../images/dashboard.png";

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Subscriptions", path: "/subscriptions", icon: <CreditCard size={20} /> },
    { name: "Add New", path: "/add-subscription", icon: <PlusCircle size={20} /> },
    { name: "Profile", path: "/profile", icon: <UserCircle size={20} /> },
  ];

  return (
    <div className="h-screen w-64 bg-[#020205] border-r border-white/5 text-slate-400 p-6 flex flex-col shadow-[20px_0_50px_rgba(0,0,0,0.3)] relative z-50">
      
      {/* 1. Brand Logo Area */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="p-1.5 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg shadow-lg shadow-violet-500/20">
          <img src={logoImage} alt="Logo" className="w-6 h-6 object-cover rounded" />
        </div>
        <h2 className="text-lg font-black tracking-tighter text-white uppercase italic">
          Renew<span className="text-violet-400">Mate</span>
        </h2>
      </div>

      {/* 2. Main Navigation */}
      <nav className="flex flex-col gap-2 flex-grow">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-2 ml-2">Main Menu</p>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`group flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 border ${
              isActive(item.path)
                ? "bg-violet-500/10 border-violet-500/20 text-white shadow-[0_0_20px_rgba(139,92,246,0.1)]"
                : "border-transparent hover:bg-white/[0.03] hover:text-slate-200"
            }`}
          >
            <span className={`${isActive(item.path) ? "text-violet-400" : "text-slate-500 group-hover:text-slate-300"}`}>
              {item.icon}
            </span>
            <span className="font-bold text-sm tracking-tight">{item.name}</span>
            
            {isActive(item.path) && (
              <div className="ml-auto w-1 h-4 bg-violet-500 rounded-full shadow-[0_0_10px_#8b5cf6]" />
            )}
          </Link>
        ))}
      </nav>

      {/* 3. Bottom Utility Section */}
      <div className="flex flex-col gap-2 pt-6 border-t border-white/5">
        
        {/* Back to Home Button */}
        <Link
          to="/"
          className="flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-500 hover:bg-white/[0.03] hover:text-white transition-all group"
        >
          <Home size={20} className="group-hover:text-violet-400 transition-colors" />
          <span className="font-bold text-sm tracking-tight">Landing Page</span>
        </Link>

        {/* Logout Button */}
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all group"
        >
          <LogOut size={20} />
          <span className="font-bold text-sm tracking-tight">Logout</span>
        </button>

        {/* User Mini-Profile (Decorative) */}
        <div className="mt-4 p-3 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-blue-500 flex items-center justify-center text-[10px] font-black text-white">
            JD
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-black text-white truncate uppercase tracking-tighter">John Doe</p>
            <p className="text-[9px] text-slate-600 truncate font-bold uppercase">Pro Member</p>
          </div>
        </div>
      </div>
    </div>
  );
}