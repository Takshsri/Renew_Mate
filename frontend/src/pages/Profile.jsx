import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Menu, X, User, Mail, Phone, Lock, ShieldCheck, Save } from "lucide-react";
import toast from "react-hot-toast";
export default function Profile() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: ""
  });

  // 1. Fixed useEffect logic and placement
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setFormData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || "",
            phone: data.phone || "",
            password: "" // Keep password empty
          });
        }
      } catch (error) {
        console.error("Failed to load profile");
      }
    };
    fetchProfile();
  }, []); // Empty dependency array ensures this only runs once

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Profile updated successfully");
      } else {
        toast.error(Array.isArray(data.message) ? data.message[0] : data.message);
      }
    } catch (error) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#050508] text-slate-200 font-sans">
      
      {/* 2. FIXED SIDEBAR WRAPPER */}
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

      {/* 3. FIXED MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-md sticky top-0 z-30">
          <h2 className="text-xl font-black text-white italic">RENEW<span className="text-cyan-400">MATE</span></h2>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-white/5 rounded-lg border border-white/10 text-cyan-400">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <Navbar />

        {/* Scrollable Section */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-10 relative">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-5xl mx-auto">
        

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
              
              {/* Left Column: Visual Profile Card */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-2xl text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
                  
                  <div className="relative inline-block mb-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-400 p-1">
                      <div className="w-full h-full rounded-full bg-[#0a0a0f] flex items-center justify-center overflow-hidden">
                        <User size={48} className="text-cyan-400" />
                      </div>
                    </div>
                    <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-[#0a0a0f] rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                  </div>

                  <h3 className="text-xl font-bold text-white">{formData.firstName} {formData.lastName}</h3>
                  
                  
                </div>

                <div className="bg-cyan-500/5 border border-cyan-500/20 p-6 rounded-2xl flex items-start gap-4">
                   <ShieldCheck className="text-cyan-400 shrink-0" size={20} />
                   <p className="text-[11px] text-slate-400 leading-relaxed">
                     Your profile is protected by 256-bit neural encryption. Changes to your email or phone will require re-verification.
                   </p>
                </div>
              </div>

              {/* Right Column: Edit Form */}
              <div className="lg:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 p-6 sm:p-10 rounded-3xl shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">First Name</label>
                      <div className="relative group">
                        <User className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                        <input 
                          type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                          className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Last Name</label>
                      <div className="relative group">
                        <User className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                        <input 
                          type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                          className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                      <input 
                        type="email" name="email" value={formData.email} onChange={handleChange}
                        className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Phone Number</label>
                    <div className="relative group">
                      <Phone className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                      <input 
                        type="tel" name="phone" value={formData.phone} onChange={handleChange}
                        className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pb-4">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                      <input 
                        type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange}
                        className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-700"
                      />
                    </div>
                  </div>

                  <button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black tracking-widest text-xs py-4 rounded-xl shadow-[0_0_20px_rgba(8,145,178,0.2)] transition-all flex items-center justify-center gap-2">
                    <Save size={18} /> UPDATE IDENTITY
                  </button>
                </form>
              </div>

            </div>
          </div>
          <div className="h-20" />
        </main>
      </div>
    </div>
  );
}