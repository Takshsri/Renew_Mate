import { useEffect, useState } from "react";
import { API_URL } from "../api/api";

export default function SubscriptionList() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editSub, setEditSub] = useState(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

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

  const getDaysLeft = (date) => {
    const today = new Date();
    const renewal = new Date(date);
    const diff = renewal - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

const updateSubscription = async () => {
  try {
    const payload = {
      serviceName: editSub.serviceName,
      category: editSub.category || "",
      price: Number(editSub.price),
      billingCycle: editSub.billingCycle,
      paymentMethod: editSub.paymentMethod || "",
      invoiceUrl: editSub.invoiceUrl || "",
      notes: editSub.notes || "",
      status: editSub.status,

      startDate: editSub.startDate
        ? new Date(editSub.startDate).toISOString()
        : undefined,

      renewalDate: editSub.renewalDate
        ? new Date(editSub.renewalDate).toISOString()
        : undefined,

      endDate: editSub.endDate
        ? new Date(editSub.endDate).toISOString()
        : undefined,
    };

    const res = await fetch(`${API_URL}/subscriptions/${editSub.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    });

    const updated = await res.json();

    if (!res.ok) {
      console.error(updated);
      return;
    }

    setSubscriptions((prev) =>
      prev.map((sub) => (sub.id === updated.id ? updated : sub))
    );

    setEditSub(null);
  } catch (error) {
    console.error("Update failed:", error);
  }
};
const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
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
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscriptions.map((sub) => {
          const daysLeft = getDaysLeft(sub.renewalDate);

          return (
            <div
              key={sub.id}
              className="bg-[#0f0f14] border border-white/10 rounded-2xl p-5 hover:border-cyan-400/40 transition-all duration-300 shadow-xl"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {sub.serviceName}
                  </h3>
                  <p className="text-xs text-slate-500">{sub.category}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] px-2 py-1 rounded border font-black uppercase tracking-tighter ${
                      sub.status === "ACTIVE"
                        ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                        : "bg-red-500/10 text-red-400 border-red-500/20"
                    }`}
                  >
                    {sub.status}
                  </span>

                  <button
                    onClick={() => setEditSub(sub)}
                    className="text-xs text-cyan-400 hover:underline"
                  >
                    Edit
                  </button>
                </div>
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

                <p className="text-xs text-slate-500">
                  Payment: {sub.paymentMethod}
                </p>

                {sub.status === "ACTIVE" && (
                  <p className="text-[11px] text-cyan-400 font-semibold">
                    {daysLeft > 0 ? `${daysLeft} days left` : "Renews today"}
                  </p>
                )}

                {sub.description && (
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {sub.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {editSub && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#111827] p-6 rounded-2xl border border-white/10 w-[500px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-white font-bold mb-5 text-lg">
              Edit Subscription
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                value={editSub.serviceName}
                onChange={(e) =>
                  setEditSub({ ...editSub, serviceName: e.target.value })
                }
                placeholder="Service Name"
                className="w-full p-3 rounded-lg bg-[#0f0f14] text-white border border-white/10"
              />

              <input
                type="text"
                value={editSub.category || ""}
                onChange={(e) =>
                  setEditSub({ ...editSub, category: e.target.value })
                }
                placeholder="Category"
                className="w-full p-3 rounded-lg bg-[#0f0f14] text-white border border-white/10"
              />

              <input
                type="number"
                value={editSub.price}
                onChange={(e) =>
                  setEditSub({
                    ...editSub,
                    price: Number(e.target.value),
                  })
                }
                placeholder="Price"
                className="w-full p-3 rounded-lg bg-[#0f0f14] text-white border border-white/10"
              />

              <input
                type="text"
                value={editSub.billingCycle}
                onChange={(e) =>
                  setEditSub({
                    ...editSub,
                    billingCycle: e.target.value,
                  })
                }
                placeholder="Billing Cycle"
                className="w-full p-3 rounded-lg bg-[#0f0f14] text-white border border-white/10"
              />

              <input
                type="text"
                value={editSub.paymentMethod || ""}
                onChange={(e) =>
                  setEditSub({
                    ...editSub,
                    paymentMethod: e.target.value,
                  })
                }
                placeholder="Payment Method"
                className="w-full p-3 rounded-lg bg-[#0f0f14] text-white border border-white/10"
              />

              <input
                type="date"
                value={formatDate(editSub.startDate)}
                onChange={(e) =>
                  setEditSub({ ...editSub, startDate: e.target.value })
                }
                className="w-full p-3 rounded-lg bg-[#0f0f14] text-white border border-white/10"
              />

              <input
                type="date"
                
                 value={formatDate(editSub.renewalDate)}
                onChange={(e) =>
                  setEditSub({ ...editSub, renewalDate: e.target.value })
                }
                className="w-full p-3 rounded-lg bg-[#0f0f14] text-white border border-white/10"
              />

              <input
                type="date"
                value={formatDate(editSub.endDate)}
                onChange={(e) =>
                  setEditSub({ ...editSub, endDate: e.target.value })
                }
                className="w-full p-3 rounded-lg bg-[#0f0f14] text-white border border-white/10"
              />

              <input
                type="text"
                value={editSub.invoiceUrl || ""}
                onChange={(e) =>
                  setEditSub({ ...editSub, invoiceUrl: e.target.value })
                }
                placeholder="Invoice URL"
                className="w-full p-3 rounded-lg bg-[#0f0f14] text-white border border-white/10"
              />

              <textarea
                value={editSub.notes || ""}
                onChange={(e) =>
                  setEditSub({ ...editSub, notes: e.target.value })
                }
                placeholder="Notes"
                rows={4}
                className="w-full p-3 rounded-lg bg-[#0f0f14] text-white border border-white/10"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditSub(null)}
                className="px-4 py-2 text-slate-400"
              >
                Cancel
              </button>

              <button
                onClick={updateSubscription}
                className="px-5 py-2 bg-cyan-500 rounded-lg text-black font-bold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}