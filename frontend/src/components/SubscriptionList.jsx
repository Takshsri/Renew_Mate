import SubscriptionCard from "./SubscriptionCard";

export default function SubscriptionList() {

  const subscriptions = [
    { id: 1, name: "Netflix", price: 649, renewal: "10 July" },
    { id: 2, name: "Spotify", price: 119, renewal: "15 July" },
    { id: 3, name: "Amazon Prime", price: 1499, renewal: "20 July" },
  ];

  return (
    <div className="flex flex-col gap-4">

      {subscriptions.map((sub) => (
        <SubscriptionCard
          key={sub.id}
          name={sub.name}
          price={sub.price}
          renewal={sub.renewal}
        />
      ))}

    </div>
  );
}