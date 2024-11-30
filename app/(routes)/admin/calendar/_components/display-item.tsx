import { displayQuantity } from "@/components/google-events";
import { DisplayProductIcon } from "@/components/product";
import { nanoid } from "@/lib/id";
import { cn } from "@/lib/utils";

function DisplayItem({
  items,
}: { items: { name: string; quantity: number; unit?: string | null; icon?: string | null }[] }) {
  return (
    <div className="mt-2 space-y-2">
      {items.map((item) => (
        <div key={nanoid()} className={"flex gap-1 items-center justify-start "}>
          {/* Icône conditionnelle selon le type de produit */}
          <DisplayProductIcon icon={item.icon} />
          <p className={cn("text-sm  font-medium ", item.quantity < 0 ? "text-red-500" : " text-gray-700")}>
            {item.name} : {displayQuantity(item.name, item.quantity)}
            {item.unit || ""}
          </p>
        </div>
      ))}
    </div>
  );
}

export default DisplayItem;
