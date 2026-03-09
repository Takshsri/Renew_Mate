import { useEffect, useState } from "react";
import { API_URL } from "../api/api";

export default function SubscriptionList() {

  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {

    const fetchSubscriptions = async () => {

      try {

        const res = await fetch(`${API_URL}/subscriptions`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setSubscriptions(data);
        }

      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      }

    };

    fetchSubscriptions();

  }, []);

  if (!subscriptions.length) {
    return (
      <div className="p-8 text-center text-slate-500">
        No subscriptions found
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">

      {subscriptions.map((sub) => (

        <div
          key={sub.id}
          className="bg-[#0f0f14] border border-white/10 rounded-2xl p-5 hover:border-cyan-400/40 transition"
        >

          <h3 className="text-lg font-bold text-white">
            {sub.serviceName}
          </h3>

          <p className="text-sm text-slate-400 mt-2">
            Price: ₹{sub.price}
          </p>

          <p className="text-sm text-slate-400">
            Billing: {sub.billingCycle}
          </p>

          <p className="text-sm text-slate-400">
            Renewal: {new Date(sub.renewalDate).toLocaleDateString()}
          </p>

        </div>

      ))}

    </div>
  );
}