"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import createOrdersEvent from "@/components/google-events/create-orders-event";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidateTag } from "next/cache";
import { orderSchema, type OrderFormValues } from "../_components/order-schema";

async function createOrder(data: OrderFormValues) {
  return await safeServerAction({
    schema: orderSchema,
    data,
    getUser: checkAdmin,
    serverAction: async ({
      datePickUp,
      id,
      orderItems,
      totalPrice,
      userId,
      dateOfEdition,
      dateOfPayment,
      dateOfShipping,
      shopId,
    }) => {
      await prismadb.order.create({
        data: {
          id,
          totalPrice,
          userId,
          dateOfShipping,
          // dateOfPayment,
          dateOfEdition,
          datePickUp,
          shopId,
          orderItems: {
            create: orderItems.map(({ categoryName, description, itemId, name, price, quantity, unit }) => {
              return {
                itemId,
                price,
                quantity,
                unit,
                name,
                categoryName,
                description,
              };
            }),
          },
        },
        include: { user: { include: { address: true, billingAddress: true } } },
      });

      if (dateOfShipping) {
        await createOrdersEvent({ date: dateOfShipping });
      }
      revalidateTag("orders");
      return {
        success: true,
        message: "Commande crée",
        data: {
          id,
        },
      };
    },
  });
}

export default createOrder;
