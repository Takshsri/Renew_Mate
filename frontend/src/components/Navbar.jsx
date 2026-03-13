import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Menu, X, User } from "lucide-react"; // Optional: Use Lucide for clean icons

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem("token");

  let userName = "User";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userName = decoded.firstName || "User";
    } catch (e) {
      console.error("Invalid token");
    }
  }

  return (
    <nav className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo Area */}
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-lg md:text-xl font-bold text-gray-800 tracking-tight">
              RenewMate <span className="text-blue-600">Dashboard</span>
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <span className="text-gray-600 font-medium">
              Hello, {userName}
            </span>
            <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-sm">
              {userName[0].toUpperCase()}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-blue-600 focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-gray-50 border-t border-gray-100 px-4 py-4 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
              {userName[0].toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{userName}</p>
              <p className="text-xs text-gray-500">Account Settings</p>
            </div>
          </div>
          {/* You can add more mobile links here */}
          <button className="w-full text-left px-2 py-2 text-gray-600 hover:bg-gray-100 rounded">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}