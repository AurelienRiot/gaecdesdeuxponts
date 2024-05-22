import { addressFormatter, dateFormatter } from "@/lib/utils";
import { OrderWithItemsAndShop, UserWithAddress } from "@/types";
import { Row } from "@tanstack/react-table";
import { DataInvoiceType } from "../pdf/data-invoice";
import { DisplayInvoice } from "../pdf/pdf-button";

type FactureCellProps<T = {}> = T & {
  id: string;
  isPaid: boolean;
  dataInvoice: DataInvoiceType;
};

function FactureCell<T>({ row }: { row: Row<FactureCellProps<T>> }) {
  return (
    <DisplayInvoice
      isPaid={row.original.isPaid}
      data={row.original.dataInvoice}
    />
  );
}

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
              <strong>{product.name}</strong> {product.quantity}
              {product.unit}
            </>
          )}
        </span>
      ))}
    </div>
  );
}

function createDataInvoice({
  user,
  order,
}: {
  user: UserWithAddress;
  order: OrderWithItemsAndShop;
}): DataInvoiceType {
  return {
    customer: {
      id: user.id || "",
      name: user.name ? user.name + " - " + user.company : "",
      address: (() => {
        const a =
          user?.address[0] && user?.address[0].line1
            ? addressFormatter(user.address[0])
            : "";
        return a;
      })(),
      phone: user.phone || "",
      email: user.email || "",
    },
    order: {
      id: order.id,
      dateOfPayment: dateFormatter(order.datePickUp),
      dateOfEdition: dateFormatter(new Date()),
      dateOfShipping: null,
      items: order.orderItems.map((item) => ({
        id: item.itemId,
        desc: item.name,
        qty: item.quantity,
        priceTTC: item.price,
      })),
      totalPrice: order.totalPrice,
    },
  };
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

function createStatus(order: OrderWithItemsAndShop) {
  return !order.dateOfShipping
    ? "En cours de validation"
    : !order.dateOfPayment
      ? "Validé"
      : "Payé";
}
export {
  FactureCell,
  ProductCell,
  createDataInvoice,
  createProduct,
  createProductList,
  createStatus,
};
