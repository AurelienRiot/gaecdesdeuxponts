import type getOrders from "@/components/google-events/get-orders-for-events";
import { Button } from "@/components/ui/button";
import { ListOrdered } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaMapLocationDot } from "react-icons/fa6";
import { destination, origin } from "../../_components/direction-schema";
import DisplayAddress from "./display-address";
import DisplayItem from "./display-item";

const googleDirectioUrl = process.env.NEXT_PUBLIC_GOOGLE_DIR_URL;

function OrderDescriptions({
  formattedOrders,
}: { formattedOrders: Awaited<ReturnType<typeof getOrders>>["formattedOrders"] }) {
  if (formattedOrders.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* <DirectionUrl formattedOrders={formattedOrders} /> */}

      {formattedOrders.map((order) => (
        <div key={order.id} className="bg-white p-4 rounded-md shadow-sm">
          <div className="flex items-center space-x-2">
            <Link href={`/admin/orders/${order.id}`} className="text-gray-800 font-bold text-lg">
              {order.image && (
                <Image
                  src={order.image}
                  alt={`Image de ${order.name}`}
                  width={40}
                  height={40}
                  className="size-10 rounded-sm object-contain mr-3 inline"
                />
              )}
              {order.company ? order.company : order.name}
            </Link>
          </div>

          <div className="mt-2">
            <DisplayItem items={order.orderItems} />
          </div>
          <div className="flex gap-2 justify-center items-center mt-2">
            <DisplayAddress address={order.shippingAddress} />
            <Button
              asChild
              variant={"shine"}
              className={
                order.shippingEmail
                  ? "from-green-500 via-green-500/50 to-green-500"
                  : "from-red-500 via-red-500/50 to-red-500"
              }
            >
              <Link href={`/admin/orders/${order.id}`}>
                <ListOrdered className="h-5 w-5 mr-3" />
                Commande
              </Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function DirectionUrl({
  formattedOrders,
}: { formattedOrders: Awaited<ReturnType<typeof getOrders>>["formattedOrders"] }) {
  const uniqueShippingAddresses = [...new Set(formattedOrders.map((order) => `${order.shippingAddress}`))];

  const directionString = `${googleDirectioUrl}/${origin.label}/${uniqueShippingAddresses.join("/")}/${destination.label}`;

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
