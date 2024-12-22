"use server";

import { SHIPPING_ONLY } from "@/components/auth";
import { createCustomer } from "@/components/pdf/pdf-data";
import prismadb from "@/lib/prismadb";
import { revalidateOrders } from "@/lib/revalidate-path";
import safeServerAction from "@/lib/server-action";
import { z } from "zod";
import { formatOrder } from "../../../calendar/_functions/get-orders";
import { orderSchema, type OrderFormValues } from "../_components/order-schema";
import getOrdersIndex from "../_functions/get-orders-index";

async function updateOrder(data: OrderFormValues & { prevDateOfShipping?: Date | null }) {
  return await safeServerAction({
    schema: orderSchema.extend({
      prevDateOfShipping: z.date().optional().nullable(),
    }),
    data,
    roles: SHIPPING_ONLY,
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
              ({ categoryName, description, itemId, name, price, quantity, unit, tax, stocks, icon }) => {
                return {
                  itemId,
                  price,
                  quantity,
                  stocks,
                  unit,
                  tax,
                  name,
                  icon,
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
      const updadedOrders = await prismadb.order.update({
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
        include: {
          orderItems: true,
          shop: true,
          user: { select: { email: true, name: true, company: true, address: true, image: true } },
          invoiceOrder: {
            select: { invoice: { select: { id: true, invoiceEmail: true, dateOfPayment: true } } },
            orderBy: { createdAt: "desc" },
            where: { invoice: { deletedAt: null } },
          },
        },
      });

      // await Promise.all([
      //   (async () => {
      //     if (dateOfShipping) {
      //       await createOrdersEvent(dateOfShipping);
      //     }
      //   })(),
      //   (async () => {
      //     if (prevDateOfShipping && prevDateOfShipping.getDate() !== dateOfShipping?.getDate()) {
      //       await createOrdersEvent(prevDateOfShipping);
      //     }
      //   })(),
      // ]);
      revalidateOrders();

      return {
        success: true,
        message: "Commande mis à jour",
        data: formatOrder(updadedOrders),
      };
    },
  });
}

export default updateOrder;
