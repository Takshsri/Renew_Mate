import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Phone, Lock, UserPlus } from "lucide-react";
import logoImage from "../images/dashboard.png";
import toast from "react-hot-toast";
export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password, phone }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Account created successfully");
        navigate("/login");
      } else {
        toast.error(Array.isArray(data.message) ? data.message[0] : data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#020205] text-white font-sans flex flex-col items-center justify-center p-4 sm:p-8 overflow-x-hidden relative">
      
      {/* Background Cosmic Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-violet-600/20 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-blue-600/15 blur-[100px] rounded-full" />
      </div>

      {/* Back to Home Navigation */}
      <div className="absolute top-6 left-6 z-20">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-slate-400 hover:text-violet-400 transition-colors text-sm font-bold tracking-tight uppercase"
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Back to home</span>
        </Link>
      </div>

      <div className="w-full max-w-lg z-10 py-12">
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
            Create Account
          </h2>
          <p className="text-slate-500 text-sm mt-2 font-medium text-center">
            Join thousands managing subscriptions smarter.
          </p>
        </div>

        {/* Glassmorphic Register Card */}
        <div className="bg-white/[0.03] backdrop-blur-2xl p-6 sm:p-10 rounded-[2.5rem] border border-white/10 shadow-2xl">
          <form onSubmit={handleRegister} className="flex flex-col gap-5">
            
            {/* Name Fields Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">First Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-violet-400 transition-colors">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 p-4 pl-10 rounded-2xl focus:outline-none focus:border-violet-500/50 transition-all text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Last Name</label>
                <input
                  type="text"
                  required
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:outline-none focus:border-violet-500/50 transition-all text-sm"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-violet-400 transition-colors">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 p-4 pl-10 rounded-2xl focus:outline-none focus:border-violet-500/50 transition-all text-sm"
                />
              </div>
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-violet-400 transition-colors">
                  <Phone size={16} />
                </div>
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 p-4 pl-10 rounded-2xl focus:outline-none focus:border-violet-500/50 transition-all text-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-violet-400 transition-colors">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 p-4 pl-10 rounded-2xl focus:outline-none focus:border-violet-500/50 transition-all text-sm"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full bg-white text-black py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-violet-500 hover:text-white transition-all transform active:scale-[0.98] shadow-xl flex items-center justify-center gap-2 mt-2"
            >
              <UserPlus size={18} />
              Get Started
            </button>
          </form>

          {/* Bottom Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500 font-medium">
              Already have an account?
              <Link to="/login" className="text-violet-400 font-bold ml-2 hover:text-white transition-colors underline decoration-violet-500/30 underline-offset-4">
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <p className="mt-8 text-center text-[10px] font-bold text-slate-600 uppercase tracking-widest">
          Secure • Encrypted • Private
        </p>
      </div>
    </div>
  );
}