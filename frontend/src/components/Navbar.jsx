import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Menu, X, Bell } from "lucide-react";
import { API_URL } from "../api/api";
import notificationSound from "../assets/notification.mp3";
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [upcomingRenewals, setUpcomingRenewals] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const token = localStorage.getItem("token");

  let userName = "User";
  let userId = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userName = decoded.firstName || "User";
      userId = decoded.sub;
    } catch (e) {
      console.error("Invalid token");
    }
  }

  useEffect(() => {
    if (userId) {
      fetchUpcomingRenewals(userId);
      
    }
  }, [userId]);

  const playNotificationSound = () => {
    const audio = new Audio(notificationSound);
    audio.play();
  };

const fetchUpcomingRenewals = async (id) => {
  try {
    const res = await fetch(
      `${API_URL}/subscriptions/renewals/upcoming/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    setUpcomingRenewals(data);

    const lastSeenCount =
      Number(localStorage.getItem("seenRenewalsCount")) || 0;

    const newUnread = Math.max(data.length - lastSeenCount, 0);
    setUnreadCount(newUnread);

    // 🔔 Play only when new unread notifications exist
    if (newUnread > 0) {
      playNotificationSound();
    }
  } catch (error) {
    console.error(error);
  }
};

  return (
    <nav className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-lg md:text-xl font-bold text-gray-800 tracking-tight">
              RenewMate <span className="text-blue-600">Dashboard</span>
            </h1>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-6">
            {/* Notifications */}
            <div className="relative">
              <Bell
                className="w-6 h-6 text-gray-700 cursor-pointer"
                onClick={() => {
  setShowNotifications(!showNotifications);

  if (!showNotifications) {
    setUnreadCount(0);
    localStorage.setItem(
      "seenRenewalsCount",
      upcomingRenewals.length
    );
  }
}}
              />

              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white rounded-full px-2">
                  {upcomingRenewals.length}
                </span>
              )}

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white shadow-xl rounded-xl border z-50">
                  <div className="p-4 font-semibold border-b">
                    Upcoming Renewals
                  </div>

                  {upcomingRenewals.length === 0 ? (
                    <p className="p-4 text-sm text-gray-500">
                      No renewals soon
                    </p>
                  ) : (
                    upcomingRenewals.map((sub) => (
                      <div
                        key={sub.id}
                        className="p-4 border-b text-sm"
                      >
                        🔔 {sub.serviceName} renews on{" "}
                        {new Date(
                          sub.renewalDate
                        ).toLocaleDateString()}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* User */}
            <span className="text-gray-600 font-medium">
              Hello, {userName}
            </span>

            <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-sm">
              {userName[0].toUpperCase()}
            </div>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-blue-600"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}