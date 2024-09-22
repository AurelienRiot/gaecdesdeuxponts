"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import createOrdersEvent from "@/components/google-events/create-orders-event";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { orderSchema, type OrderFormValues } from "../_components/order-schema";

async function updateOrder(data: OrderFormValues & { prevDateOfShipping?: Date | null }) {
  return await safeServerAction({
    schema: orderSchema.extend({
      prevDateOfShipping: z.date().optional().nullable(),
    }),
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
      prevDateOfShipping,
      shopId,
    }) => {
      await prismadb.orderItem.deleteMany({
        where: {
          orderId: id,
        },
      });

      const shippingOrder = await prismadb.order.update({
        where: {
          id: id,
        },
        data: {
          userId: userId,
          totalPrice: totalPrice,
          dateOfShipping: dateOfShipping,
          // dateOfPayment: dateOfPayment,
          dateOfEdition: dateOfEdition || new Date(),
          datePickUp: datePickUp,
          shopId: shopId,
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

      await Promise.all([
        (async () => {
          if (dateOfShipping) {
            await createOrdersEvent({ date: dateOfShipping });
          }
        })(),
        (async () => {
          if (prevDateOfShipping && prevDateOfShipping.getDate() !== dateOfShipping?.getDate()) {
            await createOrdersEvent({ date: prevDateOfShipping });
          }
        })(),
      ]);
      revalidateTag("orders");

      return {
        success: true,
        message: "Commande mise à jour",
      };
    },
  });
}

export default updateOrder;
