import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../api/api";
import { ArrowLeft, Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import logoImage from "../images/dashboard.png";
import toast from "react-hot-toast";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.access_token);
        navigate("/dashboard");
      } else {
        toast.error(Array.isArray(data.message) ? data.message[0] : data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#020205] text-white font-sans flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden relative">
      
      {/* Background Cosmic Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-violet-600/20 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-blue-600/15 blur-[100px] rounded-full" />
      </div>

      {/* Back to Home Navigation */}
      <div className="absolute top-6 left-6 z-20">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-slate-400 hover:text-violet-400 transition-colors text-sm font-bold tracking-tight uppercase"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>
      </div>

      <div className="w-full max-w-md z-10">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="mb-4">
            <div className="p-2 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl shadow-lg shadow-violet-500/20 group">
              <img 
                src={logoImage} 
                alt="Logo" 
                className="w-12 h-12 rounded-xl object-cover group-hover:scale-105 transition-transform" 
              />
            </div>
          </Link>
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-center">
            Welcome Back
          </h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            Sign in to manage your cosmic renewals.
          </p>
        </div>

        {/* Glassmorphic Login Card */}
        <div className="bg-white/[0.03] backdrop-blur-2xl p-6 sm:p-10 rounded-[2.5rem] border border-white/10 shadow-2xl">
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-violet-400 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all text-sm"
                />
              </div>
            </div>

            {/* Password Field */}
<div className="relative group">
  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-violet-400 transition-colors">
    <Lock size={18} />
  </div>

  <input
    type={showPassword ? "text" : "password"}
    required
    placeholder="••••••••"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full bg-white/5 border border-white/10 p-4 pl-12 pr-12 rounded-2xl focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all text-sm"
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-violet-400 transition-colors"
  >
    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
</div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full bg-white text-black py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-violet-500 hover:text-white transition-all transform active:scale-[0.98] shadow-xl shadow-white/5 flex items-center justify-center gap-2"
            >
              <LogIn size={18} />
              Sign In
            </button>
          </form>

          {/* Bottom Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500 font-medium">
              Don't have an account?
              <Link to="/register" className="text-violet-400 font-bold ml-2 hover:text-white transition-colors underline decoration-violet-500/30 underline-offset-4">
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Simple Footer Links */}
        <div className="mt-8 flex justify-center gap-6 opacity-40 hover:opacity-100 transition-opacity">
          <Link to="/privacy" className="text-[10px] font-bold uppercase tracking-widest hover:text-white">Privacy</Link>
          <Link to="/terms" className="text-[10px] font-bold uppercase tracking-widest hover:text-white">Terms</Link>
        </div>
      </div>
    </div>
  );
}