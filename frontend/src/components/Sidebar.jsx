import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Layers,      // Better for Subscriptions
  PlusSquare,  // Better for Add New
  User,        // Clean Profile icon
  LogOut,
  Menu,
  X,
  Zap,         // AI Chat
  Settings     // Optional
} from "lucide-react";
import logoImage from "../images/dashboard.png";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Optimized NavItems with more "Correct" Icons
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "My Subscriptions", path: "/subscriptions", icon: <Layers size={20} /> },
    { name: "Add Subscription", path: "/add-subscription", icon: <PlusSquare size={20} /> },
    { name: "AI Assistant", path: "/chat", icon: <Zap size={20} /> },
    { name: "Account", path: "/profile", icon: <User size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Improved click handler: only closes sidebar if we are on mobile (screen < 1024px)
  const handleItemClick = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* MOBILE TRIGGER */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-[70] p-2 bg-cyan-600 text-white rounded-lg shadow-xl active:scale-90 transition-transform"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[55] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <aside className={`
        fixed inset-y-0 left-0 z-[60] w-64 bg-[#020205] border-r border-white/5 text-slate-400 p-6 flex flex-col 
        transition-all duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 mb-10 px-2 group">
          <div className="p-1.5 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg group-hover:rotate-12 transition-transform">
            <img src={logoImage} alt="Logo" className="w-6 h-6 object-cover rounded" />
          </div>
          <h2 className="text-lg font-black tracking-tighter text-white uppercase italic">
            Renew<span className="text-cyan-400">Mate</span>
          </h2>
        </Link>

        {/* Main Navigation */}
        <nav className="flex flex-col gap-1.5 flex-grow">
          
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleItemClick}
              className={`group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 border ${
                isActive(item.path)
                  ? "bg-cyan-500/10 border-cyan-500/20 text-white shadow-[inset_0_0_10px_rgba(6,182,212,0.05)]"
                  : "border-transparent hover:bg-white/[0.03] hover:text-slate-200"
              }`}
            >
              <div className={`transition-colors ${isActive(item.path) ? "text-cyan-400" : "text-slate-500 group-hover:text-cyan-400/70"}`}>
                {item.icon}
              </div>
              <span className="font-bold text-sm tracking-tight">{item.name}</span>
              
              {isActive(item.path) && (
                <div className="ml-auto w-1.5 h-1.5 bg-cyan-500 rounded-full shadow-[0_0_8px_#06b6d4]" />
              )}
            </Link>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="pt-6 border-t border-white/5">
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-600 hover:bg-red-500/10 hover:text-red-400 transition-all w-full group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-sm tracking-tight"> Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}