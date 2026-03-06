export default function AddSubscriptionForm() {
  return (
    <form className="bg-white p-6 rounded-xl shadow flex flex-col gap-4 max-w-lg">

      <input
        type="text"
        placeholder="Subscription Name"
        className="border p-3 rounded"
      />

      <input
        type="number"
        placeholder="Price"
        className="border p-3 rounded"
      />

      <input
        type="date"
        className="border p-3 rounded"
      />

      <button
        className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
      >
        Add Subscription
      </button>

    </form>
  );
}