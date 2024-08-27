import type getOrders from "@/components/google-events/get-orders-for-events";
import Link from "next/link";

function AMAPDescrition({
  groupedAMAPOrders,
}: { groupedAMAPOrders: Awaited<ReturnType<typeof getOrders>>["groupedAMAPOrders"] }) {
  if (Object.keys(groupedAMAPOrders).length === 0) {
    return null;
  }

  return (
    <div>
      {Object.values(groupedAMAPOrders).map((order) => (
        <div key={order.shopId}>
          <Link
            href={`${process.env.NEXT_PUBLIC_URL}/admin/shop/${order.shopId}`}
            target="_blank"
            className="text-blue-500 font-bold"
          >
            {order.shopName}
          </Link>
          {order.orderItems.map((item) => (
            <p key={item.itemId}>
              {" "}
              <strong>{item.name}</strong> : {item.quantity} {item.unit || ""}
            </p>
          ))}
          <Link
            href={`https://maps.google.com/?q=${order.address}`}
            target="_blank"
            className="text-blue-500 font-bold"
          >
            Addresse
          </Link>
        </div>
      ))}
    </div>
  );
}

export default AMAPDescrition;
