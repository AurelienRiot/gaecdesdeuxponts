import type getAllOrders from "@/components/google-events/get-orders-for-events";
import { LuMilk } from "react-icons/lu";
import { PiPackageDuotone } from "react-icons/pi";
import { TbMilk } from "react-icons/tb";

function DisplayItem({ items }: { items: Awaited<ReturnType<typeof getAllOrders>>["productQuantities"] }) {
  return (
    <div className="mt-2 space-y-2">
      {items.map((item) => (
        <div key={item.itemId} className="flex gap-1 items-center justify-start ">
          {/* Icône conditionnelle selon le type de produit */}
          {item.name.includes("bouteille") ? (
            <LuMilk className="h-5 w-5 text-blue-500" />
          ) : item.name.includes("bidon") ? (
            <TbMilk className="h-5 w-5 text-green-500" />
          ) : (
            <PiPackageDuotone className="h-5 w-5 text-gray-500" />
          )}
          <p className="text-sm col-span-7 font-medium text-gray-700">{item.name}</p>
          <p>:</p>
          <p className=" text-gray-500">
            {item.quantity}
            {item.unit || ""}
          </p>
        </div>
      ))}
    </div>
  );
}

export default DisplayItem;
