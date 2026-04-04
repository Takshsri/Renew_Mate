import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  LayoutGrid,
  PlayCircle,
  Sparkles
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

      {/* 1. Navbar */}
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

      {/* 2. Main Hero & Video Section */}
      <main className="relative z-10 flex-grow flex items-center py-12 md:py-20 px-6">
        <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: New Content */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="lg:col-span-5 space-y-6 md:space-y-8 text-center lg:text-left"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-400 text-[10px] font-bold uppercase tracking-widest">
              <Sparkles size={12} fill="currentColor" /> 
              The Future of Finance
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl xl:text-8xl font-black tracking-tight leading-[0.95]">
              Master your<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400 italic">Sub-Economy.</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-lg mx-auto lg:mx-0 font-medium">
              Stop the silent drain on your bank account. RenewMate orchestrates your recurring life, giving you total command over every dollar spent.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Link to="/demo" className="group flex items-center justify-center gap-2 bg-violet-600 px-8 py-4 rounded-2xl text-lg font-black hover:bg-violet-500 shadow-xl shadow-violet-500/20 transition-all">
                See it in action <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right: Video Section & About */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Video Player Mockup */}
            <div className="relative group rounded-[2.5rem] overflow-hidden border border-white/10 bg-white/5 p-2 backdrop-blur-sm">
              <div className="aspect-video rounded-[2rem] overflow-hidden relative bg-slate-900">
                {/* Replace 'your-video-source.mp4' with your actual video path */}
                <video 
                  autoPlay 
                  muted 
                  loop 
                  playsInline 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                >
                  <source src="/path-to-your-video.mp4" type="video/mp4" />
                </video>
                
                {/* Overlay Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-t from-[#020205] via-transparent to-transparent">
                  <PlayCircle size={64} className="text-white/50 mb-4 group-hover:scale-110 group-hover:text-white transition-all duration-500 cursor-pointer" />
                </div>
              </div>
            </div>

            {/* About Card below Video */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5">
                <h4 className="font-black text-violet-400 uppercase text-xs tracking-widest mb-2">Our Mission</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  We built RenewMate to simplify the complex world of modern subscriptions, ensuring you only pay for what you actually use.
                </p>
              </div>
              <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5">
                <h4 className="font-black text-fuchsia-400 uppercase text-xs tracking-widest mb-2">Why RenewMate?</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  From intelligent predictive analytics to automated cancellation reminders, we are your financial co-pilot.
                </p>
              </div>
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