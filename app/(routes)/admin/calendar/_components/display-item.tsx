import type { ProductQuantities } from "@/components/google-events/get-orders-for-events";
import { nanoid } from "@/lib/id";
import { cn, numberFormat2Decimals } from "@/lib/utils";
import { BsBasketFill } from "react-icons/bs";
import { LuMilk } from "react-icons/lu";
import { PiPackageDuotone } from "react-icons/pi";
import { TbMilk } from "react-icons/tb";

function DisplayItem({ items }: { items: ProductQuantities[] }) {
  return (
    <div className="mt-2 space-y-2">
      {items.map((item) => (
        <div key={nanoid()} className={"flex gap-1 items-center justify-start "}>
          {/* Icône conditionnelle selon le type de produit */}
          {item.name.toLowerCase().includes("bouteille") ? (
            <LuMilk className="h-5 w-5 text-blue-500" />
          ) : item.name.toLowerCase().includes("bidon") ? (
            <TbMilk className="h-5 w-5 text-green-500" />
          ) : item.name.toLowerCase().includes("casier") ? (
            <BsBasketFill className="h-5 w-5 text-red-500" />
          ) : (
            <PiPackageDuotone className="h-5 w-5 text-gray-500" />
          )}
          <p className={cn("text-sm col-span-7 font-medium ", item.quantity < 0 ? "text-red-500" : " text-gray-700")}>
            {item.name}
          </p>
          <p className={item.quantity < 0 ? "text-red-500" : " text-black"}>:</p>
          <p className={item.quantity < 0 ? "text-red-500" : " text-gray-500"}>
            {numberFormat2Decimals(item.quantity)}
            {item.unit || ""}
            {item.name.toLowerCase().includes("casier") ? ` (${Math.round(item.quantity * 12)})` : ""}
          </p>
        </div>
      ))}
    </div>
  );
}

export default DisplayItem;
