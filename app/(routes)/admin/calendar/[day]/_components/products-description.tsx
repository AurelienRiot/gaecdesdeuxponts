import type getOrders from "@/components/google-events/get-orders-for-events";
import DisplayItem from "./display.item";

function ProductDescription({
  productQuantities,
}: { productQuantities: Awaited<ReturnType<typeof getOrders>>["productQuantities"] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold bg-blue-100 p-2 rounded-md">Résumé des produits</h2>
      <div className="space-y-2 bg-white p-4 rounded-md shadow-sm">
        <DisplayItem items={productQuantities} />
      </div>
    </div>
  );
}

export default ProductDescription;
