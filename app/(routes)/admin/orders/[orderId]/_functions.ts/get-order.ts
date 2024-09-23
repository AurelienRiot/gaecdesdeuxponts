import prismadb from "@/lib/prismadb";
import { unstable_cache } from "next/cache";
import type { OrderFormProps } from "../_components/order-form";

const getShippingOrder = unstable_cache(
  async (orderId: string, dateOfShipping?: Date, newOrder?: boolean) => {
    const shippingOrders = await prismadb.order.findUnique({
      where: {
        id: orderId,
        deletedAt: null,
      },
      select: {
        id: true,
        totalPrice: true,
        dateOfShipping: true,
        dateOfEdition: true,
        shippingEmail: true,
        orderItems: {
          select: {
            name: true,
            itemId: true,
            unit: true,
            tax: true,
            price: true,
            quantity: true,
            categoryName: true,
            description: true,
          },
        },
        userId: true,
        shopId: true,
        datePickUp: true,
        invoiceOrder: {
          select: { invoice: { select: { id: true, invoiceEmail: true, dateOfPayment: true } } },
          where: { invoice: { deletedAt: null } },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    const initialData: OrderFormProps["initialData"] = !shippingOrders
      ? null
      : newOrder
        ? {
            ...shippingOrders,
            dateOfShipping,
            orderItems: shippingOrders.orderItems.filter((item) => item.quantity > 0 && item.price > 0),
            id: null,
          }
        : {
            ...shippingOrders,
            invoiceId: shippingOrders.invoiceOrder[0]?.invoice.id,
            invoiceEmail: shippingOrders.invoiceOrder[0]?.invoice.invoiceEmail,
          };
    return initialData;
  },
  ["getShippingOrder"],
  { revalidate: 60 * 60 * 24, tags: ["orders"] },
);

export default getShippingOrder;
