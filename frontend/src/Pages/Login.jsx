import logoImage from "../../../images/dashboard.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { API_URL } from "../api/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const handleLogin = async (e) => {
  e.preventDefault();

  try {

    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();

    if (res.ok) {

      localStorage.setItem("token", data.access_token);

      navigate("/dashboard");

    } else {

      alert(Array.isArray(data.message) ? data.message[0] : data.message);

    }

  } catch (error) {

    console.error(error);
    alert("Login failed");

  }
};
const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] selection:bg-blue-100 selection:text-blue-700 p-6">
      
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-50 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-[440px]">
        {/* Logo & Header */}
        <div className="flex flex-col items-center mb-10">
          <Link to="/" className="group transition-transform hover:scale-105 duration-300">
            <img 
              src={logoImage} 
              alt="RenewMate Logo" 
              className="w-16 h-16 rounded-2xl shadow-xl border border-white mb-4 object-cover" 
            />
          </Link>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back
          </h2>
          <p className="text-slate-500 mt-2 font-medium">
            Manage your renewals with ease.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-white flex flex-col gap-6">
          
          {/* Social Login */}
          <button className="flex items-center justify-center gap-3 w-full py-3 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-semibold text-slate-700 text-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
               <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
               <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
               <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
               <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-100 w-full" />
            <span className="bg-white px-4 text-xs font-bold text-slate-400 uppercase tracking-widest absolute">or</span>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">   
                     <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Email address</label>
                        <input
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-50/50 border border-slate-200 p-4 rounded-2xl"
          />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-slate-700">Password</label>
                <Link to="/forgot" className="text-xs font-bold text-blue-600 hover:text-blue-700">Forgot password?</Link>
              </div>
              <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 p-4 rounded-2xl"
/>
            </div>

            <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl font-bold shadow-lg shadow-blue-100 transition-all active:scale-[0.98] mt-2">
              Sign in to Dashboard
            </button>
          </form>

          <p className="text-sm text-center text-slate-500 font-medium">
            New to RenewMate?
            <Link to="/register" className="text-blue-600 font-bold ml-1.5 hover:underline decoration-2 underline-offset-4">
              Create an account
            </Link>
          </p>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex justify-center gap-6">
            <Link to="/privacy" className="text-xs text-slate-400 hover:text-slate-600">Privacy Policy</Link>
            <Link to="/terms" className="text-xs text-slate-400 hover:text-slate-600">Terms of Service</Link>
        </div>
      </div>
    </div>
  );
}