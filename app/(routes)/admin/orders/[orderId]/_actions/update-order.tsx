"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import { createCustomer } from "@/components/pdf/pdf-data";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { orderSchema, type OrderFormValues } from "../_components/order-shema";
import createOrdersEvent from "@/components/google-events/create-orders-event";
import { revalidateTag } from "next/cache";

async function updateOrder(data: OrderFormValues) {
  return await safeServerAction({
    schema: orderSchema,
    data,
    getUser: checkAdmin,
    serverAction: async (data) => {
      await prismadb.orderItem.deleteMany({
        where: {
          orderId: data.id,
        },
      });

      const shippingOrder = await prismadb.order.update({
        where: {
          id: data.id,
        },
        data: {
          userId: data.userId,
          totalPrice: data.totalPrice,
          dateOfShipping: data.dateOfShipping,
          dateOfPayment: data.dateOfPayment,
          dateOfEdition: data.dateOfEdition || new Date(),
          datePickUp: data.datePickUp,
          shopId: data.shopId,
          orderItems: {
            create: data.orderItems.map((product) => {
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

      const customer = createCustomer(shippingOrder.user);
      await prismadb.order.update({
        where: {
          id: data.id,
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

      if (data.dateOfShipping) {
        revalidateTag("orders");
        await createOrdersEvent({ date: data.dateOfShipping });
      }

      return {
        success: true,
        message: "Commande mise à jour",
      };
    },
  });
}

export default updateOrder;
