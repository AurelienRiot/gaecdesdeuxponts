import {
  createProduct,
  createProductList,
  createStatus,
} from "@/components/table-custom-fuction/cell-orders";
import { currencyFormatter } from "@/lib/utils";
import { FullOrder } from "@/types";
import { OrderColumn } from "./columns";

export function formatOrders(orders: FullOrder[]): OrderColumn[] {
  return orders.map((order) => ({
    id: order.id,
    name: order.customer?.name || "",
    userId: order.userId,
    isPaid: !!order.dateOfPayment,
    datePickUp: order.datePickUp,
    productsList: createProductList(order),
    products: createProduct(order),
    status: createStatus(order),
    totalPrice: currencyFormatter.format(order.totalPrice),
    createdAt: order.createdAt,
    shopName: order.shop?.name || "Livraison à domicile",
    shopId: order.shop?.id || "",
  }));
}
