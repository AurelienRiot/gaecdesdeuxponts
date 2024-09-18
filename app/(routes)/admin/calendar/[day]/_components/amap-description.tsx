import type getAllOrders from "@/components/google-events/get-orders-for-events";
import Image from "next/image";
import Link from "next/link";

import DisplayAddress from "./display-address";
import DisplayItem from "./display-item";

function AMAPDescrition({
  groupedAMAPOrders,
}: { groupedAMAPOrders: Awaited<ReturnType<typeof getAllOrders>>["groupedAMAPOrders"] }) {
  if (Object.keys(groupedAMAPOrders).length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {Object.values(groupedAMAPOrders).map((order) => (
        <div key={order.shopId} className="bg-white p-4 rounded-md shadow-sm space-y-4">
          <Link
            href={`${process.env.NEXT_PUBLIC_URL}/admin/shops/${order.shopId}`}
            className="text-blue-500 font-bold text-lg flex items-center"
          >
            {order.image && (
              <Image
                src={order.image}
                alt={`Image de ${order.shopName}`}
                width={40}
                height={40}
                className="size-10 rounded-sm object-contain mr-3 inline"
              />
            )}
            {order.shopName}
          </Link>

          <DisplayItem items={order.orderItems} />

          <DisplayAddress className="w-full text-center" address={order.address} />
        </div>
      ))}
    </div>
  );
}

export default AMAPDescrition;
