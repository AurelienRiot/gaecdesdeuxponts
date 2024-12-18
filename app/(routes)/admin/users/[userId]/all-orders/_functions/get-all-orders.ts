"server only";

import prismadb from "@/lib/prismadb";
import type { OrderColumn } from "../../_components/order-column";
import {
  createDatePickUp,
  createProduct,
  createProductList,
  createStatus,
} from "@/components/table-custom-fuction/cell-orders";
import { currencyFormatter } from "@/lib/utils";

async function getAllOrders(userId: string) {
  const orders = await prismadb.order.findMany({
    where: {
      userId,
      deletedAt: null,
    },
    include: {
      orderItems: true,
      shop: true,
      invoiceOrder: {
        select: { invoice: { select: { id: true, invoiceEmail: true, dateOfPayment: true } } },
        orderBy: { createdAt: "desc" },
        where: { invoice: { deletedAt: null } },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders: OrderColumn[] = orders.map((order) => ({
    id: order.id,
    shippingEmail: order.shippingEmail,
    invoiceEmail: order.invoiceOrder[0]?.invoice.invoiceEmail,
    products: createProduct(order.orderItems),
    productsList: createProductList(order.orderItems),
    datePickUp: createDatePickUp({ dateOfShipping: order.dateOfShipping, datePickUp: order.datePickUp }),
    status: createStatus(order),
    isPaid: !!order.invoiceOrder[0]?.invoice.dateOfPayment,
    totalPrice: currencyFormatter.format(order.totalPrice),
    createdAt: order.createdAt,
    shopName: order.shop?.name || "Livraison à domicile",
    shopId: order.shop?.id || "",
    shopImage: order.shop?.imageUrl,
  }));

  return formattedOrders;
}

export default getAllOrders;
