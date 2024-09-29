import type { ProductQuantities } from "@/components/google-events/get-orders-for-events";
import { DisplayProductIcon } from "@/components/product";
import { nanoid } from "@/lib/id";
import { cn, numberFormat2Decimals } from "@/lib/utils";

function DisplayItem({ items }: { items: ProductQuantities[] }) {
  return (
    <div className="mt-2 space-y-2">
      {items.map((item) => (
        <div key={nanoid()} className={"flex gap-1 items-center justify-start "}>
          {/* Icône conditionnelle selon le type de produit */}
          <DisplayProductIcon name={item.name} />
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
