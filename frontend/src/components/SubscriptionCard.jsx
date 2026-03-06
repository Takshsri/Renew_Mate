export default function SubscriptionCard({ name, price, renewal }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow flex justify-between items-center">

      <div>
        <h3 className="font-semibold text-lg">
          {name}
        </h3>

        <p className="text-gray-500 text-sm">
          Next renewal: {renewal}
        </p>
      </div>

      <div className="text-blue-600 font-bold">
        ₹{price}
      </div>

    </div>
  );
}