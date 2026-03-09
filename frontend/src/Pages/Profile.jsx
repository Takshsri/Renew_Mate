import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Menu, X, User, Mail, Phone, Lock, ShieldCheck, Save } from "lucide-react";

export default function Profile() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Example state for the form
  const [formData, setFormData] = useState({
    firstName: "Maya",
    lastName: "Zen",
    email: "maya@email.com",
    phone: "+1 (555) 000-1234",
    password: "**************"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex min-h-screen bg-[#050508] text-slate-200 font-sans overflow-x-hidden">
      
      {/* Responsive Sidebar */}
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

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-md sticky top-0 z-30">
          <h2 className="text-xl font-black text-white italic">RENEW<span className="text-cyan-400">MATE</span></h2>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-white/5 rounded-lg border border-white/10 text-cyan-400">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <Navbar />

        <main className="p-4 sm:p-6 lg:p-8 relative">
          {/* Ambient Background Glow */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-5xl mx-auto">
            <header className="mb-10">
              <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">
                User <span className="text-cyan-400">Identity</span>
              </h1>
              <p className="text-slate-500 text-sm mt-1 tracking-widest">MANAGE ACCOUNT CREDENTIALS AND SECURITY</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
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
                  <p className="text-cyan-400/70 text-xs font-mono tracking-widest mt-1">CORE_USER_ID: 8829-X</p>
                  
                  <div className="mt-8 pt-8 border-t border-white/5 space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 uppercase">Security Level</span>
                      <span className="text-white font-bold">Standard</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 uppercase">Status</span>
                      <span className="text-green-400 font-bold">Verified</span>
                    </div>
                  </div>
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
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">First Name</label>
                      <div className="relative group">
                        <User className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                        <input 
                          type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                          className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                        />
                      </div>
                    </div>

                    {/* Last Name */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Last Name</label>
                      <div className="relative group">
                        <User className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                        <input 
                          type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                          className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                      <input 
                        type="email" name="email" value={formData.email} onChange={handleChange}
                        className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Phone Number</label>
                    <div className="relative group">
                      <Phone className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                      <input 
                        type="tel" name="phone" value={formData.phone} onChange={handleChange}
                        className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2 pb-4">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                      <input 
                        type="password" name="password" placeholder="Change Password"
                        className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-700"
                      />
                    </div>
                  </div>

                  <button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(8,145,178,0.3)] transition-all flex items-center justify-center gap-2">
                    <Save size={18} /> SAVE CHANGES
                  </button>
                </form>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}