import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import SubscriptionList from "../components/SubscriptionList";

export default function Subscriptions() {
  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">

        <Navbar />

        <div className="p-6">

          <h1 className="text-2xl font-bold mb-6">
            All Subscriptions
          </h1>

          <SubscriptionList />

        </div>

      </div>

    </div>
  );
}