import { Link } from "react-router-dom";
import logoImage from "../../../images/dashboard.png";

export default function Register() {
  return (
    <div className="min-h-screen flex bg-white selection:bg-blue-100 selection:text-blue-700">
      
      {/* Left Side: Brand Visual & Social Proof */}
      <div className="hidden lg:flex w-1/2 bg-[#F8FAFC] flex-col justify-between p-16 relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute top-[-10%] left-[-10%] w-full h-full bg-blue-50/50 rounded-full blur-[120px] -z-10" />
        
        <div className="flex items-center gap-3">
          <img src={logoImage} alt="Logo" className="w-10 h-10 rounded-xl shadow-sm" />
          <span className="text-xl font-bold tracking-tight text-slate-900">RenewMate</span>
        </div>

        <div className="max-w-md">
          <h1 className="text-4xl font-extrabold text-slate-950 leading-tight mb-6">
            Join 10,000+ users saving on subscriptions.
          </h1>
          <div className="space-y-6">
            {[
              { t: "Save up to $500/year", d: "Our users find an average of 3 unused subscriptions in their first week." },
              { t: "Privacy First", d: "Your data is encrypted with bank-level security. We never sell your info." }
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{item.t}</h4>
                  <p className="text-slate-500 text-sm">{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-400 font-medium italic">
          "The best investment I made for my digital hygiene this year." — TechCrunch
        </p>
      </div>

      {/* Right Side: The Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-[400px]">
          
          <div className="mb-10 lg:hidden flex flex-col items-center">
            <img src={logoImage} alt="Logo" className="w-12 h-12 rounded-xl mb-4" />
          </div>

          <h2 className="text-3xl font-extrabold text-slate-950 mb-2">Create an account</h2>
          <p className="text-slate-500 font-medium mb-8">Get started with your 14-day free trial.</p>

          <form className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all text-slate-900"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Work Email</label>
              <input
                type="email"
                placeholder="john@company.com"
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all text-slate-900"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
              <input
                type="password"
                placeholder="Minimum 8 characters"
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all text-slate-900"
              />
            </div>

            <div className="flex items-start gap-3 mt-2 px-1">
              <input type="checkbox" className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <p className="text-xs text-slate-500 leading-normal">
                I agree to the <Link to="/" className="text-blue-600 font-bold hover:underline">Terms of Service</Link> and <Link to="/" className="text-blue-600 font-bold hover:underline">Privacy Policy</Link>.
              </p>
            </div>

            <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl font-bold shadow-lg shadow-blue-100 transition-all active:scale-[0.98] mt-4">
              Create My Account
            </button>
          </form>

          <p className="text-sm text-center text-slate-500 font-medium mt-8">
            Already have an account?
            <Link to="/login" className="text-blue-600 font-bold ml-1.5 hover:underline decoration-2 underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}