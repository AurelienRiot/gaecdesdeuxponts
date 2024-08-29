import type getOrders from "@/components/google-events/get-orders-for-events";
import Image from "next/image";
import Link from "next/link";

import { BiMap } from "react-icons/bi";
import DisplayItem from "./display-item";
import DisplayAddress from "./display-address";

function AMAPDescrition({
  groupedAMAPOrders,
}: { groupedAMAPOrders: Awaited<ReturnType<typeof getOrders>>["groupedAMAPOrders"] }) {
  if (Object.keys(groupedAMAPOrders).length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {Object.values(groupedAMAPOrders).map((order) => (
        <div key={order.shopId} className="bg-white p-4 rounded-md shadow-sm">
          <Link
            href={`${process.env.NEXT_PUBLIC_URL}/admin/shops/${order.shopId}`}
            target="_blank"
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

          <DisplayAddress address={order.address} />
        </div>
      ))}
    </div>
  );
}

export default AMAPDescrition;
