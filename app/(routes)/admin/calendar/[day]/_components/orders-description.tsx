import type getOrders from "@/components/google-events/get-orders-for-events";
import Link from "next/link";

function OrderDescriptions({
  formattedOrders,
}: { formattedOrders: Awaited<ReturnType<typeof getOrders>>["formattedOrders"] }) {
  if (formattedOrders.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <DirectionUrl formattedOrders={formattedOrders} />
      {formattedOrders.map((order) => (
        <div key={order.id}>
          <Link href={`/admin/orders/${order.id}`} target="_blank" className="text-blue-500 font-bold"></Link>
          <Link href={`/admin/users/${order.customerId}`} target="_blank" className="text-blue-500 font-bold">
            {order.name}
          </Link>
          {order.orderItems.map((item) => (
            <p key={item.itemId}>
              {" "}
              <strong>{item.name}</strong> : {item.quantity} {item.unit || ""}
            </p>
          ))}
          <Link
            href={`https://maps.google.com/?q=${order.shippingAddress}+${order.company}`}
            target="_blank"
            className="text-blue-500 font-bold"
          >
            Adresse
          </Link>
        </div>
      ))}
    </div>
  );
}

function DirectionUrl({
  formattedOrders,
}: { formattedOrders: Awaited<ReturnType<typeof getOrders>>["formattedOrders"] }) {
  const uniqueShippingAddresses = [
    ...new Set(formattedOrders.map((order) => `${order.shippingAddress}+${order.company}`)),
  ];
  const directionString = `https://www.google.fr/maps/dir/Current+Location/${uniqueShippingAddresses.join("/")}`;

  return (
    <Link href={directionString} target="_blank" className="text-blue-500 font-bold">
      Parcoure
    </Link>
  );
}

export default OrderDescriptions;
