import { useState } from "react";
import { Calendar, CreditCard, Tag, IndianRupee, Activity, FileText, PlusCircle } from "lucide-react";

export default function AddSubscriptionForm() {
  const [form, setForm] = useState({
    serviceName: "",
    category: "",
    price: "",
    billingCycle: "MONTHLY",
    startDate: "",
    renewalDate: "",
    paymentMethod: "",
    status: "ACTIVE",
    notes: ""
  });

  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/subscriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("Failed to create subscription");
      alert("Subscription added successfully");
      setForm({
        serviceName: "", category: "", price: "", billingCycle: "MONTHLY",
        startDate: "", renewalDate: "", paymentMethod: "", status: "ACTIVE", notes: ""
      });
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  const inputStyle = "w-full bg-slate-800/60 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm";
  const labelStyle = "block text-[10px] font-bold text-cyan-500 uppercase tracking-widest mb-1.5 ml-1";
  const iconStyle = "absolute left-3 top-[34px] w-4 h-4 text-slate-400";

  return (
    <div className="max-w-3xl mx-auto p-6 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <PlusCircle className="text-cyan-400" /> New Subscription
        </h2>
        <p className="text-slate-400 text-xs mt-1">Fill in the details to track your recurring expenses.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        
        {/* Service Name - Full Width */}
        <div className="md:col-span-2 relative">
          <label className={labelStyle}>Service Name</label>
          <Tag className={iconStyle} />
          <input
            type="text"
            name="serviceName"
            value={form.serviceName}
            onChange={handleChange}
            placeholder="e.g. Netflix, Spotify, AWS"
            className={inputStyle}
            required
          />
        </div>

        {/* Category */}
        <div className="relative">
          <label className={labelStyle}>Category</label>
          <Activity className={iconStyle} />
          <select name="category" value={form.category} onChange={handleChange} className={`${inputStyle} appearance-none cursor-pointer`}>
            <option value="" className="bg-slate-900">Select Category</option>
            <option value="Entertainment" className="bg-slate-900">Entertainment</option>
            <option value="Music" className="bg-slate-900">Music</option>
            <option value="Productivity" className="bg-slate-900">Productivity</option>
            <option value="Cloud" className="bg-slate-900">Cloud</option>
          </select>
        </div>

        {/* Price */}
        <div className="relative">
          <label className={labelStyle}>Price</label>
          <IndianRupee className={iconStyle} />
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="0.00"
            className={inputStyle}
            required
          />
        </div>

        {/* Billing Cycle */}
        <div className="relative">
          <label className={labelStyle}>Billing Cycle</label>
          <Calendar className={iconStyle} />
          <select name="billingCycle" value={form.billingCycle} onChange={handleChange} className={inputStyle}>
            <option value="MONTHLY" className="bg-slate-900">Monthly</option>
            <option value="YEARLY" className="bg-slate-900">Yearly</option>
            <option value="WEEKLY" className="bg-slate-900">Weekly</option>
          </select>
        </div>

        {/* Payment Method */}
        <div className="relative">
          <label className={labelStyle}>Payment Method</label>
          <CreditCard className={iconStyle} />
          <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange} className={inputStyle}>
            <option value="" className="bg-slate-900">Choose Method</option>
            <option value="UPI" className="bg-slate-900">UPI</option>
            <option value="Credit Card" className="bg-slate-900">Credit Card</option>
            <option value="PayPal" className="bg-slate-900">PayPal</option>
          </select>
        </div>

        {/* Start Date */}
        <div className="relative">
          <label className={labelStyle}>Start Date</label>
          <Calendar className={iconStyle} />
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            className={`${inputStyle} [color-scheme:dark]`}
            required
          />
        </div>

        {/* Renewal Date */}
        <div className="relative">
          <label className={labelStyle}>Renewal Date</label>
          <Calendar className={iconStyle} />
          <input
            type="date"
            name="renewalDate"
            value={form.renewalDate}
            onChange={handleChange}
            className={`${inputStyle} [color-scheme:dark]`}
            required
          />
        </div>

        {/* Notes - Full Width */}
        <div className="md:col-span-2 relative">
          <label className={labelStyle}>Notes</label>
          <FileText className={iconStyle} />
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Optional notes..."
            className={`${inputStyle} h-20 pt-2 resize-none`}
          />
        </div>

        {/* Submit */}
        <div className="md:col-span-2 mt-2">
          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] text-white transition-all rounded-xl py-3 text-sm font-bold tracking-[0.2em]"
          >
            CONFIRM SUBSCRIPTION
          </button>
        </div>
      </form>
    </div>
  );
}