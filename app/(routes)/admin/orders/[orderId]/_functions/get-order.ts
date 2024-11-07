import prismadb from "@/lib/prismadb";
import { unstable_cache } from "next/cache";
import type { OrderFormProps } from "../_components/order-form";
import { getLocalIsoString } from "@/lib/date-utils";
import { createId } from "@/lib/id";

const getShippingOrder = unstable_cache(
  async ({
    orderId,
    dateOfShipping,
    userId,
    newOrderId,
  }: { orderId: string; newOrderId?: string; dateOfShipping?: Date; userId?: string }) => {
    if (userId && dateOfShipping) {
      const defaultOrder = await prismadb.defaultOrder.findUnique({
        where: {
          userId_day: {
            userId,
            day: new Date(getLocalIsoString(dateOfShipping)).getUTCDay(),
          },
        },
        include: {
          defaultOrderProducts: { include: { product: { include: { product: true, stocks: true } } } },
        },
      });
      if (defaultOrder) {
        return {
          dateOfShipping,
          orderItems: defaultOrder.defaultOrderProducts.map(({ product, price, quantity }) => ({
            categoryName: product.product.categoryName,
            description: product.description,
            itemId: product.id,
            name: product.name,
            price,
            quantity,
            unit: product.unit,
            stocks: product.stocks.map((stock) => stock.stockId),
            tax: product.tax,
            id: createId("orderItem"),
          })),
          userId,
          datePickUp: dateOfShipping,
          totalPrice: defaultOrder.defaultOrderProducts.reduce((acc, curr) => acc + curr.price * curr.quantity, 0),
          shopId: defaultOrder.shopId,
          id: null,
          invoiceId: null,
          invoiceEmail: null,
          shippingEmail: null,
          dateOfPayment: null,
        };
      }
    }

    const shippingOrders = await prismadb.order.findUnique({
      where: {
        id: orderId === "new" && newOrderId ? newOrderId : orderId,
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
            id: true,
            stocks: true,
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
      : orderId === "new"
        ? {
            ...shippingOrders,
            dateOfShipping,
            orderItems: shippingOrders.orderItems.filter((item) => item.quantity > 0 && item.price >= 0),
            id: null,
          }
        : {
            ...shippingOrders,
            invoiceId: shippingOrders.invoiceOrder[0]?.invoice.id,
            invoiceEmail: shippingOrders.invoiceOrder[0]?.invoice.invoiceEmail,
            dateOfPayment: shippingOrders.invoiceOrder[0]?.invoice.dateOfPayment,
          };

    return initialData;
  },
  ["getShippingOrder"],
  { revalidate: 60 * 60 * 24, tags: ["orders", "invoices", "defaultOrders"] },
);

export default getShippingOrder;
