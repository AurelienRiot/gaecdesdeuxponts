"use server";

import { SHIPPING_ONLY } from "@/components/auth";
import createOrdersEvent from "@/components/google-events/create-orders-event";
import { createCustomer } from "@/components/pdf/pdf-data";
import { createId } from "@/lib/id";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidateTag } from "next/cache";
import { formatOrder } from "../../../calendar/_functions/get-orders";
import { orderSchema, type OrderFormValues } from "../_components/order-schema";
import getOrdersIndex from "../_functions/get-orders-index";
import { z } from "zod";
import getProductsForOrders from "../_functions/get-products-for-orders";
import getShippingOrder, { updateProductsForOrder } from "../_functions/get-order";

async function createOrder(data: OrderFormValues) {
  return await safeServerAction({
    schema: orderSchema,
    data,
    roles: SHIPPING_ONLY,
    serverAction: async (data) => {
      return await createOrderAction(data);
    },
  });
}

async function createOrderAction({
  datePickUp,
  orderItems,
  totalPrice,
  userId,
  dateOfShipping,
  dateOfEdition,
  shopId,
}: OrderFormValues) {
  const index = await getOrdersIndex(userId, dateOfShipping);

  const order = await prismadb.order.create({
    data: {
      id: createId("order", dateOfShipping),
      totalPrice,
      userId,
      dateOfShipping,
      dateOfEdition,
      datePickUp,
      shopId,
      index,
      orderItems: {
        create: orderItems.map(({ categoryName, description, itemId, name, price, quantity, unit, tax, stocks }) => {
          return {
            itemId,
            price,
            stocks,
            quantity,
            unit,
            name,
            tax,
            categoryName,
            description,
          };
        }),
      },
    },
    include: {
      orderItems: true,
      shop: true,
      user: { include: { address: true, billingAddress: true, links: true } },
      invoiceOrder: {
        select: { invoice: { select: { id: true, invoiceEmail: true, dateOfPayment: true } } },
        orderBy: { createdAt: "desc" },
        where: { invoice: { deletedAt: null } },
      },
    },
  });

  const customer = createCustomer(order.user);
  await prismadb.shippingCustomer.create({
    data: {
      orderId: order.id,
      ...customer,
    },
  });

  await createOrdersEvent(dateOfShipping || datePickUp);
  revalidateTag("orders");
  return {
    success: true,
    message: "Commande crée",
    data: formatOrder(order),
  };
}

const newOrderSchema = z.object({
  userId: z.string().min(1, { message: "L'utilisateur est requis" }),
  dateOfShipping: z.date({ message: "La date d'envoi est requise" }),
  newOrderId: z.string(),
});

async function createNewOrder(data: z.infer<typeof newOrderSchema>) {
  return await safeServerAction({
    schema: newOrderSchema,
    data,
    roles: SHIPPING_ONLY,
    serverAction: async ({ newOrderId, dateOfShipping, userId }) => {
      const [products, initialData] = await Promise.all([
        getProductsForOrders(),
        getShippingOrder({
          orderId: "new",
          dateOfShipping,
          userId,
          newOrderId,
        }),
      ]);
      if (!initialData) {
        return { success: false, message: "Commande introuvable" };
      }

      const formattedOrder: OrderFormValues = {
        ...updateProductsForOrder(initialData, products),
        id: "1",
      };

      return await createOrderAction(formattedOrder);
    },
  });
}

export { createOrder, createNewOrder };
