export default function Navbar() {
  return (
    <div className="w-full h-16 bg-white shadow flex items-center justify-between px-6">
      <h1 className="text-xl font-bold text-gray-800">
        RenewMate Dashboard
      </h1>

      <div className="flex items-center gap-4">
        <span className="text-gray-600">Hello, Maya</span>

        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
          M
        </div>
      </div>
    </div>
  );
}