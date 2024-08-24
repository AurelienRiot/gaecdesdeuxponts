"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import { createCustomer } from "@/components/pdf/pdf-data";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { orderSchema, type OrderFormValues } from "../_components/order-shema";
import createOrdersEvent from "@/components/google-events/create-orders-event";

async function createOrder(data: OrderFormValues) {
  return await safeServerAction({
    schema: orderSchema,
    data,
    getUser: checkAdmin,
    serverAction: async (data) => {
      const order = await prismadb.order.create({
        data: {
          id: data.id,
          totalPrice: data.totalPrice,
          userId: data.userId,
          dateOfShipping: data.dateOfShipping,
          dateOfPayment: data.dateOfPayment,
          dateOfEdition: data.dateOfEdition,
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

      await prismadb.order.update({
        where: {
          id: data.id,
        },
        data: {
          customer: {
            create: createCustomer(order.user),
          },
        },
      });

      if (data.dateOfShipping) {
        const event = await createOrdersEvent({ date: data.dateOfShipping });
        if (!event.success) {
          console.log(event.message);
        }
      }
      return {
        success: true,
        message: "Commande crée",
        data: {
          id: data.id,
        },
      };
    },
  });
}

export default createOrder;
