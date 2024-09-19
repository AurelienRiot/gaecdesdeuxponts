import prismadb from "@/lib/prismadb";
import { unstable_cache } from "next/cache";
import type { ProductFormProps } from "../_components/order-form";

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
        dateOfPayment: true,
        dateOfShipping: true,
        dateOfEdition: true,
        invoiceEmail: true,
        shippingEmail: true,
        orderItems: {
          select: {
            name: true,
            itemId: true,
            unit: true,
            price: true,
            quantity: true,
            categoryName: true,
            description: true,
          },
        },
        userId: true,
        shopId: true,
        datePickUp: true,
      },
    });
    const initialData: ProductFormProps["initialData"] = !shippingOrders
      ? null
      : newOrder
        ? {
            ...shippingOrders,
            dateOfShipping,
            orderItems: shippingOrders.orderItems.filter((item) => item.quantity > 0 && item.price > 0),
            id: null,
          }
        : shippingOrders;
    return initialData;
  },
  ["getShippingOrder"],
  { revalidate: 60 * 60 * 24, tags: ["orders"] },
);

export default getShippingOrder;
