import type getOrders from "@/components/google-events/get-orders-for-events";
import { PiPackageDuotone } from "react-icons/pi";

function ProductDescription({
  productQuantities,
}: { productQuantities: Awaited<ReturnType<typeof getOrders>>["productQuantities"] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Résumé des produits</h2>
      <div className="space-y-2">
        {productQuantities.map((item) => (
          <div key={item.itemId} className="text-sm flex items-center space-x-2">
            <PiPackageDuotone className="h-5 w-5" />
            <div>
              <strong>{item.name}</strong>: {item.quantity} {item.unit || ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductDescription;
