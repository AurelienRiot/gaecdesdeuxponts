import {
  createDataInvoice,
  createProduct,
  createProductList,
  createStatus,
} from "@/components/table-custom-fuction/cell-orders";
import { currencyFormatter } from "@/lib/utils";
import { OrderWithItemsAndUserAndShop } from "@/types";
import { OrderColumn } from "./columns";

export function formatOrders(
  orders: OrderWithItemsAndUserAndShop[],
): OrderColumn[] {
  return orders.map((order) => ({
    id: order.id,
    userId: order.userId,
    isPaid: !!order.dateOfPayment,
    datePickUp: order.dateOfShipping || order.datePickUp,
    name: order.name,
    productsList: createProductList(order),
    products: createProduct(order),
    status: createStatus(order),
    totalPrice: currencyFormatter.format(order.totalPrice),
    createdAt: order.createdAt,
    shopName: order.shop?.name || "Livraison à domicile",
    shopId: order.shop?.id || "",
    dataInvoice: createDataInvoice({ user: order.user, order }),
  }));
}
