import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logoImage from "../images/dashboard.png";

export default function Home() {
  return (
    // Height screen prevents excessive scrolling on desktop
    <div className="min-h-screen lg:h-screen bg-[#0B0B0F] text-white font-sans selection:bg-violet-500/30 flex flex-col overflow-x-hidden">
      
      {/* Background Glows - Fixed so they don't move */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      {/* 1. Minimalist Wide Navbar */}
      <nav className="relative z-50 w-full px-8 py-6">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img 
              src={logoImage} 
              alt="Logo" 
              className="w-10 h-10 rounded-xl border border-white/10 object-cover" 
            />
            <span className="text-2xl font-black tracking-tighter">RenewMate</span>
          </div>
          <div className="hidden md:flex items-center gap-10">
            <Link to="/login" className="text-sm font-bold text-slate-400 hover:text-white transition">Sign In</Link>
            <Link to="/register" className="bg-white text-black px-7 py-3 rounded-2xl text-sm font-black hover:bg-violet-500 hover:text-white transition-all shadow-xl">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. Main Content - Flex-grow to fill screen */}
      <main className="relative z-10 flex-grow flex items-center px-8 pb-12 lg:pb-0">
        <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Hero Text (Less Compact, More Air) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-6 xl:col-span-5 space-y-8"
          >
            <div className="inline-block px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-400 text-[10px] font-black uppercase tracking-[0.3em]">
              Smart Finance Management
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
              Track less.<br />
              <span className="text-violet-500 italic">Save more.</span>
            </h1>
            
            <p className="text-xl text-slate-400 leading-relaxed max-w-lg font-medium">
              A calm, automated space to manage every subscription. No more hidden fees or forgotten trials.
            </p>

            <div className="flex flex-wrap gap-5 pt-4">
              <button className="bg-violet-600 text-white px-10 py-5 rounded-3xl text-lg font-black hover:bg-violet-500 hover:scale-105 transition-all shadow-[0_0_30px_rgba(139,92,246,0.2)]">
                Join RenewMate
              </button>
              <button className="bg-white/5 border border-white/10 px-10 py-5 rounded-3xl text-lg font-black hover:bg-white/10 transition-all backdrop-blur-sm">
                View Demo
              </button>
            </div>
          </motion.div>

          {/* Right Column: Feature Bento (Non-Scrollable Layout) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-6 xl:col-span-7 grid grid-cols-2 gap-4"
          >
            {/* Main Dashboard Card */}
            <div className="col-span-2 p-8 bg-gradient-to-br from-white/10 to-transparent border border-white/10 rounded-[2.5rem] min-h-[220px] flex flex-col justify-end group">
              <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center mb-4 text-violet-400 group-hover:scale-110 transition-transform">📊</div>
              <h3 className="text-2xl font-black mb-2">Automated Dashboard</h3>
              <p className="text-slate-400 text-sm">Every recurring payment visualized in a single, clean timeline.</p>
            </div>

            {/* Square 1 */}
            <div className="p-8 bg-[#16161D] border border-white/5 rounded-[2.5rem] flex flex-col justify-center items-center text-center group">
              <div className="text-4xl font-black text-violet-500 mb-2 transition-transform group-hover:scale-110">!</div>
              <h3 className="font-black text-lg">Alerts</h3>
              <p className="text-slate-500 text-xs mt-1">Instant pings for renewals.</p>
            </div>

            {/* Square 2 */}
            <div className="p-8 bg-[#16161D] border border-white/5 rounded-[2.5rem] flex flex-col justify-center items-center text-center group">
              <div className="text-4xl font-black text-emerald-400 mb-2 transition-transform group-hover:scale-110">$0</div>
              <h3 className="font-black text-lg">Waste</h3>
              <p className="text-slate-500 text-xs mt-1">Zero forgotten trials.</p>
            </div>
          </motion.div>

        </div>
      </main>

      {/* 3. Footer / Stats Bar (Simple & Low-profile) */}
      <footer className="relative z-10 py-8 px-8 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest gap-4">
          <div className="flex gap-8">
            <p>100% Secure</p>
            <p>GDPR Compliant</p>
            <p>Cloud Encrypted</p>
          </div>
          <p className="opacity-50">© 2024 RenewMate. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}