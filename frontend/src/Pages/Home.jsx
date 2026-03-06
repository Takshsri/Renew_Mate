import { Link } from "react-router-dom";
import logoImage from "../../../images/dashboard.png"; // Using your main dashboard image as the logo

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 font-sans">
      
      {/* Navbar - Simplified & Elegant */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">
          <div className="flex items-center gap-3">
            {/* Main Logo from dashboard.png */}
            <img 
              src={logoImage} 
              alt="RenewMate Logo" 
              className="w-12 h-12 rounded-xl shadow-sm border border-slate-100 object-cover" 
            />
            <span className="text-2xl font-black tracking-tighter text-slate-800">
              RenewMate
            </span>
          </div>
          
          <div className="flex items-center gap-8">
            <Link to="/login" className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition">
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
          
          
          
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8">
            Never miss a <span className="text-blue-600">renewal</span> again.
          </h1>

          <p className="text-xl text-slate-500 max-w-2xl mb-12 leading-relaxed">
            The simplest way to track your digital subscriptions, monitor monthly spending, 
            and keep your financial life in sync.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/register"
              className="bg-slate-900 text-white px-10 py-4 rounded-2xl text-lg font-bold hover:bg-slate-800 transition shadow-xl"
            >
              Join RenewMate
            </Link>
            <button className="bg-white text-slate-700 border border-slate-200 px-10 py-4 rounded-2xl text-lg font-bold hover:bg-slate-50 transition">
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* Simple Stats/Trust Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-10 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
            <p className="text-slate-500 font-medium uppercase tracking-widest text-xs">Automated Tracking</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
            <p className="text-slate-500 font-medium uppercase tracking-widest text-xs">Active Monitoring</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">$0</div>
            <p className="text-slate-500 font-medium uppercase tracking-widest text-xs">Forgotten Trials</p>
          </div>
        </div>
      </section>

      {/* Feature Cards with Hover Effects */}
      <section className="py-24 px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition duration-300">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-6 font-bold">01</div>
            <h3 className="font-bold text-xl mb-4">Smart Tracking</h3>
            <p className="text-slate-500 leading-relaxed">Centralize every subscription in one beautiful interface designed for clarity.</p>
          </div>

          <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition duration-300">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-6 font-bold">02</div>
            <h3 className="font-bold text-xl mb-4">Instant Alerts</h3>
            <p className="text-slate-500 leading-relaxed">Customizable notifications sent straight to your device before any payment hits.</p>
          </div>

          <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition duration-300">
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-6 font-bold">03</div>
            <h3 className="font-bold text-xl mb-4">Budget Clarity</h3>
            <p className="text-slate-500 leading-relaxed">Detailed insights into your spending habits with clean, easy-to-read charts.</p>
          </div>

        </div>
      </section>
      
    </div>
  );
}