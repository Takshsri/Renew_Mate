import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import AddSubscriptionForm from "../components/AddSubscriptionForm";

export default function AddSubscription() {
  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">

        <Navbar />

        <div className="p-6">

          <h1 className="text-2xl font-bold mb-6">
            Add Subscription
          </h1>

          <AddSubscriptionForm />

        </div>

      </div>

    </div>
  );
}