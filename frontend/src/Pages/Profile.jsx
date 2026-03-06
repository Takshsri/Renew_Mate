import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Profile() {
  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">

        <Navbar />

        <div className="p-6">

          <h1 className="text-2xl font-bold mb-6">
            Profile
          </h1>

          <div className="bg-white p-6 rounded-xl shadow max-w-md">

            <p><strong>Name:</strong> Maya</p>
            <p><strong>Email:</strong> maya@email.com</p>

          </div>

        </div>

      </div>

    </div>
  );
}