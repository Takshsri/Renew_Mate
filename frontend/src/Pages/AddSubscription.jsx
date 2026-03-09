import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import AddSubscriptionForm from "../components/AddSubscriptionForm";
import { Menu, X, Upload, Link as LinkIcon, Camera } from "lucide-react";

export default function AddSubscription() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [uploadMethod, setUploadMethod] = useState("file"); // 'file' or 'url'

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
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-4xl mx-auto">
            <header className="mb-10 text-center lg:text-left">
              <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">
                Initialize <span className="text-cyan-400">Asset</span>
              </h1>
              <p className="text-slate-500 text-sm mt-1 tracking-widest">UPLOAD DOCUMENTATION FOR VERIFICATION</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left: Standard Form */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-2xl">
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]" />
                  Subscription Details
                </h2>
                <AddSubscriptionForm />
              </div>

              {/* Right: Verification / Image Section */}
              <div className="space-y-6">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-2xl">
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Camera className="text-cyan-400" size={20} />
                    Proof of Subscription
                  </h2>

                  {/* Toggle Method */}
                  <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 mb-6">
                    <button 
                      onClick={() => setUploadMethod("file")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${uploadMethod === "file" ? "bg-cyan-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
                    >
                      <Upload size={14} /> FILE UPLOAD
                    </button>
                    <button 
                      onClick={() => setUploadMethod("url")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${uploadMethod === "url" ? "bg-cyan-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
                    >
                      <LinkIcon size={14} /> PHOTO URL
                    </button>
                  </div>

                  {uploadMethod === "file" ? (
                    <div className="border-2 border-dashed border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center group hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all cursor-pointer">
                      <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="text-cyan-400" />
                      </div>
                      <p className="text-sm font-medium text-slate-300">Drag & drop receipt</p>
                      <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-tighter">PDF, PNG, JPG (Max 5MB)</p>
                      <input type="file" className="hidden" id="file-upload" />
                      <label htmlFor="file-upload" className="mt-4 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold hover:bg-white/10 cursor-pointer">BROWSE FILES</label>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-xs text-slate-400 uppercase tracking-widest">Direct Link to Receipt Image</p>
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="https://example.com/receipt.jpg"
                          className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500/50 text-white transition-all"
                        />
                      </div>
                      <div className="p-4 bg-cyan-400/5 border border-cyan-400/20 rounded-xl">
                        <p className="text-[10px] text-cyan-400 leading-relaxed">
                          Note: Ensure the URL is public so the verification engine can index the document.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* System Message */}
                <div className="p-4 bg-amber-400/5 border border-amber-400/20 rounded-2xl">
                  <p className="text-[11px] text-amber-200/70 italic leading-relaxed">
                    * Automated verification takes approximately 2-5 cycles. Incorrect documentation may result in asset suspension.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}