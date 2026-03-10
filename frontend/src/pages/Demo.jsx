import React from "react";
import { 
  LayoutDashboard, 
  BellRing, 
  PieChart, 
  ShieldCheck, 
  PlusCircle, 
  ExternalLink 
} from "lucide-react";

export default function Demo() {
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
      
      {/* Hero Section */}
      <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          RenewMate Demo
        </h1>
        <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          The ultimate command center for your digital life. Manage, track, and optimize 
          every recurring payment with a single interface.
        </p>
      </div>

      {/* Feature Grid - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {features.map((f, i) => (
          <div 
            key={i} 
            className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:bg-white/10"
          >
            <div className="mb-4 p-3 bg-white/5 w-fit rounded-xl group-hover:scale-110 transition-transform">
              {f.icon}
            </div>
            <h3 className="text-xl font-bold mb-2">{f.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Action Area */}
      <div className="mt-16 flex flex-col sm:flex-row gap-4 w-full justify-center px-6">
        <button className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-full font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20">
          <PlusCircle size={20} />
          Add Subscription
        </button>
        
        <button className="flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full font-bold transition-all transform hover:scale-105">
          View Live Demo
          <ExternalLink size={18} />
        </button>
      </div>

      {/* Footer Hint */}
      <p className="mt-12 text-slate-500 text-sm italic">
        * This is a preview of the RenewMate V2 Dashboard
      </p>
    </div>
  );
}