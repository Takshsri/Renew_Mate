import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  BellDot, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  LayoutGrid
} from "lucide-react";
import logoImage from "../images/dashboard.png";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-[#020205] text-white font-sans selection:bg-violet-500/30 flex flex-col overflow-x-hidden">
      
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-violet-600/15 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      {/* 1. Navbar: Glassmorphic & Sticky */}
      <nav className="sticky top-0 z-50 w-full px-6 py-4 backdrop-blur-md border-b border-white/5">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg shadow-lg shadow-violet-500/20">
              <img src={logoImage} alt="Logo" className="w-7 h-7 object-cover rounded-md" />
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tighter bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              RenewMate
            </span>
          </div>
          <div className="flex items-center gap-4 md:gap-8">
            <Link to="/login" className="hidden sm:block text-xs font-bold text-slate-400 hover:text-white transition">Sign In</Link>
            <Link to="/register" className="bg-white text-black px-5 py-2.5 md:px-7 md:py-3 rounded-xl text-xs md:text-sm font-black hover:scale-105 active:scale-95 transition-all">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. Main Hero & Bento Section */}
      <main className="relative z-10 flex-grow flex items-center py-12 md:py-20 px-6">
        <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Content */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="lg:col-span-6 xl:col-span-5 space-y-6 md:space-y-8 text-center lg:text-left"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-[10px] font-bold uppercase tracking-widest">
              <Zap size={12} fill="currentColor" /> 
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl xl:text-8xl font-black tracking-tight leading-[0.95]">
              Track less.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 italic">Save More .</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-lg mx-auto lg:mx-0 font-medium">
              Automate your financial peace of mind. Manage every subscription in a clean, unified command center.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Link to="/demo" className="group flex items-center justify-center gap-2 bg-white/5 border border-white/10 px-8 py-4 rounded-2xl text-lg font-black hover:bg-white/10 transition-all">
                Explore Demo <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right: Bento Grid */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="lg:col-span-6 xl:col-span-7 grid grid-cols-2 gap-4 h-full"
          >
            {/* Feature 1: The Main Card */}
            <div className="col-span-2 p-6 md:p-8 bg-gradient-to-br from-white/10 to-transparent border border-white/10 rounded-[2rem] flex flex-col justify-between group hover:border-violet-500/40 transition-colors">
              <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center text-violet-400 mb-8">
                <BarChart3 size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-black mb-2">Visual Dashboard</h3>
                <p className="text-slate-400 text-sm max-w-sm">A unified timeline of your recurring expenses, updated in real-time.</p>
              </div>
            </div>

            {/* Feature 2: Smart Alerts */}
            <div className="p-6 md:p-8 bg-white/[0.03] border border-white/5 rounded-[2rem] flex flex-col justify-center items-center text-center group hover:bg-white/[0.06] transition-all">
              <div className="p-4 bg-orange-500/10 rounded-2xl text-orange-400 mb-4 group-hover:scale-110 transition-transform">
                <BellDot size={28} />
              </div>
              <h3 className="font-black text-lg">Smart Alerts</h3>
              <p className="text-slate-500 text-xs mt-1">Renewal pings before you pay.</p>
            </div>

            {/* Feature 3: Security */}
            <div className="p-6 md:p-8 bg-white/[0.03] border border-white/5 rounded-[2rem] flex flex-col justify-center items-center text-center group hover:bg-white/[0.06] transition-all">
              <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck size={28} />
              </div>
              <h3 className="font-black text-lg">Vault Secure</h3>
              <p className="text-slate-500 text-xs mt-1">Military-grade encryption.</p>
            </div>
          </motion.div>

        </div>
      </main>

      {/* 3. Stats Footer */}
      <footer className="w-full py-6 px-8 border-t border-white/5 bg-black/20">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-6 md:gap-10 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
            <span className="flex items-center gap-1.5"><ShieldCheck size={12}/> Secure</span>
            <span className="flex items-center gap-1.5"><LayoutGrid size={12}/> Cloud Sync</span>
            <span className="flex items-center gap-1.5"><Zap size={12}/> Automated</span>
          </div>
          <p className="text-[10px] font-bold text-slate-600">© 2026 RENEWMATE. CRAFTED FOR CLARITY.</p>
        </div>
      </footer>
    </div>
  );
}