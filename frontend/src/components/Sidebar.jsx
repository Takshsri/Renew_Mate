import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="h-screen w-64 bg-gray-900 text-white p-6">

      <h2 className="text-2xl font-bold mb-10">
        RenewMate
      </h2>

      <nav className="flex flex-col gap-5">

        <Link to="/dashboard" className="hover:text-blue-400">
          Dashboard
        </Link>

        <Link to="/subscriptions" className="hover:text-blue-400">
          Subscriptions
        </Link>

        <Link to="/add-subscription" className="hover:text-blue-400">
          Add Subscription
        </Link>

        <Link to="/profile" className="hover:text-blue-400">
          Profile
        </Link>

      </nav>
    </div>
  );
}