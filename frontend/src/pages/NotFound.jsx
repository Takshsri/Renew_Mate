import { Link } from "react-router-dom";
import { Home, MessageSquareWarning } from "lucide-react";
import { useEffect, useState, useRef } from "react";

export default function NotFound() {
  const [eyeStyle, setEyeStyle] = useState({ transform: "translate(0px, 0px)" });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const pageRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      const rect = pageRef.current?.getBoundingClientRect();
      if (!rect) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const x = (e.clientX - centerX) / (rect.width / 2) * 15;
      const y = (e.clientY - centerY) / (rect.height / 2) * 15;

      setEyeStyle({
        transform: `translate(${x}px, ${y}px)`,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen bg-[#050508] flex items-center justify-center px-6 overflow-hidden relative font-sans">
      
      {/* Dynamic Background Grid with Mouse Highlight */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(#1a1a2e 1px, transparent 1px),
            linear-gradient(90deg, #1a1a2e 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      <div 
        className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(34, 211, 238, 0.08), transparent 40%)`
        }}
      />

      <div className="relative text-center max-w-2xl w-full z-10 animate-fade-in-up">
        
        {/* Main Glow Background - Pulsing */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-cyan-500/5 blur-[120px] rounded-full animate-pulse-slow"></div>

        {/* Enhanced AI Bot Face */}
        <div className="relative flex justify-center mb-12 transform hover:scale-105 transition-transform duration-500 ease-out">
          <div className="relative w-48 h-48 rounded-3xl bg-gray-900 border border-cyan-800/40 flex items-center justify-center
                          shadow-[0_0_60px_rgba(34,211,238,0.15)] 
                          before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-b before:from-cyan-500/10 before:to-transparent
                          overflow-hidden group">
            
            {/* Animated Scanning Line */}
            <div className="absolute inset-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30 animate-scan pointer-events-none" />

            {/* Content Container (z-index for stacking) */}
            <div className="relative z-10 flex flex-col items-center gap-6">
                
                {/* Status Indicator */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/50 border border-cyan-700/30 text-[11px] font-medium text-cyan-300 uppercase tracking-wider">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </span>
                    Searching
                </div>

                {/* Eyes Section */}
                <div className="flex gap-10 mt-6">
                  {/* Left Eye */}
                  <div className="w-12 h-12 bg-[#0a0a12] rounded-full flex items-center justify-center overflow-hidden border-2 border-cyan-900/50 shadow-inner group-hover:border-cyan-600/50 transition-colors">
                    <div
                      style={eyeStyle}
                      className="w-4 h-4 bg-cyan-400 rounded-full transition-transform duration-100 ease-out shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                    />
                  </div>
                  {/* Right Eye */}
                  <div className="w-12 h-12 bg-[#0a0a12] rounded-full flex items-center justify-center overflow-hidden border-2 border-cyan-900/50 shadow-inner group-hover:border-cyan-600/50 transition-colors">
                    <div
                      style={eyeStyle}
                      className="w-4 h-4 bg-cyan-400 rounded-full transition-transform duration-100 ease-out shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                    />
                  </div>
                </div>

                {/* Animated Mouth/Data Line */}
                <div className="w-24 h-1.5 bg-cyan-950 rounded-full overflow-hidden relative">
                    <div className="absolute inset-0 bg-cyan-500 animate-mouth-data" />
                </div>
            </div>

             {/* Decorative Corner Accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-700/50 rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-700/50 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-700/50 rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-700/50 rounded-br-lg"></div>

          </div>
        </div>

        {/* 404 with Glitch Effect on Hover */}
        <h1 className="text-8xl md:text-[160px] font-extrabold text-cyan-400 tracking-tighter relative group cursor-default leading-none">
          <span className="absolute inset-0 text-cyan-400/30 blur-sm animate-pulse-fast">404</span>
          <span className="relative group-hover:animate-glitch">404</span>
        </h1>

        <h2 className="mt-6 text-4xl font-extrabold text-white tracking-tight animate-fade-in [animation-delay:200ms]">
          Data Transmission Interrupted
        </h2>

        <p className="mt-4 text-slate-400 text-xl leading-relaxed max-w-lg mx-auto animate-fade-in [animation-delay:400ms]">
          Looks like this page got lost in the digital void.
          RenewMate AI is currently re-routing its search parameters...
        </p>

        {/* Buttons - Sliding in */}
        <div className="mt-12 flex flex-col sm:flex-row gap-5 justify-center animate-fade-in-up [animation-delay:600ms]">
          <Link
            to="/"
            className="px-8 py-4 rounded-xl bg-cyan-400 text-black font-bold hover:bg-cyan-300 hover:-translate-y-1 transition-all duration-300 inline-flex items-center justify-center gap-2.5 shadow-lg shadow-cyan-500/20 active:scale-95"
          >
            <Home size={20} />
            Back to Dashboard
          </Link>

          <Link
            to="/chat"
            className="px-8 py-4 rounded-xl border border-cyan-800/50 bg-cyan-950/30 text-cyan-200 hover:bg-cyan-900/50 hover:border-cyan-700 hover:-translate-y-1 transition-all duration-300 inline-flex items-center justify-center gap-2.5 active:scale-95"
          >
            <MessageSquareWarning size={20} className="text-cyan-400" />
            Report to AI Assistant
          </Link>
        </div>
      </div>

      {/* Tailwind Custom Animations (Add this to your tailwind.config.js or globals.css) */}
      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes mouth-data {
          0%, 100% { transform: scaleX(1); opacity: 1; }
          20% { transform: scaleX(0.4); opacity: 0.7; }
          40% { transform: scaleX(0.8); opacity: 0.9; }
          60% { transform: scaleX(0.2); opacity: 0.6; }
          80% { transform: scaleX(0.9); opacity: 1; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.05); }
        }
        @keyframes pulse-fast {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.7; }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glitch {
            0% { text-shadow: 0.5px 0 0 #0ff, -0.5px 0 0 #f0f; transform: translate(0px, 0px); }
            10% { text-shadow: 0.5px 0 0 #0ff, -0.5px 0 0 #f0f; transform: translate(-1px, 1px); }
            20% { text-shadow: -0.5px 0 0 #0ff, 0.5px 0 0 #f0f; transform: translate(1px, -1px); }
            30% { text-shadow: 0.5px 0 0 #0ff, -0.5px 0 0 #f0f; transform: translate(0px, 0px); }
            100% { text-shadow: 0.5px 0 0 #0ff, -0.5px 0 0 #f0f; transform: translate(0px, 0px); }
        }
        .animate-scan { animation: scan 3s linear infinite; }
        .animate-mouth-data { animation: mouth-data 2s ease-in-out infinite; transform-origin: center; }
        .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
        .animate-pulse-fast { animation: pulse-fast 1.5s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.8s ease-out forwards; opacity: 0; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; opacity: 0; }
        .group:hover .animate-glitch { animation: glitch 0.3s cubic-bezier(.46,.03,.52,.96) infinite; }
      `}</style>
    </div>
  );
}