import { Link } from "react-router-dom";
import { Home, MessageSquareWarning } from "lucide-react";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [eyeStyle, setEyeStyle] = useState({ transform: "translate(0px, 0px)" });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 12;
      const y = (e.clientY / window.innerHeight - 0.5) * 12;

      setEyeStyle({
        transform: `translate(${x}px, ${y}px)`,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center px-6 overflow-hidden">
      <div className="relative text-center max-w-2xl w-full">
        {/* glow background */}
        <div className="absolute inset-0 bg-cyan-500/10 blur-3xl rounded-full animate-pulse"></div>

        {/* AI bot face */}
        <div className="relative flex justify-center mb-8">
          <div className="relative w-40 h-40 rounded-full bg-cyan-500/10 border border-cyan-400/20 animate-bounce shadow-[0_0_80px_rgba(34,211,238,0.25)] flex items-center justify-center">
            
            {/* eyes */}
            <div className="flex gap-8">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center overflow-hidden">
                <div
                  style={eyeStyle}
                  className="w-3 h-3 bg-cyan-400 rounded-full transition-transform duration-75"
                />
              </div>

              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center overflow-hidden">
                <div
                  style={eyeStyle}
                  className="w-3 h-3 bg-cyan-400 rounded-full transition-transform duration-75"
                />
              </div>
            </div>
          </div>
        </div>

        {/* animated 404 */}
        <h1 className="text-7xl md:text-9xl font-black text-cyan-400 tracking-widest animate-pulse">
          404
        </h1>

        <h2 className="mt-4 text-3xl font-bold text-white">
          AI Couldn’t Find This Page
        </h2>

        <p className="mt-3 text-slate-400 text-lg leading-8">
          Looks like this page got lost in the subscription universe.
          RenewMate AI is still searching for it...
        </p>

        {/* buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 rounded-2xl bg-cyan-400 text-black font-bold hover:scale-105 transition-transform inline-flex items-center justify-center gap-2"
          >
            <Home size={18} />
            Dashboard
          </Link>

          <Link
            to="/chat"
            className="px-6 py-3 rounded-2xl border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2"
          >
            <MessageSquareWarning size={18} />
            Ask AI
          </Link>
        </div>
      </div>
    </div>
  );
}