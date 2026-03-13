import { useEffect, useState } from "react";
import { API_URL } from "../api/api";

export default function SubscriptionList() {

  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }

    };

    fetchSubscriptions();

  }, []);

  // Helper for days remaining
  const getDaysLeft = (date) => {
    const today = new Date();
    const renewal = new Date(date);
    const diff = renewal - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-cyan-500 animate-pulse font-bold uppercase tracking-widest text-xs">
        Fetching Data...
      </div>
    );
  }

  if (!subscriptions.length) {
    return (
      <div className="p-8 text-center text-slate-500 border border-dashed border-white/10 rounded-2xl">
        No subscriptions detected.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

      {subscriptions.map((sub) => {

        const daysLeft = getDaysLeft(sub.renewalDate);

        return (
          <div
            key={sub.id}
            className="bg-[#0f0f14] border border-white/10 rounded-2xl p-5 hover:border-cyan-400/40 transition-all duration-300 shadow-xl"
          >

            <div className="flex justify-between items-start mb-4">

              <h3 className="text-lg font-bold text-white tracking-tight">
                {sub.serviceName}
              </h3>

              <span
                className={`text-[10px] px-2 py-1 rounded border font-black uppercase tracking-tighter
                ${
                  sub.status === "ACTIVE"
                    ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                    : "bg-red-500/10 text-red-400 border-red-500/20"
                }`}
              >
                {sub.status}
              </span>

            </div>

            <div className="space-y-2">

              <p className="text-sm text-slate-300 font-semibold">
                Price: <span className="text-white">₹{sub.price}</span>
              </p>

              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">
                Billing: {sub.billingCycle}
              </p>

              <p className="text-xs text-slate-500">
                Renewal:{" "}
                {new Date(sub.renewalDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>

              {sub.status === "ACTIVE" && (
                <p className="text-[11px] text-cyan-400 font-semibold">
                  {daysLeft > 0
                    ? `${daysLeft} days left`
                    : "Renews today"}
                </p>
              )}

              {sub.status === "EXPIRED" && (
                <p className="text-[11px] text-red-400 font-semibold">
                  Subscription expired
                </p>
              )}

            </div>

          </div>
        );

      })}

    </div>
  );
}