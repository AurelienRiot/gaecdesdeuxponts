"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import { createCustomer } from "@/components/pdf/pdf-data";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { orderSchema, type OrderFormValues } from "../_components/order-shema";
import createOrdersEvent from "@/components/google-events/create-orders-event";
import { revalidateTag } from "next/cache";
import { z } from "zod";

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
          dateOfPayment: dateOfPayment,
          dateOfEdition: dateOfEdition || new Date(),
          datePickUp: datePickUp,
          shopId: shopId,
          orderItems: {
            create: orderItems.map((product) => {
              return {
                itemId: product.itemId,
                price: product.price || 0,
                quantity: product.quantity,
                unit: product.unit,
                name: product.name,
                categoryName: product.categoryName,
                description: product.description,
              };
            }),
          },
        },
        include: { user: { include: { address: true, billingAddress: true } } },
      });

      await Promise.all([
        (async () => {
          const customer = createCustomer(shippingOrder.user);
          await prismadb.order.update({
            where: {
              id: id,
            },
            data: {
              customer: {
                upsert: {
                  create: customer,
                  update: customer,
                },
              },
            },
          });
        })(),
        (async () => {
          if (dateOfShipping) {
            console.log(dateOfShipping);
            revalidateTag("orders");
            await createOrdersEvent({ date: dateOfShipping });
          }
        })(),
        (async () => {
          if (prevDateOfShipping && prevDateOfShipping !== dateOfShipping) {
            console.log(prevDateOfShipping);
            revalidateTag("orders");
            await createOrdersEvent({ date: prevDateOfShipping });
          }
        })(),
      ]);

      return {
        success: true,
        message: "Commande mise à jour",
      };
    },
  });
}

export default updateOrder;
