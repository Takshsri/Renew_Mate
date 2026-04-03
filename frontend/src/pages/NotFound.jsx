import { Link } from "react-router-dom";
import { Home, MessageSquareWarning } from "lucide-react";
import { useEffect, useState, useRef } from "react";

export default function NotFound() {
  const [eyeStyle, setEyeStyle] = useState({
    transform: "translate(0px, 0px)",
  });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const pageRef = useRef(null);

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      const rect = pageRef.current?.getBoundingClientRect();
      if (!rect) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const x = ((e.clientX - centerX) / (rect.width / 2)) * 15;
      const y = ((e.clientY - centerY) / (rect.height / 2)) * 15;

      setEyeStyle({
        transform: `translate(${x}px, ${y}px)`,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-[#050508] flex items-center justify-center px-6 overflow-hidden relative font-sans"
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(#1a1a2e 1px, transparent 1px),
            linear-gradient(90deg, #1a1a2e 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Mouse glow */}
      <div
        className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(34, 211, 238, 0.08), transparent 40%)`,
        }}
      />

      <div className="relative text-center max-w-2xl w-full z-10 animate-fade-in-up">
        {/* Main glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-cyan-500/5 blur-[120px] rounded-full animate-pulse-slow"></div>

        {/* AI Robot */}
        <div className="relative flex justify-center mb-12 transform hover:scale-105 transition-transform duration-500 ease-out">
          <div className="relative w-48 h-48 rounded-3xl bg-gray-900 border border-cyan-800/40 flex items-center justify-center shadow-[0_0_60px_rgba(34,211,238,0.15)] before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-b before:from-cyan-500/10 before:to-transparent overflow-hidden group">
            {/* Scan line */}
            <div className="absolute inset-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30 animate-scan pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center gap-6">
              {/* status */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/50 border border-cyan-700/30 text-[11px] font-medium text-cyan-300 uppercase tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                Searching
              </div>

              {/* eyes */}
              <div className="flex gap-10 mt-6">
                {[1, 2].map((eye) => (
                  <div
                    key={eye}
                    className="w-12 h-12 bg-[#0a0a12] rounded-full flex items-center justify-center overflow-hidden border-2 border-cyan-900/50 shadow-inner"
                  >
                    <div
                      style={eyeStyle}
                      className="w-4 h-4 bg-cyan-400 rounded-full transition-transform duration-100 ease-out shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                    />
                  </div>
                ))}
              </div>

              {/* mouth */}
              <div className="w-24 h-1.5 bg-cyan-950 rounded-full overflow-hidden relative">
                <div className="absolute inset-0 bg-cyan-500 animate-mouth-data" />
              </div>
            </div>
          </div>
        </div>

        {/* 404 */}
        <h1 className="text-8xl md:text-[160px] font-extrabold text-cyan-400 tracking-tighter relative group cursor-default leading-none">
          <span className="absolute inset-0 text-cyan-400/30 blur-sm animate-pulse-fast">
            404
          </span>
          <span className="relative group-hover:animate-glitch">404</span>
        </h1>

        <h2 className="mt-6 text-4xl font-extrabold text-white tracking-tight">
          Data Transmission Interrupted
        </h2>

        <p className="mt-4 text-slate-400 text-xl leading-relaxed max-w-lg mx-auto">
          Looks like this page got lost in the digital void.
          RenewMate AI is currently re-routing its search parameters...
        </p>

        {/* Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-5 justify-center">
          <Link
            to="/"
            className="px-8 py-4 rounded-xl cursor-pointer bg-cyan-400 text-black font-bold hover:bg-cyan-300 hover:-translate-y-1 transition-all duration-300 inline-flex items-center justify-center gap-2.5 shadow-lg shadow-cyan-500/20 active:scale-95"
          >
            <Home size={20} />
            Back to Home
          </Link>

          <Link
            to={isLoggedIn ? "/chat" : "/login"}
            className="px-8 py-4 rounded-xl border cursor-pointer border-cyan-800/50 bg-cyan-950/30 text-cyan-200 hover:bg-cyan-900/50 hover:border-cyan-700 hover:-translate-y-1 transition-all duration-300 inline-flex items-center justify-center gap-2.5 active:scale-95"
          >
            <MessageSquareWarning
              size={20}
              className="text-cyan-400"
            />
            {isLoggedIn ? "Report to AI Assistant" : "Login to Continue"}
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes mouth-data {
          0%, 100% { transform: scaleX(1); opacity: 1; }
          50% { transform: scaleX(0.4); opacity: 0.7; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.05); }
        }
        @keyframes pulse-fast {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glitch {
          0% { text-shadow: 0.5px 0 0 #0ff, -0.5px 0 0 #f0f; }
          50% { text-shadow: -0.5px 0 0 #0ff, 0.5px 0 0 #f0f; }
          100% { text-shadow: 0.5px 0 0 #0ff, -0.5px 0 0 #f0f; }
        }

        .animate-scan { animation: scan 3s linear infinite; }
        .animate-mouth-data { animation: mouth-data 2s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
        .animate-pulse-fast { animation: pulse-fast 1.5s ease-in-out infinite; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .group:hover .group-hover\\:animate-glitch { animation: glitch 0.3s infinite; }
      `}</style>
    </div>
  );
}