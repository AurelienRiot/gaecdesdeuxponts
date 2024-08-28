import type getOrders from "@/components/google-events/get-orders-for-events";
import Link from "next/link";
import DisplayItem from "./display.item";
import Image from "next/image";
import DisplayAddress from "./display-address";
import { BiMap } from "react-icons/bi"; // Import the map icon from react-icons
import { FaMapLocationDot } from "react-icons/fa6";

function OrderDescriptions({
  formattedOrders,
}: { formattedOrders: Awaited<ReturnType<typeof getOrders>>["formattedOrders"] }) {
  if (formattedOrders.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <DirectionUrl formattedOrders={formattedOrders} />

      {formattedOrders.map((order) => (
        <div key={order.id} className="bg-white p-4 rounded-md shadow-sm">
          <div className="flex items-center space-x-2">
            <Link href={`/admin/orders/${order.id}`} target="_blank" className="text-blue-500 font-bold text-lg">
              {order.image && (
                <Image
                  src={order.image}
                  alt={`Image de ${order.name}`}
                  width={40}
                  height={40}
                  className="size-10 rounded-sm object-contain mr-3 inline"
                />
              )}
              {order.name}
            </Link>
          </div>

          <div className="mt-2">
            <DisplayItem items={order.orderItems} />
          </div>

          <DisplayAddress address={order.shippingAddress} />
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
    <Link
      href={directionString}
      target="_blank"
      className="flex items-center justify-center bg-blue-500 text-white font-bold py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition-colors duration-200"
    >
      <FaMapLocationDot className="h-5 w-5 mr-3" />
      Parcours
    </Link>
  );
}

export default OrderDescriptions;
