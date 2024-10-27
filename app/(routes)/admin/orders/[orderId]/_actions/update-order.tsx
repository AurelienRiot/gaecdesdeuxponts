"use server";

import createOrdersEvent from "@/components/google-events/create-orders-event";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { orderSchema, type OrderFormValues } from "../_components/order-schema";
import { createCustomer } from "@/components/pdf/pdf-data";
import getOrdersIndex from "../_functions/get-orders-index";
import { ADMIN } from "@/components/auth";

async function updateOrder(data: OrderFormValues & { prevDateOfShipping?: Date | null }) {
  return await safeServerAction({
    schema: orderSchema.extend({
      prevDateOfShipping: z.date().optional().nullable(),
    }),
    data,
    roles: ADMIN,
    serverAction: async ({
      datePickUp,
      id,
      orderItems,
      totalPrice,
      userId,
      dateOfEdition,
      dateOfShipping,
      prevDateOfShipping,
      shopId,
    }) => {
      await prismadb.orderItem.deleteMany({
        where: {
          orderId: id,
        },
      });

      const order = await prismadb.order.update({
        where: {
          id: id,
        },
        data: {
          userId,
          totalPrice,
          dateOfShipping,
          dateOfEdition,
          datePickUp,
          shopId,
          orderItems: {
            create: orderItems.map(
              ({ categoryName, description, itemId, name, price, quantity, unit, tax, stocks }) => {
                return {
                  itemId,
                  price,
                  quantity,
                  stocks,
                  unit,
                  tax,
                  name,
                  categoryName,
                  description,
                };
              },
            ),
          },
        },
        include: { user: { include: { address: true, billingAddress: true } } },
      });

      const index =
        dateOfShipping && prevDateOfShipping && dateOfShipping.getTime() !== prevDateOfShipping.getTime()
          ? await getOrdersIndex(userId, dateOfShipping)
          : order.index;

      const customer = createCustomer(order.user);
      await prismadb.order.update({
        where: {
          id: id,
        },
        data: {
          index,
          customer: {
            upsert: {
              create: customer,
              update: customer,
            },
          },
        },
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
        message: "Commande mis à jour",
      };
    },
  });
}

export default updateOrder;
