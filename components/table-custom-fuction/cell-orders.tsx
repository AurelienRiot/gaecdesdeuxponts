import { OrderWithItemsAndShop } from "@/types";
import { Row } from "@tanstack/react-table";

type ProductCellProps<T = {}> = T & {
  products: string;
  productsList: { name: string; quantity?: string; unit?: string }[];
};

function ProductCell<T>({ row }: { row: Row<ProductCellProps<T>> }) {
  return (
    <div className="flex flex-col gap-[1px]">
      {row.original.productsList.map((product) => (
        <span className="whitespace-nowrap" key={product.name}>
          {!product.unit ? (
            <>
              <strong>{product.name}</strong>
              {product.quantity ? ` x${product.quantity}` : ""}
            </>
          ) : (
            <>
              <strong>{product.name}</strong> {product.quantity} {product.unit}
            </>
          )}
        </span>
      ))}
    </div>
  );
}

function createProductList(order: OrderWithItemsAndShop) {
  return order.orderItems.map((item) => {
    let name = item.name;
    if (item.quantity > 0 && item.quantity !== 1) {
      return {
        name,
        quantity: `${item.quantity}`,
        unit: item.unit || undefined,
      };
    }
    return { name, quantity: "", unit: undefined };
  });
}

function createProduct(order: OrderWithItemsAndShop) {
  return order.orderItems
    .map((item) => {
      let name = item.name;
      if (item.quantity > 0 && item.quantity !== 1) {
        name += ` x${item.quantity}`;
      }
      return name;
    })
    .join(", ");
}

export type Status =
  | "En cours de validation"
  | "Commande valide"
  | "En cours de paiement"
  | "Payé";

function createStatus(order: OrderWithItemsAndShop): Status {
  return !order.dateOfEdition
    ? "En cours de validation"
    : !order.dateOfShipping
      ? "Commande valide"
      : !order.dateOfPayment
        ? "En cours de paiement"
        : "Payé";
}
export { ProductCell, createProduct, createProductList, createStatus };
