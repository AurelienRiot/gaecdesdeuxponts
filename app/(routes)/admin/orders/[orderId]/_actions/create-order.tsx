"use server";

import createOrdersEvent from "@/components/google-events/create-orders-event";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidateTag } from "next/cache";
import { orderSchema, type OrderFormValues } from "../_components/order-schema";
import { createCustomer } from "@/components/pdf/pdf-data";
import { createId } from "@/lib/id";

async function createOrder(data: OrderFormValues) {
  return await safeServerAction({
    schema: orderSchema,
    data,
    roles: ["admin"],
    serverAction: async ({ datePickUp, orderItems, totalPrice, userId, dateOfEdition, dateOfShipping, shopId }) => {
      const order = await prismadb.order.create({
        data: {
          id: createId("order", dateOfShipping),
          totalPrice,
          userId,
          dateOfShipping,
          dateOfEdition,
          datePickUp,
          shopId,
          orderItems: {
            create: orderItems.map(({ categoryName, description, itemId, name, price, quantity, unit, tax }) => {
              return {
                itemId,
                price,
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
        include: { user: { include: { address: true, billingAddress: true } } },
      });

      const customer = createCustomer(order.user);
      await prismadb.shippingCustomer.create({
        data: {
          orderId: order.id,
          ...customer,
        },
      });

      if (dateOfShipping) {
        await createOrdersEvent({ date: dateOfShipping });
      }
      revalidateTag("orders");
      return {
        success: true,
        message: "Commande crée",
        data: {
          id: order.id,
        },
      };
    },
  });
}

export default createOrder;
