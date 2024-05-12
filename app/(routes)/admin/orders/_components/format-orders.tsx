import {
  addressFormatter,
  currencyFormatter,
  dateFormatter,
} from "@/lib/utils";
import { OrderColumn } from "./columns";
import { Address, Order, OrderItem } from "@prisma/client";

type Orders = Order & {
  orderItems: OrderItem[];
  shop: {
    name: string;
    id: string;
  } | null;
  user: {
    id: string;
    name: string | null;
    address: Address[];
    phone: string | null;
    email: string | null;
  };
};

export function formatOrders(orders: Orders[]): OrderColumn[] {
  return orders.map((order) => ({
    id: order.id,
    userId: order.userId,
    isPaid: order.isPaid,
    datePickUp: order.datePickUp,
    name: order.name,
    productsList: order.orderItems.map((item) => {
      let name = item.name;
      if (item.quantity > 0 && item.quantity !== 1) {
        const quantity = `${item.quantity}`;
        return { name, quantity, unit: item.unit || undefined };
      }
      return { name, quantity: "" };
    }),
    products: order.orderItems
      .map((item) => {
        let name = item.name;
        if (item.quantity > 0 && item.quantity !== 1) {
          name += ` x${item.quantity}`;
        }
        return name;
      })
      .join(", "),
    totalPrice: currencyFormatter.format(order.totalPrice),
    createdAt: order.createdAt,
    shopName: order.shop?.name || "Livraison à domicile",
    shopId: order.shop?.id || "",
    dataInvoice: {
      customer: {
        id: order.user.id || "",
        name: order.user.name || "",
        address: (() => {
          const u = order.user;
          const a =
            order.user.address[0] && u.address[0].line1
              ? addressFormatter(u.address[0])
              : "";

          return a;
        })(),
        phone: order.user.phone || "",
        email: order.user.email || "",
      },

      order: {
        id: order.id,
        dateOfPayment: dateFormatter(order.datePickUp),
        dateOfEdition: dateFormatter(new Date()),
        items: order.orderItems.map((item) => ({
          desc: item.name,
          qty: item.quantity,
          priceTTC: item.price,
        })),
        total: order.totalPrice,
      },
    },
  }));
}
