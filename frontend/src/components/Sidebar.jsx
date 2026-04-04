import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Layers,
  PlusSquare,
  User,
  LogOut,
  Menu,
  X,
  Zap,
  Brain
} from "lucide-react";
import logoImage from "../images/dashboard.png";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "My Subscriptions", path: "/subscriptions", icon: <Layers size={20} /> },
    { name: "Add Subscription", path: "/add-subscription", icon: <PlusSquare size={20} /> },
    { name: "Renewal Prediction", path: "/ml-prediction", icon: <Brain size={20} /> },
    { name: "AI Assistant", path: "/chat", icon: <Zap size={20} /> },
    { name: "Account", path: "/profile", icon: <User size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleItemClick = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-[70] p-2 bg-cyan-600 text-white rounded-lg shadow-xl"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-[55] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-[60] w-64 bg-[#020205] border-r border-white/5 text-slate-400 p-6 flex flex-col transition-all duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <Link to="/" className="flex items-center gap-3 mb-10 px-2">
          <img src={logoImage} alt="Logo" className="w-8 h-8" />
          <h2 className="text-lg font-black text-white">
            Renew<span className="text-cyan-400">Mate</span>
          </h2>
        </Link>

        <nav className="flex flex-col gap-1.5 flex-grow">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleItemClick}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${
                isActive(item.path)
                  ? "bg-cyan-500/10 text-white"
                  : "hover:bg-white/[0.03]"
              }`}
            >
              {item.icon}
              <span className="font-bold text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="pt-6 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 rounded-2xl hover:text-red-400 w-full"
          >
            <LogOut size={20} />
            <span className="font-bold text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}