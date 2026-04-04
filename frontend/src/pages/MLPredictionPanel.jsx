import React, { useState } from "react";
import axios from "axios";

export default function MLPredictionPanel() {
  const [formData, setFormData] = useState({
    serviceName: "",
    category: "",
    billingCycle: "MONTHLY",
    paymentMethod: "credit_card",
    status: "ACTIVE",
    monthly_spending: "",
    active_usage_days: "",
    days_to_renewal: "",
  });

  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePredict = async () => {
    try {
      setLoading(true);
      setError("");
      setPrediction(null);

      const payload = {
        ...formData,
        monthly_spending: Number(formData.monthly_spending),
        active_usage_days: Number(formData.active_usage_days),
        days_to_renewal: Number(formData.days_to_renewal),
      };

      const response = await axios.post(
        `${import.meta.env.VITE_ML_API_URL}/predict`,
        payload
      );

     setPrediction({
  suggestion: response.data.suggestion,
  message: response.data.message,
  riskLevel: response.data.risk_level,
  monthlyEquivalent: response.data.normalized_monthly_spending,
});
    } catch (err) {
      setError("Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020205] text-white p-8">
      <div className="max-w-3xl mx-auto bg-white/5 rounded-3xl p-8 border border-white/10">
        <h1 className="text-3xl font-bold mb-6 text-cyan-400">
          Renewal Prediction
        </h1>
<div className="grid md:grid-cols-2 gap-4">
  <input
    name="serviceName"
    placeholder="Service Name"
    value={formData.serviceName}
    onChange={handleChange}
    className="p-3 rounded-xl bg-white/10 border border-white/10"
  />

  {/* CATEGORY */}
  <select
    name="category"
    value={formData.category}
    onChange={handleChange}
    className="p-3 rounded-xl bg-white/10 border border-white/10"
  >
    <option value="">Select Category</option>
    <option value="Entertainment">Entertainment</option>
    <option value="Cloud">Cloud</option>
    <option value="Music">Music</option>
    <option value="Productivity">Productivity</option>
  </select>

  {/* BILLING CYCLE */}
  <select
    name="billingCycle"
    value={formData.billingCycle}
    onChange={handleChange}
    className="p-3 rounded-xl bg-white/10 border border-white/10"
  >
    <option value="MONTHLY">MONTHLY</option>
    <option value="WEEKLY">WEEKLY</option>
    <option value="YEARLY">YEARLY</option>
  </select>

  {/* PAYMENT METHOD */}
  <select
    name="paymentMethod"
    value={formData.paymentMethod}
    onChange={handleChange}
    className="p-3 rounded-xl bg-white/10 border border-white/10"
  >
    <option value="credit_card">Credit Card</option>
    <option value="upi">UPI</option>
    <option value="debit_card">Debit Card</option>
  </select>

  <select
    name="status"
    value={formData.status}
    onChange={handleChange}
    className="p-3 rounded-xl bg-white/10 border border-white/10"
  >
    <option value="ACTIVE">ACTIVE</option>
    <option value="CANCELLED">CANCELLED</option>
  </select>

  <input
    type="number"
    name="monthly_spending"
    placeholder="Monthly Spending"
    value={formData.monthly_spending}
    onChange={handleChange}
    className="p-3 rounded-xl bg-white/10 border border-white/10"
  />

  <input
    type="number"
    name="active_usage_days"
    placeholder="Active Usage Days"
    value={formData.active_usage_days}
    onChange={handleChange}
    className="p-3 rounded-xl bg-white/10 border border-white/10"
  />

  <input
    type="number"
    name="days_to_renewal"
    placeholder="Days To Renewal"
    value={formData.days_to_renewal}
    onChange={handleChange}
    className="p-3 rounded-xl bg-white/10 border border-white/10"
  />
</div>
       

        <button
          onClick={handlePredict}
          disabled={loading}
          className="mt-6 w-full bg-cyan-500 hover:bg-cyan-600 py-3 rounded-xl font-bold"
        >
          {loading ? "Predicting..." : "Predict Renewal"}
        </button>

       {prediction && (
  <div className="mt-6 p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 space-y-3">
    <p className="text-lg">
      <span className="font-bold text-white">Recommended Plan:</span>{" "}
      <span className="text-cyan-300">{prediction.suggestion}</span>
    </p>

    <p className="text-lg">
      <span className="font-bold text-white">Risk Level:</span>{" "}
      <span
        className={`px-3 py-1 rounded-full text-sm font-bold ${
          prediction.riskLevel === "HIGH"
            ? "bg-red-500/20 text-red-400"
            : prediction.riskLevel === "MEDIUM"
            ? "bg-yellow-500/20 text-yellow-400"
            : "bg-green-500/20 text-green-400"
        }`}
      >
        {prediction.riskLevel}
      </span>
    </p>

    <p className="text-lg">
      <span className="font-bold text-white">
        Monthly Equivalent Spend:
      </span>{" "}
      ₹{prediction.monthlyEquivalent}
    </p>

    <div className="p-3 rounded-xl bg-white/5 text-slate-200">
      {prediction.message}
    </div>
  </div>
)}

        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}