import React, { useState } from "react";
import { useNavigate } from "react-router-dom";import { 
  LayoutDashboard, 
  BellRing, 
  PieChart, 
  ShieldCheck, 
  PlusCircle, 
  ExternalLink,
  X
} from "lucide-react";
import demoVideo from "../assets/demoVideo.mp4";

export default function Demo() {
  const [openVideo, setOpenVideo] = useState(false);
const navigate = useNavigate();
  const features = [
    { 
      icon: <LayoutDashboard className="w-6 h-6 text-blue-400" />, 
      title: "Smart Dashboard", 
      desc: "Overview of all active services." 
    },
    { 
      icon: <BellRing className="w-6 h-6 text-purple-400" />, 
      title: "Renewal Alerts", 
      desc: "Never miss a payment deadline again." 
    },
    { 
      icon: <PieChart className="w-6 h-6 text-emerald-400" />, 
      title: "Spending Analytics", 
      desc: "Visualize where your money goes." 
    },
    { 
      icon: <ShieldCheck className="w-6 h-6 text-cyan-400" />, 
      title: "Secure Vault", 
      desc: "Bank-grade encryption for your data." 
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center px-4 py-12">
      
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          RenewMate Demo
        </h1>
        <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
          The ultimate command center for your digital life.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {features.map((f, i) => (
          <div
            key={i}
            className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all"
          >
            <div className="mb-4 p-3 bg-white/5 w-fit rounded-xl">
              {f.icon}
            </div>
            <h3 className="text-xl font-bold mb-2">{f.title}</h3>
            <p className="text-slate-400 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="mt-16 flex flex-col sm:flex-row gap-4">
       <button
  onClick={() => {
    const token = localStorage.getItem("token");
    navigate(token ? "/add-subscription" : "/login");
  }}
  className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-full font-bold"
>
  <PlusCircle size={20} />
  Add Subscription
</button>

        <button
          onClick={() => setOpenVideo(true)}
          className="flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full font-bold"
        >
          View Live Demo
          <ExternalLink size={18} />
        </button>
      </div>

      {/* Video Modal */}
      {openVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={() => setOpenVideo(false)}
              className="absolute -top-12 right-0 text-white"
            >
              <X size={30} />
            </button>

            <video
              src={demoVideo}
              controls
              autoPlay
              className="w-full rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}

      <p className="mt-12 text-slate-500 text-sm italic">
        * This is a preview of the RenewMate V2 Dashboard
      </p>
    </div>
  );
}