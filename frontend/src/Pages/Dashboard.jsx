import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import SubscriptionList from "../components/SubscriptionList";
import SpendingChart from "../components/SpendingChart";

export default function Dashboard() {
  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">

        <Navbar />

        <div className="p-6 grid grid-cols-2 gap-6">

          <SpendingChart />

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">
              Recent Subscriptions
            </h2>

            <SubscriptionList />

          </div>

        </div>

      </div>

    </div>
  );
}