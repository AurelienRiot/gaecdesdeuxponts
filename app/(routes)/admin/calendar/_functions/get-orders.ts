import type { OrderCardProps } from "@/components/display-orders/order-card";
import { getUserName, createProductList } from "@/components/table-custom-fuction";
import { createDatePickUp, createProduct, createStatus } from "@/components/table-custom-fuction/cell-orders";
import prismadb from "@/lib/prismadb";
import { currencyFormatter } from "@/lib/utils";

export const getOrdersByDate = async ({ from, to }: { from: Date; to: Date }) => {
  const orders = await prismadb.order.findMany({
    where: {
      dateOfShipping: {
        gte: from,
        lt: to,
      },
      deletedAt: null,
    },
    include: {
      orderItems: true,
      shop: true,
      user: { include: { address: true, billingAddress: true } },
      customer: true,
    },
  });
  const formattedOrders: OrderCardProps[] = orders
    .map((order) => ({
      id: order.id,
      image: order.user.image,
      userId: order.userId,
      name: getUserName(order.user),
      shippingDate: createDatePickUp({ dateOfShipping: order.dateOfShipping, datePickUp: order.datePickUp }),
      productsList: createProductList(order.orderItems),
      products: createProduct(order.orderItems),
      status: createStatus(order),
      totalPrice: currencyFormatter.format(order.totalPrice),
      createdAt: order.createdAt,
      shopName: order.shop?.name || "Livraison à domicile",
      shopId: order.shop?.id || "",
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
  return formattedOrders;
};
