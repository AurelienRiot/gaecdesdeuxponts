import type getOrders from "@/components/google-events/get-orders-for-events";
import { LuMilk } from "react-icons/lu";
import { PiPackageDuotone } from "react-icons/pi";
import { TbMilk } from "react-icons/tb";

function DisplayItem({ items }: { items: Awaited<ReturnType<typeof getOrders>>["productQuantities"] }) {
  return (
    <div className="mt-2 space-y-2">
      {items.map((item) => (
        <div key={item.itemId} className="flex items-center space-x-3">
          {/* Icône conditionnelle selon le type de produit */}
          {item.name.includes("bouteille") ? (
            <LuMilk className="h-5 w-5 text-blue-500" />
          ) : item.name.includes("bidon") ? (
            <TbMilk className="h-5 w-5 text-green-500" />
          ) : (
            <PiPackageDuotone className="h-5 w-5 text-gray-500" />
          )}
          <p>
            <span className="text-sm font-medium text-gray-700">{item.name} : </span>
            <span className=" text-gray-500">
              {item.quantity} {item.unit || ""}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}

export default DisplayItem;
