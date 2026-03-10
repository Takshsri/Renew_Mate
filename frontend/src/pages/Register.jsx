import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logoImage from "../images/dashboard.png";
export default function Register() {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          phone,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Account created successfully");
        navigate("/login");
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.error(error);
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex bg-white selection:bg-blue-100 selection:text-blue-700">

      {/* Left Side */}
      <div className="hidden lg:flex w-1/2 bg-[#F8FAFC] flex-col justify-between p-16">

        <div className="flex items-center gap-3">
          <img src={logoImage} alt="Logo" className="w-10 h-10 rounded-xl"/>
          <span className="text-xl font-bold">RenewMate</span>
        </div>

        <div>
          <h1 className="text-4xl font-bold mb-6">
            Join thousands managing subscriptions smarter.
          </h1>
          <p className="text-gray-500">
            Track, manage and save money on your recurring subscriptions.
          </p>
        </div>

        <p className="text-xs text-gray-400">
          Built for simplicity and financial clarity.
        </p>

      </div>

      {/* Right Side Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8">

        <div className="w-full max-w-[420px]">

          <h2 className="text-3xl font-bold mb-2">Create an account</h2>
          <p className="text-gray-500 mb-8">
            Start tracking your subscriptions today.
          </p>

          <form onSubmit={handleRegister} className="flex flex-col gap-5">

            {/* First + Last Name */}
            <div className="flex gap-4">

              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e)=>setFirstName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl"
                required
              />

              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e)=>setLastName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl"
                required
              />

            </div>

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="bg-slate-50 border border-slate-200 p-4 rounded-xl"
              required
            />

            {/* Phone */}
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e)=>setPhone(e.target.value)}
              className="bg-slate-50 border border-slate-200 p-4 rounded-xl"
              required
            />

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="bg-slate-50 border border-slate-200 p-4 rounded-xl"
              required
            />

            <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl font-semibold">
              Create Account
            </button>

          </form>

          <p className="text-sm text-center mt-6">
            Already have an account?
            <Link to="/login" className="text-blue-600 ml-1 font-semibold">
              Login
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}